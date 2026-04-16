import React, { useMemo, useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { checkIn, checkOut } from "../api/attendanceApi";
import { AttendanceContext } from "../Context/AttendanceContext";
import { getHomeData } from "../api/homeApi";
import { getAllEmployees } from "../api/employeeApi";
import { getMyLeaves, getLeaves } from "../api/leaveApi";
import { getPayrollData } from "../api/payrollApi";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  
  CartesianGrid,   // ✅ ADD THIS
} from "recharts";

import {
  FaUsers,
  FaBell,
  FaMoneyBillWave,
  FaBirthdayCake,
  FaSearch,
  FaEllipsisH,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { AuthContext } from "../Context/Authcontext";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { getMyAttendance } from "../api/attendanceApi";
import { getBirthdays } from "../api/employeeApi";


/* ================= DUMMY USERS ================= */
//const usersData = Array.from({ length: 60 }, (_, i) => ({
 // id: i + 1,
  //name: `Employee ${i + 1}`,
  //department: ["HR", "IT", "Sales"][i % 3],
  //designation: ["Manager", "Developer", "Analyst"][i % 3],
//}));


/* ================= KPI CARD ================= */
const KpiCard = ({ icon, title, value, color, onClick }) => (
    <div className={`kpi-card ${color}`} onClick={onClick} style={{ cursor: "pointer" }}>
    <div className="kpi-content">
      <h1 className="kpi-title">{title}</h1>
      <div className="kpi-value">{value}</div>
    </div>
    <div className="kpi-icon">{icon}</div>
  </div>
);

/* ================= CHART DATA ================= */





export default function Home({ notifications, setNotifications }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [employees, setEmployees] = useState([]);  // ✅ ADD THIS HERE
  const safeEmployees = useMemo(() => {
  return Array.isArray(employees)
    ? employees
    : employees?.data || [];
}, [employees]);
 const role =
  user?.role === "admin"
    ? "hr"
    : user?.role || "employee";
     
      const safeNotifications = (notifications || []).filter(
  n => n.role === role
);
  const [homeData, setHomeData] = useState(null);
 
    const createNotification = (message, type = "info") => {
  return {
    id: Date.now() + Math.random(),
    message,
    type,
    role, // keep your logic
    read: false,
    time: new Date().toLocaleTimeString()
  };
};

 const pushGlobalNotification = (msg, type = "info", targetRole = role) => {
  const newNotif = {
    id: Date.now(),
    message: msg,
    type,
    role: targetRole, // ✅ FIXED
    read: false,
    time: new Date().toLocaleTimeString()
  };

  const existing = JSON.parse(localStorage.getItem("notifications")) || [];
  localStorage.setItem("notifications", JSON.stringify([newNotif, ...existing]));
  window.dispatchEvent(new Event("storage"));

  setNotifications(prev => [newNotif, ...prev]);
};


 
  const [leaveStats, setLeaveStats] = useState({
  balance: 0
});
const [payrollStats, setPayrollStats] = useState(0);
  const [attendanceStats, setAttendanceStats] = useState({
  present: 0,
  absent: 0
});
const [attendanceSummary, setAttendanceSummary] = useState([]);

 const [leaveSummary, setLeaveSummary] = useState([]);
const [leaveRequests, setLeaveRequests] = useState(0);





  // ================= KPI CALCULATIONS =================

  const todayPresent = useMemo(() => {
    const currentMonth = new Date().toLocaleString("default", {
      month: "short",
    });

    const monthData = attendanceSummary.find(
      item => item.month === currentMonth
    );

    return monthData?.present || 0;
  }, [attendanceSummary]);


 const orgPayroll = useMemo(() => {
  return safeEmployees.reduce(
    (sum, emp) => sum + Number(emp.salary || 0),
    0
  );
}, [safeEmployees]);

  const totalLeaveRequests = leaveSummary.reduce(
  (sum, l) => sum + (l.value || 0),
  0
);

const approvedLeaves =
  leaveSummary.find(l => l.name === "Approved")?.value || 0;

const pendingLeaves =
  leaveSummary.find(l => l.name === "Pending")?.value || 0;

  const totalLeaves = leaveSummary.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );

const testEvents = [
  { title: "HR Interview Round", type: "HR", date: "2026-04-06" },
  { title: "Team Meeting", type: "Meeting", date: "2026-04-07" },
  { title: "Public Holiday - Ugadi", type: "Holiday", date: "2026-04-08" },
  { title: "Manager Review", type: "HR", date: "2026-04-10" },
];

const getEventColor = (type) => {
  switch (type) {
    case "HR":
      return "#4f46e5"; // blue
    case "Meeting":
      return "#16a34a"; // green
    case "Holiday":
      return "#dc2626"; // red
    default:
      return "#6b7280";
  }
};

const [birthdayCount, setBirthdayCount] = useState(0);
const [showBirthdays, setShowBirthdays] = useState(false);
const [todayRecord, setTodayRecord] = useState(null);
const attendanceChartData = homeData?.attendanceGraph?.map(item => {
  const total = item.present + item.leave + item.absent;



  return {
    month: item.month,
    present: total ? ((item.present / total) * 100).toFixed(1) : 0,
    leave: total ? ((item.leave / total) * 100).toFixed(1) : 0,
    absent: total ? ((item.absent / total) * 100).toFixed(1) : 0,
  };
}) || [];
// ✅ NOW you can use it
const calculateLeaveStats = async () => {
  try {
    let data = [];

    if (role === "employee") {
      const res = await getMyLeaves(user.empId);
      data = Array.isArray(res) ? res : res.data;
    } else {
      const res = await getLeaves();
      data = Array.isArray(res) ? res : res.data;
    }

    // ✅ FILTER CURRENT MONTH
 
 data.forEach(l => {
  console.log("DATE 👉", l.startDate || l.fromDate);
});
   const currentMonth = new Date().getMonth();

let filtered = data.filter(l => {
  const d = new Date(l.startDate || l.fromDate);
  return d.getMonth() === currentMonth;
});

// 👇 IMPORTANT FIX (fallback if empty)
if (filtered.length === 0) {
  console.log("⚠️ No current month data, using all data");
  filtered = data;
}
    console.log("LEAVE DATA 👉", data);
console.log("FILTERED 👉", filtered);

  const approved = filtered.filter(l => l.status?.toLowerCase() === "approved").length;
const pending = filtered.filter(l => l.status?.toLowerCase() === "pending").length;
const rejected = filtered.filter(l => l.status?.toLowerCase() === "rejected").length;

   
    setLeaveStats({ balance: approved });

  } catch (err) {
    console.error("Leave stats error", err);
  }
};

const fetchLeaveSummary = async () => {
  try {
    let data = [];

    // ADMIN: Get all leave requests
    if (role === "hr" || role === "admin") {
      const res = await getLeaves();
      data = Array.isArray(res) ? res : res?.data || [];
      console.log("📋 ALL LEAVE DATA (ADMIN):", data);
    }
    // EMPLOYEE: Get their own leaves
    else if (role === "employee") {
      const res = await getMyLeaves(user?.empId);
      data = Array.isArray(res) ? res : res?.data || [];
      console.log("📋 MY LEAVE DATA (EMPLOYEE):", data);
    }

    // Count by status
    const approved = data.filter(l => (l.status || "").toLowerCase() === "approved").length;
    const pending = data.filter(l => (l.status || "").toLowerCase() === "pending").length;
    const rejected = data.filter(l => (l.status || "").toLowerCase() === "rejected").length;

    console.log(`✅ Leave Summary - Approved: ${approved}, Pending: ${pending}, Rejected: ${rejected}`);

    // Create notifications for pending leaves
    if (pending > 0 && role === "employee") {
      pushGlobalNotification(
        `📌 ${pending} leave request(s) pending approval`,
        "warning",
        "employee"
      );
    }

    if (approved > 0 && role === "employee") {
      pushGlobalNotification(
        `✅ ${approved} leave request(s) approved`,
        "success",
        "employee"
      );
    }

    // Set leave summary for pie chart
    setLeaveSummary([
      { name: "Approved", value: approved },
      { name: "Pending", value: pending },
      { name: "Rejected", value: rejected }
    ]);
  } catch (err) {
    console.error("Error fetching leave summary:", err);
    setLeaveSummary([
      { name: "Approved", value: 0 },
      { name: "Pending", value: 0 },
      { name: "Rejected", value: 0 }
    ]);
  }
};

const getTotalLeaveRequests = async () => {
  try {
    // For admin/hr: count all pending leave requests
    if (role === "hr" || role === "admin") {
      const res = await getLeaves();
      const data = Array.isArray(res) ? res : res?.data || [];
      const pendingCount = data.filter(l => (l.status || "").toLowerCase() === "pending").length;
      
      console.log("📊 TOTAL PENDING LEAVE REQUESTS (ADMIN):", pendingCount);
      setLeaveRequests(pendingCount);
      
      if (pendingCount > 0) {
        pushGlobalNotification(
          `⏳ ${pendingCount} pending leave request(s) to review`,
          "info",
          "admin"
        );
      }
    } else if (role === "employee") {
      // For employees: count their own leave requests
      const res = await getMyLeaves(user?.empId);
      const data = Array.isArray(res) ? res : res?.data || [];
      setLeaveRequests(data.length);
      
      console.log("📊 MY TOTAL LEAVES (EMPLOYEE):", data.length);
    }
  } catch (err) {
    console.error("Error getting total leave requests:", err);
    setLeaveRequests(0);
  }
};
const calculatePayroll = async () => {
  try {
    const res = await getPayrollData();
    const data = Array.isArray(res) ? res : res?.data || [];

    console.log("📊 PAYROLL DATA:", data);

    if (role === "hr" || role === "admin") {
      // Total organization payroll (sum of gross pay)
      const total = data
        .filter(p => (p.status || p.recordStatus || "").toUpperCase() === "ACTIVE")
        .reduce((sum, p) => sum + Number(p.gross || p.salary || 0), 0);
      
      console.log("💰 ORG PAYROLL TOTAL:", total);
      setPayrollStats(total);
      
      if (total > 0) {
        pushGlobalNotification(
          `Total Org Payroll: ₹${total.toLocaleString()}`,
          "info",
          "admin"
        );
      }
    } else if (role === "employee") {
      // Employee's own salary
      const mine = data.find(
        p => String(p.employeeId) === String(user?.empId) || 
             String(p.empId) === String(user?.empId)
      );
      
      const salary = mine?.gross || mine?.salary || 0;
      setPayrollStats(salary);
      
      if (salary > 0) {
        pushGlobalNotification(
          `💰 Your Salary: ₹${salary.toLocaleString()}`,
          "success",
          "employee"
        );
      }
    }
  } catch (err) {
    console.error("Payroll error:", err);
    setPayrollStats(0);
  }
};
const calculateBirthdays = () => {
  const currentMonth = new Date().getMonth();

  const count = employees.filter(emp => {
    if (!emp.dob) return false;
    const dobMonth = new Date(emp.dob).getMonth();
    return dobMonth === currentMonth;
  }).length;

  setBirthdayCount(count);
};

const [birthdays, setBirthdays] = useState([]);


  const [search, setSearch] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [dept, setDept] = useState("All");
  const [location, setLocation] = useState("Fetching...");
  
const { refresh } = useContext(AttendanceContext);

const getEventsForDate = (date) => {
  if (!homeData?.events) return [];

  return homeData.events.filter((e) => {
    const eventDate = new Date(e.date);

    // only match same day
    return eventDate.toDateString() === date.toDateString();
  });
};

  /* ================= ATTENDANCE FUNCTIONS ================= */

const handleCheckIn = () => {
 
  const empId = localStorage.getItem("userId");
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const time = new Date().toLocaleTimeString();
    const newRecord = {
      date: new Date().toISOString().split("T")[0],
      name: user.name,
      department: user.department,
      empId,
      tos: user.tos,
      checkIn: time,
      checkOut: "-",
      locationIn: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
      locationOut: "-",
      late: new Date().getHours() > 9 ? "Yes" : "No",
      earlyLeave: "-",
      status: "Pending Approval"
    };
    try {
      await checkIn(newRecord);

// 👇 send to ADMIN (not employee)
pushGlobalNotification(
  `${user.fullName || user.name} checked in at ${time}`,
  "success",
  "admin"
);
console.log("NOTIFICATION SAVED:", localStorage.getItem("notifications"));
// ✅ refresh instantly
refreshDashboard();
      alert("Check-in successful");
      if (refresh) refresh(); // update Attendance table immediately
    } catch (err) {
      console.error(err);
      alert("Check-in failed");
    }
  });
};

