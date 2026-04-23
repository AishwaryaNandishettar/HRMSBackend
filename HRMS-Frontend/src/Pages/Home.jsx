import React, { useMemo, useState, useEffect, useContext, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AttendanceContext } from "../Context/AttendanceContext";
import { getAllEmployees, getBirthdays } from "../api/employeeApi";
import { getMyLeaves, getLeaves } from "../api/leaveApi";
import { getPayrollData } from "../api/payrollApi";
import { getMyAttendance, getAllAttendance } from "../api/attendanceApi";
import api from "../api/axios";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  FaUsers, FaBell, FaMoneyBillWave, FaBirthdayCake,
  FaSearch, FaEllipsisH, FaMapMarkerAlt, FaCalendarAlt,
  FaCheckCircle, FaTimesCircle, FaClock,
} from "react-icons/fa";
import { AuthContext } from "../Context/Authcontext";
import "./Home.css";
import { useNavigate } from "react-router-dom";

/* ── Demo calendar events (3-4 fixed events for demo) ── */
const DEMO_EVENTS = [
  { title: "HR Interview Round", type: "HR", date: "2026-04-25", page: "/Recruitment" },
  { title: "Team Meeting", type: "Meeting", date: "2026-04-28", page: "/workchat" },
  { title: "Public Holiday - May Day", type: "Holiday", date: "2026-05-01", page: "/attendance" },
  { title: "Payroll Processing", type: "Payroll", date: "2026-05-05", page: "/payroll" },
];

const EVENT_COLORS = { HR: "#4f46e5", Meeting: "#16a34a", Holiday: "#dc2626", Payroll: "#f59e0b" };

/* ── KPI Card ── */
const KpiCard = ({ icon, title, value, color, onClick, subtitle }) => (
  <div className={`kpi-card ${color}`} onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
    <div className="kpi-content">
      <h1 className="kpi-title">{title}</h1>
      <div className="kpi-value">{value ?? "—"}</div>
      {subtitle && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>{subtitle}</div>}
    </div>
    <div className="kpi-icon">{icon}</div>
  </div>
);

/* ── Notification storage helpers (no duplicates) ── */
const NOTIF_KEY = "hrms_notifications";

const loadNotifs = () => {
  try { return JSON.parse(localStorage.getItem(NOTIF_KEY)) || []; }
  catch { return []; }
};

const saveNotifs = (list) => {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
};

/* Deduplicate by message+role — prevents repeated identical notifications */
const addNotifIfNew = (msg, type, targetRole) => {
  const existing = loadNotifs();
  const alreadyExists = existing.some(
    (n) => n.message === msg && n.role === targetRole
  );
  if (alreadyExists) return;
  const newN = {
    id: Date.now() + Math.random(),
    message: msg,
    type,
    role: targetRole,
    read: false,
    time: new Date().toLocaleTimeString(),
  };
  saveNotifs([newN, ...existing].slice(0, 50)); // keep max 50
  window.dispatchEvent(new Event("storage"));
};

