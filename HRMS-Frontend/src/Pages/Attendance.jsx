  import React, { useEffect, useState, useContext , useRef} from "react";
  import "./Attendance.css";
  import { AttendanceContext } from "../Context/AttendanceContext";
  import { getAllAttendance } from "../api/attendanceApi";
  import {
    getMyAttendance,
    checkIn as apiCheckIn,
    checkOut as apiCheckOut,
    approveAttendance as apiApproveAttendance,
    managerMarkAttendance as apiManagerMark
  } from "../api/attendanceApi";

  /* ================= ROLE MOCK ================= */
  const loggedUser = JSON.parse(localStorage.getItem("user")) || {};

  const teamMembers = [
    { name: "John Smith", department: "Engineering", empId: "EMP001", tos: "Full-Time" },
    { name: "Aishwarya Rao", department: "Engineering", empId: "EMP002", tos: "Part-Time" }
  ];

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
// ✅ ADD THESE
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
    /* ================= FETCH RECORDS ================= */
    const fetchRecords = async () => {
      try {
      const empId = loggedUser.empId || loggedUser.id;

const role = loggedUser?.role?.toLowerCase();

const response =
  role === "admin" || role === "manager"
    ? await getAllAttendance()   // ✅ manager also gets all
    : await getMyAttendance(empId);
const rawData = Array.isArray(response) ? response : response?.data || [];

const data = rawData.map(r => ({
empId: r.empId || r.employeeId || loggedUser.empId || "-",
  name: r.name || r.userId,
   // ✅ FIX HERE
  department: r.department || "-",
  tos: r.tos || "-",
  date: r.date,
  checkIn: r.checkIn || "-",
  checkOut: r.checkOut || "-",
  locationIn: "-",
  locationOut: "-",
  late: "No",
  earlyLeave: "-",
  status: "Approved",
  attendanceType: "Office"
}));
       const old = JSON.parse(localStorage.getItem("attendanceRecords")) || [];

        const normalizedOld = old.map(r => ({
          empId: r.empId || empId,
          tos: r.tos || loggedUser.tos,
          ...r
        }));

        const merged = [...normalizedOld, ...data].reduce((acc, curr) => {
          localStorage.removeItem("attendanceRecords"); // ✅ clear stale cache
  const exists = acc.find(r => r.empId === curr.empId && r.date === curr.date);
  if (!exists) acc.push(curr);
  return acc;
}, []);

// ✅ ADD THIS BLOCK
const cleaned = merged.filter(r =>
  role === "admin"
    ? true
    : role === "manager"
    ? true   // ✅ allow all for now
    : r.empId === empId
);

// ✅ USE CLEANED DATA
setRecords(cleaned);
      } catch (err) {
        console.error("Attendance fetch failed", err);
      }
    };

   

    useEffect(() => {
  const handleClick = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setActiveFilter(null);
    }
  };
  document.addEventListener("mousedown", handleClick);
  return () => document.removeEventListener("mousedown", handleClick);
}, []);

    useEffect(() => {
      fetchRecords();
    }, []);

    useEffect(() => {
      localStorage.setItem("attendanceRecords", JSON.stringify(records));
    }, [records]);

    /* ================= CHECK IN ================= */
    const handleCheckIn = async () => {
      if (records.find(r => r.date === selectedDate && r.empId === loggedUser.empId)) {
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
          empId: loggedUser.empId,
          tos: loggedUser.tos,
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
          setRecords(prev => [...prev, newRecord]);
          await apiCheckIn(newRecord);
          alert("Check-in successful");
          fetchRecords();
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

        const recordToUpdate = records.find(
          r => r.empId === loggedUser.empId && r.date === selectedDate
        );

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
          await apiCheckOut(updatedRecord);
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
        empId: loggedUser.empId,
        tos: loggedUser.tos,
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

      localStorage.setItem(
        "attendanceRecords",
        JSON.stringify([...records, newRecord])
      );

      alert("Work From Home marked");
    };

    const calculateHours = (checkIn, checkOut) => {
      if (!checkIn || checkIn === "-") return "-";

      const parseTime = (timeStr) => {
        const now = new Date();
        return new Date(`${now.toDateString()} ${timeStr}`);
      };

      const start = parseTime(checkIn);
      const end = checkOut && checkOut !== "-" ? parseTime(checkOut) : new Date();

      const diff = end - start;

      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      return `${hrs}h ${mins}m ${secs}s`;
    };

    /* ================= FILTER ================= */
   const role = loggedUser?.role?.toLowerCase();
    const filteredRecords =
  role === "employee"
        ? records.filter(
r => r.empId === (loggedUser.empId || loggedUser.id)
          )
        : role === "manager"
? records   // ✅ show all (backend controls later)
         : records; // ✅ admin gets ALL

         const getUnique = (key) => [...new Set(filteredRecords.map(r => r[key]))];

const filteredRecordsFinal = filteredRecords
  .filter(r =>
    Object.keys(filters).every(key => r[key] === filters[key])
  )
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


  // ✅ EXPORT FUNCTION
const handleExport = () => {
  const headers = [
    "EMP ID","DATE","NAME","DEPT","CHECK IN","CHECK OUT",
    "TOTAL HOURS","IN LOCATION","OUT LOCATION","LATE","EARLY","STATUS","TOS","TYPE"
  ];

  const rows = filteredRecordsFinal.map(r => [
    r.empId,
    r.date,
    r.name,
    r.department,
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

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map(e => e.join(",")).join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "attendance_report.csv";
  link.click();
};
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
  <button className="export" onClick={handleExport}>
    Export
  </button>
)}
        
              <>
                <button className="checkin" onClick={handleCheckIn}>Check In</button>
                <button className="checkout" onClick={handleCheckOut}>Check Out</button>
                <button className="wfh" onClick={handleWorkFromHome}>Work From Home</button>
              </>
           
          </div>
        </div>

        <div className="table-wrapper">
          <table>
<thead>

   {/* ✅ ADMIN FILTER */}
{role === "admin" && (
  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
    <div>
      <label>From:</label>
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />
    </div>

    <div>
      <label>To:</label>
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />
    </div>
  </div>
)}
  <tr>
    {[
      { key: "empId", label: "EMP ID" },
      { key: "date", label: "DATE" },
      { key: "name", label: "NAME" },
      { key: "department", label: "DEPT" },
      { key: "checkIn", label: "CHECK IN" },
      { key: "checkOut", label: "CHECK OUT" },
      { key: "total", label: "TOTAL HOURS" },
      { key: "locationIn", label: "IN LOCATION" },
      { key: "locationOut", label: "OUT LOCATION" },
      { key: "late", label: "LATE" },
      { key: "earlyLeave", label: "EARLY" },
      { key: "status", label: "STATUS" },
      { key: "tos", label: "TOS" },
      { key: "attendanceType", label: "TYPE" }
    ].map((col) => (
      <th key={col.key}>
        <div className="header">
          {col.label}
          <span onClick={() => setActiveFilter(col.key)}>⏷</span>
        </div>

        {activeFilter === col.key && (
          <div ref={popupRef} className="popup">
            <input
              placeholder="Search..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />

            <div className="list">
              {suggestions.map((s) => (
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
                  <td>{r.checkIn}</td>
                  <td>{r.checkOut}</td>
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