const handleCheckOut = () => {
  setNotifications(prev => [
  createNotification("⏳ Check-out recorded", "info"),
  ...prev
]);
  const empId = localStorage.getItem("userId");
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const time = new Date().toLocaleTimeString();
    const record = {
      empId,
      date: new Date().toISOString().split("T")[0],
      checkOut: time,
      locationOut: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
    };
    try {
      await checkOut(record);

pushGlobalNotification(
  `${user.fullName || user.name} checked out at ${time}`,
  "info",
  "admin"
);

refreshDashboard();
      alert("Check-out successful");
      if (refresh) refresh();
    } catch (err) {
      console.error(err);
      alert("Check-out failed");
    }
  });
};

// ✅ ADD HERE
const markAsRead = (id) => {
  setNotifications(prev =>
    prev.map(n =>
      n.id === id ? { ...n, read: true } : n
    )
  );
};
const calculateAttendanceStats = async () => {
 
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    let data = [];

    // EMPLOYEE
    if (userData.role === "employee") {
      const res = await getMyAttendance(userData.empId);
      data = res;
    }

    // MANAGER (your same teamMembers logic)
    else if (userData.role === "manager") {
      const team = ["EMP001", "EMP002"];

      for (let id of team) {
        const res = await getMyAttendance(id);
        data = [...data, ...res];
      }
    }

    // ADMIN
    else {
      const users = JSON.parse(localStorage.getItem("allUsers")) || [];

      for (let u of users) {
        const res = await getMyAttendance(u.empId);
        data = [...data, ...res];
      }
    }

    if (role === "hr") {
  const today = new Date().toISOString().split("T")[0];

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yDate = yesterday.toISOString().split("T")[0];

  // ❗ MISSED CHECK-OUT
  const missedCheckout = data.filter(
    r => r.date === yDate && (!r.checkOut || r.checkOut === "-")
  );

  if (missedCheckout.length > 0) {
    setNotifications(prev => [
      createNotification(`⚠️ ${missedCheckout.length} employees missed check-out yesterday`, "warning"),
      ...prev
    ]);
  }

  // ❗ MISSED CHECK-IN
  const missed = data.filter(
    r => r.date === today && (!r.checkIn || r.checkIn === "-")
  );

  if (missed.length > 0) {
    setNotifications(prev => [
      createNotification(`⚠️ ${missed.length} employees missed check-in`, "warning"),
      ...prev
    ]);
  }
}

  
    const today = new Date().toISOString().split("T")[0];

    const present = data.filter(
      r => r.date === today && r.checkIn && r.checkIn !== "-"
    ).length;

    const totalUsers =
      userData.role === "employee"
        ? 1
        : userData.role === "manager"
        ? 2
        : (JSON.parse(localStorage.getItem("allUsers")) || []).length;

    const absent = totalUsers - present;

    setAttendanceStats({ present, absent });

  } catch (err) {
    console.error("Stats error", err);
  }
};