export default function Home({ notifications, setNotifications }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { refresh } = useContext(AttendanceContext);

  /* ── role normalised to lowercase ── */
  const role = (user?.role || "employee").toLowerCase();
  const isAdmin = role === "admin" || role === "hr";
  const isEmployee = role === "employee";

  /* ── state ── */
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [location, setLocation] = useState("Fetching...");
  const [todayRecord, setTodayRecord] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState([
    { name: "Approved", value: 0 },
    { name: "Pending", value: 0 },
    { name: "Rejected", value: 0 },
  ]);
  const [leaveRequests, setLeaveRequests] = useState(0);   // pending count for admin
  const [leaveBalance, setLeaveBalance] = useState(0);     // approved for employee
  const [payrollStat, setPayrollStat] = useState(0);
  const [birthdayCount, setBirthdayCount] = useState(0);
  const [birthdays, setBirthdays] = useState([]);
  const [showBirthdays, setShowBirthdays] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  /* ── prevent duplicate notification pushes across re-renders ── */
  const notifPushedRef = useRef(false);

  /* ── active employees only ── */
  const activeEmployees = useMemo(
    () => employees.filter((e) => (e.status || "").toUpperCase() === "ACTIVE"),
    [employees]
  );

  const filteredUsers = useMemo(
    () =>
      activeEmployees.filter(
        (u) =>
          u.fullName?.toLowerCase().includes(search.toLowerCase()) &&
          (dept === "All" || u.department === dept)
      ),
    [activeEmployees, search, dept]
  );

  /* ── load notifications from storage ── */
  useEffect(() => {
    const stored = loadNotifs().filter((n) => n.role === role);
    setNotifications(stored);

    const onStorage = () => {
      const updated = loadNotifs().filter((n) => n.role === role);
      setNotifications(updated);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [role]);

  /* ── geolocation ── */
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setLocation(`${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`),
      () => setLocation("Location unavailable")
    );
  }, []);

  /* ── fetch employees ── */
  useEffect(() => {
    getAllEmployees()
      .then((res) => setEmployees(res.data || res))
      .catch(console.error);
  }, []);

  /* ── fetch birthdays ── */
  useEffect(() => {
    getBirthdays()
      .then((data) => {
        setBirthdays(data || []);
        setBirthdayCount((data || []).length);
      })
      .catch(console.error);
  }, []);

  /* ── today's attendance record ── */
  useEffect(() => {
    if (!user?.id) return;
    getMyAttendance(user.id)
      .then((res) => {
        const today = new Date().toISOString().split("T")[0];
        const rec = (Array.isArray(res) ? res : []).find((r) => r.date === today);
        setTodayRecord(rec || null);
      })
      .catch(console.error);
  }, [user?.id]);

  /* ── attendance trend graph ── */
  useEffect(() => {
    const buildGraph = async () => {
      try {
        let data = [];
        if (isEmployee) {
          data = await getMyAttendance(user.id);
          data = Array.isArray(data) ? data : [];
        } else {
          data = await getAllAttendance();
          data = Array.isArray(data) ? data : [];
        }
        const grouped = {};
        data.forEach((r) => {
          if (!r.date) return;
          const month = new Date(r.date).toLocaleString("default", { month: "short" });
          if (!grouped[month]) grouped[month] = { month, present: 0, leave: 0, absent: 0 };
          if (r.status?.toLowerCase() === "leave") grouped[month].leave++;
          else if (r.checkIn && r.checkIn !== "-") grouped[month].present++;
          else grouped[month].absent++;
        });
        const result = Object.values(grouped).map((item) => {
          const total = item.present + item.leave + item.absent || 1;
          return {
            month: item.month,
            present: +((item.present / total) * 100).toFixed(1),
            leave: +((item.leave / total) * 100).toFixed(1),
            absent: +((item.absent / total) * 100).toFixed(1),
          };
        });
        setAttendanceSummary(result.length ? result : [{ month: "No Data", present: 0, leave: 0, absent: 0 }]);
      } catch (e) { console.error(e); }
    };
    buildGraph();
  }, [user?.id, isEmployee]);

  /* ── leave summary + KPI (runs ONCE on mount, not on interval) ── */
  useEffect(() => {
    const fetchLeave = async () => {
      try {
        let data = [];
        if (isAdmin) {
          const res = await getLeaves();
          data = Array.isArray(res) ? res : res?.data || [];
        } else {
          const res = await getMyLeaves(user.id);
          data = Array.isArray(res) ? res : res?.data || [];
        }

        const approved = data.filter((l) => l.status?.toLowerCase() === "approved").length;
        const pending = data.filter((l) => l.status?.toLowerCase() === "pending").length;
        const rejected = data.filter((l) => l.status?.toLowerCase() === "rejected").length;

        setLeaveSummary([
          { name: "Approved", value: approved },
          { name: "Pending", value: pending },
          { name: "Rejected", value: rejected },
        ]);

        if (isAdmin) {
          setLeaveRequests(pending);
          /* notify admin ONCE per session about pending leaves */
          if (pending > 0 && !notifPushedRef.current) {
            addNotifIfNew(`⏳ ${pending} pending leave request(s) awaiting approval`, "warning", role);
          }
        } else {
          setLeaveBalance(approved);
          /* notify employee ONCE if leave approved */
          if (approved > 0 && !notifPushedRef.current) {
            addNotifIfNew(`✅ ${approved} of your leave request(s) have been approved`, "success", role);
          }
        }
        notifPushedRef.current = true;
      } catch (e) { console.error(e); }
    };
    fetchLeave();
  }, [user?.id, isAdmin, role]);

  /* ── payroll KPI ── */
  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const res = await getPayrollData();
        const data = Array.isArray(res) ? res : res?.data || [];
        if (isAdmin) {
          const total = data.reduce((s, p) => s + Number(p.gross || p.salary || 0), 0);
          setPayrollStat(total);
        } else {
          const mine = data.find(
            (p) => String(p.employeeId) === String(user?.employeeId) ||
                   String(p.empId) === String(user?.employeeId)
          );
          setPayrollStat(mine?.gross || mine?.salary || 0);
        }
      } catch (e) { console.error(e); }
    };
    fetchPayroll();
  }, [user?.id, isAdmin]);

  /* ── check-in / check-out ── */
  const handleCheckIn = () => {
    if (!user?.id) { alert("User not found. Please re-login."); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await api.post("/api/attendance/checkin", { userId: user.id });
          const time = new Date().toLocaleTimeString();
          addNotifIfNew(`${user.name} checked in at ${time}`, "success", "admin");
          addNotifIfNew(`${user.name} checked in at ${time}`, "success", "hr");
          const res = await getMyAttendance(user.id);
          const today = new Date().toISOString().split("T")[0];
          setTodayRecord((Array.isArray(res) ? res : []).find((r) => r.date === today) || null);
          if (refresh) refresh();
          alert("✅ Check-in successful!");
        } catch (err) {
          console.error(err);
          alert("Check-in failed: " + (err?.response?.data || err.message));
        }
      },
      () => {
        /* fallback without location */
        api.post("/api/attendance/checkin", { userId: user.id })
          .then(async () => {
            const time = new Date().toLocaleTimeString();
            addNotifIfNew(`${user.name} checked in at ${time}`, "success", "admin");
            const res = await getMyAttendance(user.id);
            const today = new Date().toISOString().split("T")[0];
            setTodayRecord((Array.isArray(res) ? res : []).find((r) => r.date === today) || null);
            if (refresh) refresh();
            alert("✅ Check-in successful!");
          })
          .catch((err) => alert("Check-in failed: " + (err?.response?.data || err.message)));
      }
    );
  };

  const handleCheckOut = () => {
    if (!user?.id) { alert("User not found. Please re-login."); return; }
    api.post("/api/attendance/checkout", { userId: user.id })
      .then(async () => {
        const time = new Date().toLocaleTimeString();
        addNotifIfNew(`${user.name} checked out at ${time}`, "info", "admin");
        addNotifIfNew(`${user.name} checked out at ${time}`, "info", "hr");
        const res = await getMyAttendance(user.id);
        const today = new Date().toISOString().split("T")[0];
        setTodayRecord((Array.isArray(res) ? res : []).find((r) => r.date === today) || null);
        if (refresh) refresh();
        alert("✅ Check-out successful!");
      })
      .catch((err) => alert("Check-out failed: " + (err?.response?.data || err.message)));
  };

  /* ── calendar date click ── */
  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split("T")[0];
    const events = DEMO_EVENTS.filter((e) => e.date === dateStr);
    setSelectedDateEvents(events);
  };

  /* ── mark notification read ── */
  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    const all = loadNotifs().map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifs(all);
  };

  const sortedNotifications = [...(notifications || [])].sort((a, b) => a.read - b.read);

  return (
    <div className="dashboard">
      {/* Role badge */}
      <div className="top-bar">
        <div className="role-badge-container">
          <div className={`role-badge ${role}`}>{role.toUpperCase()}</div>
        </div>
      </div>

      {/* Birthday popup */}
      {showBirthdays && (
        <div className="birthday-popup">
          <div className="popup-content">
            <h3>🎂 This Month Birthdays</h3>
            {birthdays.length === 0 ? (
              <p>No birthdays this month</p>
            ) : (
              birthdays.map((emp, i) => (
                <div key={i} className="birthday-item">
                  {emp.fullName} - {new Date(emp.dob).toLocaleDateString()}
                </div>
              ))
            )}
            <button onClick={() => setShowBirthdays(false)}>Close</button>
          </div>
        </div>
      )}

      {/* KPI Row */}
      <div className="kpi-row">
        {isAdmin && (
          <>
            <KpiCard
              title="Total Employees"
              value={activeEmployees.length}
              icon={<FaUsers />}
              color="blue"
            />
            <KpiCard
              title="Leave Requests"
              value={leaveRequests}
              subtitle="Pending"
              icon={<FaBell />}
              color="red"
              onClick={() => navigate("/leave")}
            />
            <KpiCard
              title="Org Payroll"
              value={`₹${Number(payrollStat).toLocaleString()}`}
              icon={<FaMoneyBillWave />}
              color="green"
              onClick={() => navigate("/payroll")}
            />
            <KpiCard
              title="Birthdays"
              value={birthdayCount}
              subtitle="This Month"
              icon={<FaBirthdayCake />}
              color="blue"
              onClick={() => setShowBirthdays(true)}
            />
          </>
        )}

        {isEmployee && (
          <>
            <KpiCard
              title="My Attendance"
              value={todayRecord?.checkIn ? "Present" : "Absent"}
              icon={<FaCheckCircle />}
              color="blue"
            />
            <KpiCard
              title="Leave Balance"
              value={leaveBalance}
              subtitle="Approved"
              icon={<FaClock />}
              color="green"
              onClick={() => navigate("/leave")}
            />
            <KpiCard
              title="My Salary"
              value={`₹${Number(payrollStat).toLocaleString()}`}
              icon={<FaMoneyBillWave />}
              color="green"
              onClick={() => navigate("/payroll")}
            />
            <KpiCard
              title="Birthdays"
              value={birthdayCount}
              subtitle="This Month"
              icon={<FaBirthdayCake />}
              color="blue"
              onClick={() => setShowBirthdays(true)}
            />
          </>
        )}
      </div>

      {/* Main Grid */}
      <div className="main-grid">
        {/* Left */}
        <div>
          {/* Employee Directory */}
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
              <select className="emp-select" value={dept} onChange={(e) => setDept(e.target.value)}>
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
                  {filteredUsers.slice(0, 10).map((u, i) => (
                    <tr key={u.employeeId || i}>
                      <td className="emp-cell">
                        <img
                          src={
                            u.image ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
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

          {/* Charts */}
          <div className="chart-row">
            {/* Attendance Trend */}
            <div className="panel chart-box-big attendance-panel">
              <div className="chart-header">
                <h3>Attendance Trend</h3>
                <span className="sub-text">Last 3 Months</span>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={attendanceSummary} barSize={28} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />
                  <Bar dataKey="present" fill="#22c55e" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="leave" fill="#facc15" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="absent" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="chart-footer">
                <div className="stat green">Present</div>
                <div className="stat yellow">Leave</div>
                <div className="stat red">Absent</div>
              </div>
            </div>

            {/* Leave Summary */}
            <div className="panel chart-box-big">
              <div className="chart-header">
                <h3>Leave Summary</h3>
                <span className="sub-text">Current Month</span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={leaveSummary}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {leaveSummary.map((_, index) => (
                      <Cell
                        key={index}
                        fill={index === 0 ? "#22c55e" : index === 1 ? "#facc15" : "#ef4444"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-center-info">
                <h2>{leaveSummary.reduce((a, b) => a + b.value, 0)}</h2>
                <p>Requests</p>
                <span style={{ fontSize: "11px", color: "#999" }}>This Month</span>
              </div>
              <div className="pie-legend">
                <div>
                  <span className="dot green"></span> Approved
                </div>
                <div>
                  <span className="dot yellow"></span> Pending
                </div>
                <div>
                  <span className="dot red"></span> Rejected
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="panel right-panel">
          {/* Check-in/Check-out */}
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

          {/* Calendar */}
          <div className="calendar-wrapper">
            <div className="calendar-header">
              <h3>Company Calendar</h3>
              <span>Events & Schedule</span>
            </div>
            <Calendar
              className="styled-calendar pro-calendar"
              onClickDay={handleDateClick}
              tileClassName={({ date, view }) => {
                if (view === "month") {
                  const today = new Date();
                  if (date.toDateString() === today.toDateString()) return "today-tile";
                }
                return null;
              }}
              tileContent={({ date, view }) => {
                if (view === "month") {
                  const dateStr = date.toISOString().split("T")[0];
                  const events = DEMO_EVENTS.filter((e) => e.date === dateStr);
                  if (events.length > 0) {
                    return (
                      <div className="event-dot-wrapper">
                        <div className="event-dot"></div>
                      </div>
                    );
                  }
                }
              }}
            />
          </div>

          {/* Event List */}
          <div className="event-list">
            <h4>Upcoming Events</h4>
            {DEMO_EVENTS.map((e, index) => (
              <div
                key={index}
                className="event-card"
                onClick={() => navigate(e.page)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="event-dot-color"
                  style={{ backgroundColor: EVENT_COLORS[e.type] }}
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

          {/* Selected Date Events */}
          {selectedDate && selectedDateEvents.length > 0 && (
            <div className="event-list" style={{ marginTop: 10, background: "#fffbea" }}>
              <h4>Events on {selectedDate.toLocaleDateString()}</h4>
              {selectedDateEvents.map((e, i) => (
                <div
                  key={i}
                  className="event-card"
                  onClick={() => navigate(e.page)}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="event-dot-color"
                    style={{ backgroundColor: EVENT_COLORS[e.type] }}
                  ></div>
                  <div className="event-info">
                    <div className="event-title">{e.title}</div>
                    <div className="event-meta">{e.type}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="bottom-grid">
        {/* Payroll */}
        <div className="panel">
          <h3>{isAdmin ? "Organization Payroll" : "My Payroll"}</h3>
          <div className="scrollable-box payroll-scroll">
            <table className="emp-table">
              <tbody>
                {isAdmin &&
                  activeEmployees.slice(0, 5).map((u, i) => (
                    <tr key={i}>
                      <td>{u.fullName}</td>
                      <td>Current Month</td>
                      <td>₹{(Math.random() * 50000 + 30000).toFixed(0)}</td>
                      <td>
                        <button className="btn-primary" onClick={() => navigate("/payroll")}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                {isEmployee && (
                  <tr>
                    <td>My Payslip</td>
                    <td>Current Month</td>
                    <td>₹{Number(payrollStat).toLocaleString()}</td>
                    <td>
                      <button className="btn-primary" onClick={() => navigate("/payroll")}>
                        Download
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications */}
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
                  onClick={() => markAsRead(n.id)}
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
