import { useEffect, useState, useContext, useRef } from "react";
import "./Attendance.css";
import { AttendanceContext } from "../Context/AttendanceContext";
import { getAllAttendance } from "../api/attendanceApi";
import {
  getMyAttendance,
  checkIn as apiCheckIn,
  checkOut as apiCheckOut,
} from "../api/attendanceApi";
import { notifyCheckIn } from "../Utils/notificationHelper.js";

/* ================= LOGGED USER ================= */
const loggedUser = JSON.parse(localStorage.getItem("user")) || {};

export default function Attendance() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const { refresh } = useContext(AttendanceContext);

  const [activeFilter, setActiveFilter] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [filters, setFilters] = useState({});
  const popupRef = useRef();

  const [records, setRecords] = useState(
    JSON.parse(localStorage.getItem("attendanceRecords")) || []
  );

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Employee search state (admin/manager)
  const [empSearch, setEmpSearch] = useState("");

  // Export dropdown state
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef();

  /* ================= FETCH RECORDS ================= */
  const fetchRecords = async () => {
    try {
      const userId = loggedUser.id || loggedUser.empId;
      const role = loggedUser?.role?.toLowerCase();

      const response =
        role === "admin" || role === "manager"
          ? await getAllAttendance()
          : await getMyAttendance(userId);
         
          
      const rawData = Array.isArray(response)
  ? response
  : Array.isArray(response?.data)
  ? response.data
  : [];

        const formatEmpId = (id) => {
  if (!id) return "-";

  // If already formatted, keep it
  if (String(id).startsWith("EMP")) return id;

  // Extract last 3–4 digits from id
  const digits = String(id).replace(/\D/g, "").slice(-3);

  return `EMP${digits || "001"}`;
};

      const data = rawData.map(r => ({
      userId: r.userId || r.employeeId || r.empId,
        empId: formatEmpId(r.empId || r.employeeId || r.userId),
       name: r.name || r.employeeName || loggedUser.name || "Unknown Employee",
        department: r.department || "-",
        reportingManager: r.reportingManager || "-",
        tos: r.tos || "-",
        date: r.date,
        checkIn: r.checkIn || "-",
        checkOut: r.checkOut || "-",
        locationIn: r.locationIn || "-",
        locationOut: r.locationOut || "-",
        late: r.late || "No",
        earlyLeave: r.earlyLeave || "-",
        status: r.status || "Approved",
        attendanceType: r.attendanceType || "Office",
      }));

     
      // For manager: only show records of team members (users whose managerId === loggedUser.id)
      // The backend already returns all; we filter on frontend using managerId stored in user records
      // Since backend now returns userId, we can filter by managerId field if available
      const cleaned =
        role === "admin"
          ? data
          : role === "manager"
          ? data.filter(r => {
              // If the record has managerId info, filter; otherwise show all from backend
              if (r.managerId) return r.managerId === (loggedUser.id || loggedUser.empId);
              return true; // backend already scoped for manager if needed
            })
          : data.filter(r => {
              // For employees, only show their own records
              const recordUserId = String(r.userId || r.empId || "").toLowerCase();
              const loggedUserId = String(userId || "").toLowerCase();
              const loggedUserEmail = String(loggedUser.email || "").toLowerCase();
              const recordName = String(r.name || "").toLowerCase();
              const loggedUserName = String(loggedUser.name || "").toLowerCase();
              
              // Match by userId, empId, email, or name
              return (
                recordUserId === loggedUserId ||
                recordUserId === loggedUserEmail ||
                recordName === loggedUserName ||
                recordName === loggedUserEmail
              );
            });

      setRecords(cleaned);
      localStorage.setItem("attendanceRecords", JSON.stringify(cleaned));
    } catch (err) {
      console.error("Attendance fetch failed", err);
    }
  };

  /* ================= CLICK OUTSIDE HANDLERS ================= */
  useEffect(() => {
    const handleClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setActiveFilter(null);
      }
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    fetchRecords();
  }, []);

  /* ================= CHECK IN ================= */
  const handleCheckIn = async () => {
    const userId = loggedUser.id || loggedUser.empId;
    const userEmail = loggedUser.email;
    const userName = loggedUser.name;
    
    // Check if already checked in for selected date
    const existingRecord = records.find(r => {
      const recordUserId = String(r.userId || r.empId || "").toLowerCase();
      const loggedUserId = String(userId || "").toLowerCase();
      const loggedUserEmailLower = String(userEmail || "").toLowerCase();
      const recordName = String(r.name || "").toLowerCase();
      const loggedUserNameLower = String(userName || "").toLowerCase();
      
      const isMatchingUser = (
        recordUserId === loggedUserId ||
        recordUserId === loggedUserEmailLower ||
        recordName === loggedUserNameLower ||
        recordName === loggedUserEmailLower
      );
      
      return r.date === selectedDate && isMatchingUser;
    });
    
    if (existingRecord) {
      alert("Already checked in for selected date");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const time = new Date().toLocaleTimeString();
      const hour = new Date().getHours();

      const newRecord = {
        date: selectedDate,
        name: loggedUser.name,
        department: loggedUser.department,
        empId: loggedUser.employeeId || loggedUser.empId,
        userId: loggedUser.id || loggedUser.email,
        reportingManager: loggedUser.managerName || "-",
        tos: loggedUser.tos || "-",
        checkIn: time,
        checkOut: "-",
        locationIn: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
        locationOut: "-",
        late: hour > 9 ? "Yes" : "No",
        earlyLeave: "-",
        status: "Pending Approval",
        attendanceType: "Office",
        reason: ""
      };

      try {
       
        await apiCheckIn({
  userId: newRecord.userId,
   name: newRecord.name,  // ✅ ADD THIS LINE
  date: newRecord.date,
  checkIn: newRecord.checkIn,
  locationIn: newRecord.locationIn,
});
     setRecords(prev => [...prev, newRecord]);
        alert("Check-in successful");
          setTimeout(() => fetchRecords(), 500);  // ⬅️ small delay (IMPORTANT)

        // Send notification to admin about check-in
        try {
          await notifyCheckIn(
            loggedUser.name,
            loggedUser.employeeId || loggedUser.empId || "N/A",
            "admin" // This should be the admin's user ID - you may need to fetch this
          );
        } catch (notifErr) {
          console.error("Failed to send check-in notification:", notifErr);
        }
       
        if (refresh) refresh();
      } catch (err) {
        console.error("Check-in failed", err);
        alert("Check-in failed");
      }
    });
  };

  /* ================= CHECK OUT ================= */
  const handleCheckOut = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const time = new Date().toLocaleTimeString();
      const hour = new Date().getHours();
      const userId = loggedUser.id || loggedUser.empId;
      const userEmail = loggedUser.email;
      const userName = loggedUser.name;

      const recordToUpdate = records.find(r => {
        const recordUserId = String(r.userId || r.empId || "").toLowerCase();
        const loggedUserId = String(userId || "").toLowerCase();
        const loggedUserEmailLower = String(userEmail || "").toLowerCase();
        const recordName = String(r.name || "").toLowerCase();
        const loggedUserNameLower = String(userName || "").toLowerCase();
        
        const isMatchingUser = (
          recordUserId === loggedUserId ||
          recordUserId === loggedUserEmailLower ||
          recordName === loggedUserNameLower ||
          recordName === loggedUserEmailLower
        );
        
        return isMatchingUser && r.date === selectedDate;
      });

      if (!recordToUpdate) {
        alert("Check-in first");
        return;
      }

      const updatedRecord = {
        ...recordToUpdate,
        checkOut: time,
        locationOut: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
        earlyLeave: hour < 18 ? "Yes" : "No",
        status: "Pending Approval"
      };

      try {
        await apiCheckOut({
  userId: updatedRecord.userId,
  name: updatedRecord.name,// ✅ ADD THIS LINE
  date: updatedRecord.date,
  checkOut: updatedRecord.checkOut,
  locationOut: updatedRecord.locationOut,
});
        alert("Check-out successful");
        fetchRecords();
        if (refresh) refresh();
      } catch (err) {
        console.error("Check-out failed", err);
        alert("Check-out failed");
      }
    });
  };

  /* ================= WORK FROM HOME ================= */
  const handleWorkFromHome = () => {
    const time = new Date().toLocaleTimeString();
    const hour = new Date().getHours();

    const newRecord = {
      date: selectedDate,
      name: loggedUser.name,
      department: loggedUser.department,
      empId: loggedUser.employeeId || loggedUser.empId,
      userId: loggedUser.id || loggedUser.email,
      reportingManager: loggedUser.managerName || "-",
      tos: loggedUser.tos || "-",
      checkIn: time,
      checkOut: "-",
      locationIn: "WFH",
      locationOut: "-",
      late: hour > 9 ? "Yes" : "No",
      earlyLeave: "-",
      status: "Pending Approval",
      attendanceType: "Work From Home",
      reason: "WFH"
    };

    setRecords(prev => [...prev, newRecord]);
    localStorage.setItem("attendanceRecords", JSON.stringify([...records, newRecord]));
    alert("Work From Home marked");
  };

  /* ================= CALCULATE HOURS ================= */
  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || checkIn === "-") return "-";

    const parseTime = (timeStr) => {
      const now = new Date();
      return new Date(`${now.toDateString()} ${timeStr}`);
    };

    const start = parseTime(checkIn);
    const end = checkOut && checkOut !== "-" ? parseTime(checkOut) : new Date();

    const diff = end - start;
    if (diff < 0) return "-";

    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hrs}h ${mins}m ${secs}s`;
  };

  /* ================= ROLE & FILTER ================= */
  const role = loggedUser?.role?.toLowerCase();

  // Employee search filter (admin/manager can search by name or empId)
  const searchFiltered = (role === "admin" || role === "manager") && empSearch.trim()
    ? records.filter(r =>
        String(r.name).toLowerCase().includes(empSearch.toLowerCase()) ||
        String(r.empId).toLowerCase().includes(empSearch.toLowerCase())
      )
    : records;

  const getUnique = (key) => [...new Set(searchFiltered.map(r => r[key]))];

  const filteredRecordsFinal = searchFiltered
    .filter(r => Object.keys(filters).every(key => r[key] === filters[key]))
    .filter(r => {
      if (!fromDate && !toDate) return true;
      const recordDate = new Date(r.date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      if (from && recordDate < from) return false;
      if (to && recordDate > to) return false;
      return true;
    });

  const suggestions =
    activeFilter &&
    getUnique(activeFilter).filter(v =>
      String(v).toLowerCase().includes(filterText.toLowerCase())
    );

  /* ================= EXPORT ================= */
  const buildExportData = () => {
    const headers = [
      "EMP ID", "Login Date", "Emp Name", "DEPT", "REPORTING MANAGER",
      "CHECK IN", "CHECK OUT", "TOTAL HOURS",
      "IN LOCATION", "OUT LOCATION", "LATE", "EARLY", "STATUS", "TOS", "TYPE"
    ];

    const rows = filteredRecordsFinal.map(r => [
      r.empId,
      r.date,
      r.name,
      r.department,
      r.reportingManager,
      r.checkIn,
      r.checkOut,
      calculateHours(r.checkIn, r.checkOut),
      r.locationIn,
      r.locationOut,
      r.late,
      r.earlyLeave,
      r.status,
      r.tos,
      r.attendanceType
    ]);

    return { headers, rows };
  };

  const handleExportCSV = () => {
    const { headers, rows } = buildExportData();
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map(e => e.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "attendance_report.csv";
    link.click();
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const { headers, rows } = buildExportData();

    // Build a simple HTML table that Excel can open
    let tableHtml = "<table><tr>" + headers.map(h => `<th>${h}</th>`).join("") + "</tr>";
    rows.forEach(row => {
      tableHtml += "<tr>" + row.map(v => `<td>${v ?? ""}</td>`).join("") + "</tr>";
    });
    tableHtml += "</table>";

    const excelContent =
      "data:application/vnd.ms-excel;charset=utf-8," + encodeURIComponent(tableHtml);

    const link = document.createElement("a");
    link.href = excelContent;
    link.download = "attendance_report.xls";
    link.click();
    setShowExportMenu(false);
  };

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    { key: "empId", label: "EMP ID" },
    { key: "date", label: "Login Date" },
    { key: "name", label: "Emp Name" },
    { key: "department", label: "DEPT" },
    ...(role === "admin" || role === "manager"
      ? [{ key: "reportingManager", label: "REPORTING MANAGER" }]
      : []),
    { key: "checkIn", label: "CHECK IN" },
    { key: "checkOut", label: "CHECK OUT" },
    { key: "total", label: "TOTAL HOURS" },
    { key: "locationIn", label: "IN LOCATION" },
    { key: "locationOut", label: "OUT LOCATION" },
    { key: "late", label: "LATE" },
    { key: "earlyLeave", label: "EARLY" },
    { key: "status", label: "STATUS" },
    { key: "tos", label: "TOS" },
    { key: "attendanceType", label: "TYPE" },
  ];

  /* ================= RENDER ================= */
  return (
    <div className="attendance-container">
      <h2>Attendance Management</h2>

      <div className="top-panel">
        <div className="date-section">
          <label>Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <p>User: {loggedUser.name} ({loggedUser.role})</p>
        </div>

        <div className="button-group">
          {role === "admin" && (
            <div style={{ position: "relative" }} ref={exportRef}>
              <button className="export" onClick={() => setShowExportMenu(prev => !prev)}>
                Export ▾
              </button>
              {showExportMenu && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  zIndex: 999,
                  minWidth: "150px",
                  overflow: "hidden"
                }}>
                  <div
                    onClick={handleExportCSV}
                    style={{ padding: "10px 16px", cursor: "pointer", borderBottom: "1px solid #eee" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                  >
                    📄 Download CSV
                  </div>
                  <div
                    onClick={handleExportExcel}
                    style={{ padding: "10px 16px", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                  >
                    📊 Download Excel
                  </div>
                </div>
              )}
            </div>
          )}

          <>
            <button className="checkin" onClick={handleCheckIn}>Check In</button>
            <button className="checkout" onClick={handleCheckOut}>Check Out</button>
            <button className="wfh" onClick={handleWorkFromHome}>Work From Home</button>
          </>
        </div>
      </div>

      {/* Date range filter (admin/manager) */}
      {(role === "admin" || role === "manager") && (
        <div style={{ display: "flex", gap: "16px", alignItems: "center", margin: "10px 0", flexWrap: "wrap" }}>
          <div>
            <label>From: </label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div>
            <label>To: </label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        
        </div>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>
                  <div className="header">
                    {col.label}
                    {col.key !== "total" && (
                      <span onClick={() => setActiveFilter(col.key)}>⏷</span>
                    )}
                  </div>

                  {activeFilter === col.key && (
                    <div ref={popupRef} className="popup">
                      <input
                        placeholder="Search..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                      />
                      <div className="list">
                        {(suggestions || []).map((s) => (
                          <div
                            key={s}
                            onClick={() => {
                              setFilters({ ...filters, [col.key]: s });
                              setActiveFilter(null);
                              setFilterText("");
                            }}
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredRecordsFinal.map((r, index) => (
              <tr key={index}>
                <td>{r.empId}</td>
                <td>{r.date}</td>
                <td>{r.name}</td>
                <td>{r.department}</td>
                {(role === "admin" || role === "manager") && (
                  <td>{r.reportingManager || "-"}</td>
                )}
                <td>{r.checkIn}</td>
                <td>{r.checkOut && r.checkOut !== "-" ? r.checkOut : "-"}</td>
                <td>{calculateHours(r.checkIn, r.checkOut)}</td>
                <td>{r.locationIn}</td>
                <td>{r.locationOut}</td>
                <td>{r.late}</td>
                <td>{r.earlyLeave}</td>
                <td>{r.status}</td>
                <td>{r.tos}</td>
                <td>{r.attendanceType || "Office"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