// ✅ ADD HERE (inside Home component)
const downloadAttendanceReport = async () => {
  try {
    const res = await getAllEmployees();
    const users = Array.isArray(res) ? res : res?.data || [];

    let allData = [];

    for (let u of users) {
      const resAtt = await getMyAttendance(u.empId);
      const data = Array.isArray(resAtt) ? resAtt : resAtt?.data || [];

      allData.push(
        ...data.map(r => ({
          Name: u.fullName,
          EmpId: u.empId,
          Date: r.date,
          CheckIn: r.checkIn,
          CheckOut: r.checkOut,
          Status: r.status
        }))
      );
    }

    if (allData.length === 0) {
      alert("No attendance data available");
      return;
    }

    const headers = Object.keys(allData[0]).join(",");
    const rows = allData.map(obj => Object.values(obj).join(","));
    const csv = [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_report.csv";
    a.click();

    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error("Download failed", err);
  }
};

  const filteredUsers = useMemo(() => {
  return employees.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) &&
      (dept === "All" || u.department === dept)
  );
}, [employees, search, dept]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation(`Lat: ${latitude.toFixed(3)}, Lon: ${longitude.toFixed(3)}`);
        },
        () => setLocation("Location not available")
      );
    }
  }, []);

useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("notifications")) || [];
  setNotifications(stored);
}, []);

