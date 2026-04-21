import React, { useEffect, useState, useRef } from "react";
import styles from "./Timesheet.module.css";
import { getTimesheet, approveTimesheet } from "../api/timesheetApi";



const ROLE_EMP = "employee";
const ROLE_MGR = "manager";
const ROLE_ADMIN = "admin";

export default function TimesheetManager() {
 const loggedUser = JSON.parse(localStorage.getItem("user")) || {};
 console.log("Logged User:", loggedUser);
const normalizeRole = (r) => (r || "").trim().toLowerCase();

const [role, setRole] = useState(
  normalizeRole(loggedUser?.role)
);


console.log("ROLE VALUE:", role);


  const [records, setRecords] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [filters, setFilters] = useState({});
  const popupRef = useRef();
  const [rawData, setRawData] = useState([]);
  const loggedInUser = "adhviti@gmail.com"; // TODO: get from AuthContext
const managerName = "Manager1"; // TODO: get from AuthContext
  const [rejectPopup, setRejectPopup] = useState({
  visible: false,
  empId: null,
  month: null,
});
 
  const [month, setMonth] = useState(
  new Date().toISOString().slice(0, 7)
);

//useEffect(() => {
  //const load = async () => {
    //const res = await getTimesheet(month);
    //setRecords(res);
  //};
  //load();
//}, [month]);
useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  setRole(normalizeRole(user?.role));
}, []);

  useEffect(() => {
  const load = async () => {
    const res = await getTimesheet(month);

    if (!res || res.length === 0) {
      setRecords([
        {
          empId: "U1",
          empName: "Raj",
          department: "IT",
          month: "2025-11",
          present: 2,
          leave: 1,
          lop: 0,
          halfDay: 1,
          late: 1,
          wfh: 0,
          field: 0,
          avgHours: "6.5",
          approval: "Pending"
        },
        {
          empId: "U2",
          empName: "Priya",
          department: "HR",
          month: "2025-11",
          present: 3,
          leave: 0,
          lop: 1,
          halfDay: 0,
          late: 2,
          wfh: 1,
          field: 0,
          avgHours: "7.2",
          approval: "Pending"
        }
      ]);
    } else {
     const grouped = {};

res.forEach(r => {
  const key = r.empId + "_" + (r.month || month);

  if (!grouped[key]) {
    grouped[key] = {
      empId: r.empId,
      empName: r.empId,
      department: "Office",
       reportingManager: r.managerName || "Manager1", // ✅ NEW
      month: r.month || month,
      present: 0,
      leave: 0,
      lop: 0,
      halfDay: 0,
      late: 0,
      wfh: 0,
      field: 0,
      totalHours: 0,
      days: 0,
      approval: r.status,
      status: r.status || "Pending" // ✅ ADD THIS
    };
  }

  // ✅ Example logic (adjust based on backend fields)
  grouped[key].present += r.status === "Present" ? 1 : 0;
  grouped[key].leave += r.status === "Leave" ? 1 : 0;
  grouped[key].lop += r.status === "LOP" ? 1 : 0;
  grouped[key].halfDay += r.status === "HalfDay" ? 1 : 0;
  grouped[key].late += r.late ? 1 : 0;
  grouped[key].wfh += r.mode === "WFH" ? 1 : 0;
  grouped[key].field += r.mode === "Field" ? 1 : 0;

  grouped[key].totalHours += parseFloat(r.duration || 0);
  grouped[key].days += 1;
});

// convert to array
const mapped = Object.values(grouped).map(g => {
  const avgHours = g.days > 0 ? (g.totalHours / g.days).toFixed(2) : 0;

  // ✅ HR SUMMARY (INSIDE MAP)
  const workingDays = g.present + g.wfh + g.field;
  const absentDays = g.lop;
  const payableDays = workingDays + g.leave + g.halfDay * 0.5;

  const attendancePercent =
    g.days > 0 ? ((workingDays / g.days) * 100).toFixed(1) : 0;

  const overtime =
    g.totalHours > g.days * 8
      ? (g.totalHours - g.days * 8).toFixed(2)
      : 0;

  return {
    ...g,
    avgHours,
    workingDays,
    absentDays,
    payableDays,
    attendancePercent,
    overtime
  };
});


setRecords(mapped);
    }
  };

  load();
}, [month]);





  const toMin = (t) => {
    if (!t || t === "-") return 0;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };



  /* CLOSE POPUP */
  useEffect(() => {
    const handleClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setActiveFilter(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const getUnique = (col) => [...new Set(records.map((r) => r[col]))];

  const filtered = records.filter((r) => {

  const matchesFilter = Object.keys(filters).every(
    (key) => r[key] === filters[key]
  );

  if (filters.fromMonth && r.month < filters.fromMonth) return false;
  if (filters.toMonth && r.month > filters.toMonth) return false;

  // 👤 EMPLOYEE → only own data
  if (role === ROLE_EMP) {
    return matchesFilter && r.empId === "U1"; // 🔥 replace with logged-in user ID
  }

  // 👨‍💼 MANAGER → only team data
  if (role === ROLE_MGR) {
    return matchesFilter && r.reportingManager === "Manager1"; // 🔥 replace with logged-in manager name
  }

  // 🏢 ADMIN → only approved/rejected
 if (role === ROLE_ADMIN) {
  return matchesFilter; // ✅ show all statuses
}
return matchesFilter;
});
  const suggestions =
    activeFilter &&
    getUnique(activeFilter).filter((v) =>
      String(v).toLowerCase().includes(filterText.toLowerCase())
    );

    const handleApprove = async (empId, month) => {
  try {
    await approveTimesheet(empId, month);
    alert("Approved");
  } catch (err) {
    console.error("Approve failed:", err);
    alert("Approve Success");
  }
};

const handleReject = (empId, month) => {
  setRejectPopup({
    visible: true,
    empId,
    month,
  });
};
  /* KPI */
  const totalEmp = records.length;
 const totalPresent = records.reduce((a, b) => a + (b.present || 0), 0);
  const totalLOP = records.reduce((a, b) => a + (b.lop || 0), 0);
 const avgHours =
  records.length > 0
    ? (
        records.reduce((a, b) => a + parseFloat(b.avgHours || 0), 0) /
        records.length
      ).toFixed(2)
    : 0;

  const cols = [
    { key: "empId", label: "EMP ID" },
    { key: "empName", label: "EMP NAME" },
    { key: "department", label: "DEPARTMENT" },
     { key: "reportingManager", label: "REPORTING MANAGER" }, // ✅ ADD HERE
    { key: "month", label: "MONTH" },
    { key: "present", label: "PRESENT" },
    { key: "leave", label: "LEAVE" },
    { key: "lop", label: "LOP" },
    { key: "halfDay", label: "HALF DAY" },
    { key: "late", label: "LATE" },
    { key: "wfh", label: "WFH" },
    { key: "field", label: "FIELD" },
    { key: "avgHours", label: "AVG HOURS" },
    { key: "workingDays", label: "WORKING DAYS" },
{ key: "absentDays", label: "ABSENT DAYS" },
{ key: "payableDays", label: "PAYABLE DAYS" },
{ key: "attendancePercent", label: "ATT %" },
{ key: "overtime", label: "OT HOURS" },
 // ✅ ONLY show status for EMP & ADMIN
  ...(role !== ROLE_MGR
    ? [{ key: "status", label: "STATUS" }]
    : []),
  ];

  return (
    <div className={styles.container}>
      <h2>Monthly Attendance Dashboard</h2>

      {/* KPI */}
      <div className={styles.kpiRow}>
        <div className={styles.kpiGreen}>Present: {totalPresent}</div>
        <div className={styles.kpiRed}>LOP: {totalLOP}</div>
        <div className={styles.kpiOrange}>Employees: {totalEmp}</div>
        <div className={styles.kpiBlue}>Avg Hours: {avgHours}</div>
      </div>
      {rejectPopup.visible && (
  <div className={styles.rejectPopupBackdrop}>
    <div className={styles.rejectPopup}>
      <h3>Reject Timesheet</h3>
      <p>Are you sure you want to reject timesheet for {rejectPopup.empId}?</p>
      <button
        onClick={() => {
          alert("Rejected! (Implement API here)");
          setRejectPopup({ visible: false, empId: null, month: null });
        }}
        style={{ marginRight: "5px" }}
      >
        Confirm
      </button>
      <button
        onClick={() => setRejectPopup({ visible: false, empId: null, month: null })}
      >
        Cancel
      </button>
    </div>
  </div>
)}
{/* MONTH FILTER */}
<div style={{ marginBottom: "10px" }}>
  <input
    type="month"
    value={month}
    onChange={(e) => setMonth(e.target.value)}
  />
</div>
      {/* ROLE */}
    

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c.key}>
                  <div className={styles.header}>
                    {c.label}
                    {c.key !== "status" && (
  <span onClick={() => setActiveFilter(c.key)}>⏷</span>
)}
                  </div>

               {activeFilter === c.key && c.key !== "status" && (
  <div ref={popupRef} className={styles.popup}>

    {/* 🔥 MONTH FILTER */}
    {c.key === "month" ? (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <input
          type="month"
          placeholder="From"
          value={filters.fromMonth || ""}
          onChange={(e) =>
            setFilters({ ...filters, fromMonth: e.target.value })
          }
        />

        <input
          type="month"
          placeholder="To"
          value={filters.toMonth || ""}
          onChange={(e) =>
            setFilters({ ...filters, toMonth: e.target.value })
          }
        />

        <button
          onClick={() => setActiveFilter(null)}
          style={{ marginTop: "5px" }}
        >
          Apply
        </button>
      </div>
    ) : (
      <>
        <input
          placeholder="Search..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        <div className={styles.list}>
          {suggestions.map((s) => (
            <div
              key={s}
              onClick={() => {
                setFilters({ ...filters, [c.key]: s });
                setActiveFilter(null);
                setFilterText("");
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </>
    )}

  </div>
)}
                </th>
              ))}
             {role === ROLE_MGR && <th>APPROVAL</th>}
            </tr>
          </thead>

          <tbody>
            {filtered.map((r, i) => (
              <tr key={i}>
              {cols.map((c) => (
  <td key={c.key}>
    {c.key === "status" ? (
      role === ROLE_EMP ? (
        r.status || "Pending"
      ) : role === ROLE_ADMIN ? (
        r.status === "Approved" || r.status === "Rejected"
          ? r.status
          : "-"
      ) : (
        r.status
      )
    ) : (
      r[c.key]
    )}
  </td>
))}
{role === ROLE_MGR && (
  <td>
    <select
      value={r.status || "Pending"}
      onChange={(e) => {
        const value = e.target.value;

        if (value === "Approved") {
          handleApprove(r.empId, r.month);
        } else if (value === "Rejected") {
          handleReject(r.empId, r.month);
        }

       setRecords((prev) =>
  prev.map((rec) =>
    rec.empId === r.empId && rec.month === r.month
      ? { ...rec, status: value }   // ✅ ONLY STATUS
      : rec
  )
);
      }}
    >
      <option value="Pending">Pending</option>
      <option value="Approved">Approve</option>
      <option value="Rejected">Reject</option>
    </select>
  </td>
)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}