useEffect(() => {
  const handleStorageChange = () => {
    const stored = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(stored);
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);
const refreshDashboard = async () => {
  try {
    await calculateAttendanceStats();
    await fetchLeaveSummary();
    await getTotalLeaveRequests();
    await calculatePayroll();
    await fetchAttendanceGraph();

    // 👇 Load latest notifications from localStorage
    const stored = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(stored);

  } catch (err) {
    console.error("Auto refresh error", err);
  }
};

const fetchAttendanceGraph = async () => {
  try {
    let data = [];

    // EMPLOYEE
      if (role === "employee") {
        const res = await getMyAttendance(user.empId);
        data = Array.isArray(res) ? res : res?.data || [];
      }

   // MANAGER
      else if (role === "manager") {
        const team = ["EMP001", "EMP002"];

        for (let id of team) {
          const res = await getMyAttendance(id);
          const d = Array.isArray(res) ? res : res?.data || [];
          data = [...data, ...d];
        }
      }


   // HR / ADMIN
     else {
  const res = await getAllEmployees();
  const users = Array.isArray(res)
    ? res
    : res?.data || [];

  for (let u of users) {
    const resAtt = await getMyAttendance(u.empId);
    const d = Array.isArray(resAtt)
      ? resAtt
      : resAtt?.data || [];

    data = [...data, ...d];
  }
}

    // 👉 GROUP BY MONTH
    const grouped = {};

    data.forEach((r) => {
      const month = new Date(r.date).toLocaleString("default", {
        month: "short",
      });

      if (!grouped[month]) {
        grouped[month] = { month, present: 0, leave: 0, absent: 0 };
      }

      if (r.status?.toLowerCase() === "leave") {
  grouped[month].leave++;
} else if (r.checkIn && r.checkIn !== "-") {
  grouped[month].present++;
} else {
  grouped[month].absent++;
}
    });
    

   const finalData = Object.values(grouped);

   if (!finalData.length) {
  setAttendanceSummary([
    { month: "No Data", present: 0, leave: 0, absent: 0 }
  ]);
  return;
}

setAttendanceSummary(
  finalData.map(item => {
    const total = item.present + item.leave + item.absent;

    return {
      month: item.month,
  present: total ? Number(((item.present / total) * 100).toFixed(1)) : 0,
leave: total ? Number(((item.leave / total) * 100).toFixed(1)) : 0,
absent: total ? Number(((item.absent / total) * 100).toFixed(1)) : 0,
    };
  })
);

  } catch (err) {
    console.error("Graph error", err);
  }
};
useEffect(() => {
  refreshDashboard(); // initial load

  const interval = setInterval(() => {
    refreshDashboard();
  }, 5000); // every 10 sec (faster)

  return () => clearInterval(interval);
}, []);
 useEffect(() => {
    fetchAttendanceGraph();
  }, []);
useEffect(() => {
  getAllEmployees()
    .then((res) => setEmployees(res.data || res))
    .catch((err) => console.error(err));
}, []);

useEffect(() => {
  calculateAttendanceStats();
}, []);
useEffect(() => {
  fetchLeaveSummary();
}, []);

useEffect(() => {
  getTotalLeaveRequests();
}, []);

useEffect(() => {
  calculateLeaveStats();
}, []);

useEffect(() => {
  calculatePayroll();
}, []);

useEffect(() => {
  if (employees.length) {
    calculateBirthdays();
  }
}, [employees]);

useEffect(() => {
  getBirthdays()
    .then(data => setBirthdays(data))
    .catch(err => console.error(err));
}, []);


useEffect(() => {
  const fetchToday = async () => {
    const res = await getMyAttendance(user.empId);
    const today = new Date().toISOString().split("T")[0];

    const record = res.find(r => r.date === today);
    setTodayRecord(record);
  };

  fetchToday();
}, []);

// ✅ ADD HERE
const sortedNotifications = [...safeNotifications].sort(
  (a, b) => a.read - b.read
);
  return (
    <div className="dashboard">
        <div className="top-bar">

  <div className="role-badge-container">
    <div className={`role-badge ${role}`}>
      {role.toUpperCase()}
    </div>
  </div>

 
</div>
{showBirthdays && (
  <div className="birthday-popup">
    <div className="popup-content">
      <h3>🎂 This Month Birthdays</h3>

    {birthdays.length === 0 ? (
  <p>No birthdays this month</p>
) : (
  birthdays.map((emp) => (
  <div key={`${emp.employeeId}-${emp.dob}`} className="birthday-item">
    {emp.fullName} - {new Date(emp.dob).toLocaleDateString()}
  </div>
))
)}

      <button onClick={() => setShowBirthdays(false)}>Close</button>
    </div>
  </div>
)}

      {/* KPI ROW */}
      <div className="kpi-row">
        
        {role === "employee" && (
          <>
           <KpiCard
  title="My Attendance"
  value={attendanceStats.present}
  icon={<FaUsers />}
  color="blue"
/>
<KpiCard
  title="Absent Days"
  value={attendanceStats.absent}
  icon={<FaUsers />}
  color="red"
/>
           <KpiCard
  title="Birthdays & Events"
  value={birthdayCount}
  icon={<FaBirthdayCake />}
  color="blue"
  onClick={() => setShowBirthdays(true)}
/>
            <KpiCard title="My Payees" value="$4,500" icon={<FaMoneyBillWave />} color="green" />
            <KpiCard title="Birthdays & Events" value="2" icon={<FaBirthdayCake />} color="blue" />
          </>
        )}

        {role === "manager" && (
          <>
            <KpiCard
      title="Team Attendance"
      value={attendanceStats.present}
      icon={<FaUsers />}
      color="blue"
    />

    <KpiCard
      title="Team Notifications"
      value={7}
      icon={<div className="bell-container">
  <FaBell
    className="bell-icon"
    onClick={() => setShowNotif(!showNotif)}
  />

  {/* 🔴 UNREAD COUNT */}
  {safeNotifications.filter(n => !n.read).length > 0 && (
    <span className="notif-badge">
      {notifications.filter(n => !n.read).length}
    </span>
  )}

  {/* 📩 DROPDOWN */}
  {showNotif && (
    <div className="notif-dropdown">
      {sortedNotifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        sortedNotifications.map(n => (
          <div
            key={n.id}
            className={`notify ${n.read ? "read" : "unread"}`}
            onClick={() => markAsRead(n.id)}
          >
            <div>{n.message}</div>
            <small>{n.time}</small>
          </div>
        ))
      )}
    </div>
  )}
</div>}
      color="red"
    />

    <KpiCard
      title="My Payees"
      value="$6,200"
      icon={<FaMoneyBillWave />}
      color="green"
    />

    <KpiCard
      title="Team Birthdays"
      value={3}
      icon={<FaBirthdayCake />}
      color="blue"
    />
          </>
        )}

        {role === "hr" && (
          <>
            <KpiCard
      title="Total Employees"
      value={safeEmployees.length}
      icon={<FaUsers />}
      color="blue"
    />
            <KpiCard
  title="Leave Requests"
  value={leaveRequests}
  icon={<FaBell />}
  color="red"
/>
            <KpiCard
      title="Org Payroll"
      value={`₹${Number(payrollStats).toLocaleString()}`}
      icon={<FaMoneyBillWave />}
      color="green"
    />
            <KpiCard
      title="Upcoming Birthdays"
      value={birthdayCount}
      icon={<FaBirthdayCake />}
      color="blue"
      onClick={() => setShowBirthdays(true)}
    />

          </>
        )}
      </div>

      {/* MAIN GRID */}
      <div className="main-grid">

        {/* LEFT */}
        <div>

          {/* EMP DIRECTORY */}
          <div className="panel emp-panel">
            <div className="panel-header">
              <h3>Employee Directory</h3>
           
            </div>

            <div className="emp-filters">
              <div className="emp-search">
                <FaSearch className="emp-search-icon" />
                <input
                  className="emp-search-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search employee..."
                />
              </div>

              <select
                className="emp-select"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
              >
                <option>All</option>
                <option>HR</option>
                <option>IT</option>
                <option>Sales</option>
              </select>
            </div>

            <div className="scrollable-box emp-scroll">
              <table className="emp-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.slice(0, 10).map((u) => (   // 👈 limit to 10 for dashboard
  <tr key={u.employeeId || u.id || u.empId}>
                     <td className="emp-cell">
  <img
   src={
  u.image
    ? u.image
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        u.fullName || "User"
      )}&background=0D8ABC&color=fff`
}
    alt=""
  />
  {u.fullName}
</td>

<td>{u.department}</td>
<td>{u.designation}</td>
<td>
  <span className="status active">{u.status}</span>
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CHARTS */}
         <div className="chart-row">

  {/* ================= ATTENDANCE CHART ================= */}
  <div
    className="panel chart-box-big attendance-panel"
    //onClick={() => navigate("/attendance")}
  >
    <div className="chart-header">
      <h3>Attendance Trend</h3>
      <span className="sub-text">Last 3 Months</span>
    </div>

    <ResponsiveContainer width="100%" height={320}>
     <BarChart
  data={
    attendanceSummary?.length
      ? attendanceSummary
      : [{ month: "No Data", present: 0, leave: 0, absent: 0 }]
  }
  barSize={28}   // 👈 ADD THIS HERE
  barCategoryGap="30%"
>
<defs>
  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
    <stop offset="100%" stopColor="#16a34a" stopOpacity={0.6} />
  </linearGradient>

  <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="#facc15" stopOpacity={0.9} />
    <stop offset="100%" stopColor="#eab308" stopOpacity={0.6} />
  </linearGradient>

  <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
    <stop offset="100%" stopColor="#dc2626" stopOpacity={0.6} />
  </linearGradient>
</defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

        <XAxis dataKey="month" />
        <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />

        <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />

        
       
<Bar dataKey="present" fill="#22c55e" radius={[6, 6, 0, 0]} />
<Bar dataKey="leave" fill="#facc15" radius={[6, 6, 0, 0]} />
<Bar dataKey="absent" fill="#ef4444" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>

    {/* QUICK STATS */}
    <div className="chart-footer">
      <div className="stat green">Present</div>
      <div className="stat yellow">Leave</div>
      <div className="stat red">Absent</div>
    </div>
  </div>


  {/* ================= LEAVE CHART ================= */}
  <div className="panel chart-box-big">
    <div className="chart-header">
      <h3>Leave Summary</h3>
      <span className="sub-text">Current Month</span>
    </div>

    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <defs>
  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
    <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.2" />
  </filter>
</defs>
        <Pie
          data={leaveSummary}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
outerRadius={85}
          paddingAngle={3}
          filter="url(#shadow)"
        >
          {leaveSummary.map((_, index) => (
            <Cell
              key={index}
              fill={
                index === 0
                  ? "#22c55e"
                  : index === 1
                  ? "#facc15"
                  : "#ef4444"
              }
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>

    {/* CENTER INFO STYLE */}
   <div className="pie-center-info">
  <h2>
    {leaveSummary.reduce((a, b) => a + b.value, 0)}
  </h2>
  <p>Requests</p>
  <span style={{ fontSize: "11px", color: "#999" }}>
    This Month
  </span>
</div>

    {/* LEGEND FIXED */}
    <div className="pie-legend">
      <div><span className="dot green"></span> Approved</div>
      <div><span className="dot yellow"></span> Pending</div>
      <div><span className="dot red"></span> Rejected</div>
    </div>
  </div>

</div>
        </div>

        {/* RIGHT PANEL */}
        <div className="panel right-panel">

          <div className="check-card">
            <div className="check-header">
              <FaMapMarkerAlt className="gps-icon" />
              <span>{location}</span>
            </div>

            <div className="check-buttons">
              <div>
                <p>Check-In</p>
               <h2>{todayRecord?.checkIn || "Not checked in"}</h2>
               <button className="check-btn" onClick={handleCheckIn}>
  Check In
</button>
              </div>

              <div>
                <p>Check-Out</p>
                <h2>{todayRecord?.checkOut || "Not checked out"}</h2>
               <button className="check-btn red-btn" onClick={handleCheckOut}>
  Check Out
</button>
              </div>
            </div>
          </div>

         <div className="calendar-wrapper">
  <div className="calendar-header">
    <h3>Company Calendar</h3>
    <span>Events & Schedule</span>
  </div>

  <Calendar
  className="styled-calendar pro-calendar"
  tileClassName={({ date, view }) => {
    if (view === "month") {
      const today = new Date();
      if (date.toDateString() === today.toDateString()) {
        return "today-tile";
      }
    }
    return null;
  }}
  tileContent={({ date, view }) => {
    if (view === "month") {
      const events = getEventsForDate(date);

      if (events.length > 0) {
        return (
          <div className="event-dot-wrapper">
            <div className="event-dot"></div>

            {/* 👇 SMALL HOVER TOOLTIP */}
            <div className="event-tooltip">
              {events.map((e, i) => (
                <div key={i} className="event-item">
                  📌 {e.title}
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
  }}
/>
</div>
<div className="event-list">
  <h4>Upcoming Events</h4>

  {testEvents.map((e, index) => (
    <div key={index} className="event-card">
      <div
        className="event-dot-color"
        style={{ backgroundColor: getEventColor(e.type) }}
      ></div>

      <div className="event-info">
        <div className="event-title">{e.title}</div>
        <div className="event-meta">
          {e.type} • {e.date}
        </div>
      </div>
    </div>
  ))}
</div>
          {/* ✅ WHITE TEXT EVENTS */}
         <div className="calendar-info calendar-events">
  <table>
    <tbody>
      {homeData?.events?.map((e, i) => (
        <tr key={i}>
          <td>{e.date}</td>
          <td className="green">{e.title}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="bottom-grid">

        {/* PAYROLL */}
        <div className="panel">
          <h3>{role === "hr" ? "Organization Payroll" : "My Payroll"}</h3>
{role === "hr" && (
  <button 
    className="btn-primary" 
    onClick={downloadAttendanceReport}
    style={{ marginBottom: "10px" }}
  >
    Download Attendance Report
  </button>
)}


          <div className="scrollable-box payroll-scroll">
            <table className="emp-table">
              <tbody>

                {role === "hr" &&
                  employees.map((u) => (
                   <tr key={u.employeeId || u._id}>
                     <td>{u.fullName}</td>
                      <td>Dec 2024</td>
                      <td>$5,000</td>
                      <td>$500</td>
                      <td>
                        <button className="btn-primary">View</button>
                      </td>
                    </tr>
                  ))}

                {(role === "employee" || role === "manager") && (
                  <tr>
                    <td>My Payslip</td>
                    <td>Dec 2024</td>
                    <td>$5,000</td>
                    <td>$500</td>
                    <td>
                      <button className="btn-primary">Download</button>
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="panel">
          <div className="panel-header">
            <h3>Notifications</h3>
            <FaEllipsisH />
          </div>

          <div className="scrollable-box notif-scroll">

           {sortedNotifications.length === 0 ? (
  <p>No notifications</p>
) : (
  sortedNotifications.map((n) => (
    <div
      key={n.id}
      className={`notify ${n.read ? "read" : "unread"}`}
      onClick={() =>
        
         markAsRead(n.id)}
    >
      <div>{n.message}</div>
      <small>{n.time}</small>
    </div>
  ))
)}
          </div>
        </div>

      </div>
    </div>
  );
}