  import React, { useMemo, useState, useEffect, useContext } from "react";
  import Calendar from "react-calendar";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import "react-calendar/dist/Calendar.css";
  import {
    PieChart,
    Cell,
    Pie,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
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
  import { fetchHomeData } from "../api/homeApi";
  import "./Home.css";

  /* ================= DUMMY USERS ================= */

 




  export default function Home() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [search, setSearch] = useState("");
    const [dept, setDept] = useState("All");
    const [location, setLocation] = useState("Fetching...");
    const [employees, setEmployees] = useState([]);
    const [attendanceChartData, setAttendanceChartData] = useState([]);
    const [leaveChartData, setLeaveChartData] = useState([]);
    const [homeData, setHomeData] = useState(null);
    const [events, setEvents] = useState(0);
    const eventDates = useMemo(() => {
  return employees
    .filter(emp => emp.dob)
    .map(emp => {
      const d = new Date(emp.dob);
      return new Date(new Date().getFullYear(), d.getMonth(), d.getDate());
    });
}, [employees]);
    const [notifications, setNotifications] = useState([]);
    const [payrollData, setPayrollData] = useState([]);

    // ✅ LAST 3 MONTHS (latest 3 from backend)
const last3MonthsData = Array.isArray(attendanceChartData)
  ? attendanceChartData.slice(-3)
  : [];

// ✅ CURRENT YEAR LAST 3 MONTHS (safe filter)
const currentMonth = new Date().getMonth();

const current3MonthsData = Array.isArray(attendanceChartData)
  ? attendanceChartData.filter((item, index) => {
      return index >= attendanceChartData.length - 3;
    })
  : [];

    // Fetch employees
    useEffect(() => {
      const fetchEmployees = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/employee/all`
          );

          if (Array.isArray(res.data)) {
            setEmployees(res.data);
          } else {
            setEmployees([]);
          }
        } catch (err) {
          console.error("Home fetch employees error:", err);
          setEmployees([]);
        }
      };

      fetchEmployees();
    }, []);

    useEffect(() => {
  const fetchPayroll = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/payroll`
      );

      setPayrollData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Payroll fetch error:", err);
      setPayrollData([]);
    }
  };

  fetchPayroll();
}, []);
    // Fetch home data (includes attendance and leave graphs)
    useEffect(() => {
      const loadHomeData = async () => {
        if (!user?.email) return;

        try {
          const data = await fetchHomeData(user.email);
          console.log("✅ Home data loaded:", data);
          setHomeData(data);

          // Set attendance graph data
          if (data.attendanceGraph && Array.isArray(data.attendanceGraph)) {
            const formatted = data.attendanceGraph.map((item) => ({
              month: item.month || "N/A",
              present: item.present || 0,
              leave: item.leave || 0,
              absent: item.absent || 0,
            }));
            setAttendanceChartData(formatted);
          }

          // Set leave graph data
          if (data.leaveGraph && Array.isArray(data.leaveGraph)) {
            // Sum up all months for pie chart
            const totals = data.leaveGraph.reduce(
              (acc, item) => ({
                approved: acc.approved + (item.approved || 0),
                pending: acc.pending + (item.pending || 0),
                rejected: acc.rejected + (item.rejected || 0),
              }),
              { approved: 0, pending: 0, rejected: 0 }
            );

            setLeaveChartData([
              { name: "Approved", value: totals.approved },
              { name: "Pending", value: totals.pending },
              { name: "Rejected", value: totals.rejected },
            ]);
          }
        } catch (err) {
          console.error("Home data fetch error:", err);
        }
      };

      loadHomeData();
    }, [user]);

    // Fetch events (birthdays)
    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/employee/all`
          );
          const currentMonth = new Date().getMonth();

          const filtered = res.data.filter((emp) => {
            if (!emp.dob) return false;
            return new Date(emp.dob).getMonth() === currentMonth;
          });

          setEvents(filtered.length);
        } catch (err) {
          console.error("Events fetch error:", err);
        }
      };

      fetchEvents();
    }, []);

    // Fetch notifications
    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/notifications`
          );
          setNotifications(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
          console.error("Notifications fetch error:", err);
          setNotifications([]);
        }
      };

      fetchNotifications();
    }, []);

    const totalEmployees = employees.filter(
      (e) => (e.status || "").toUpperCase() === "ACTIVE"
    ).length;

    const pendingLeaves = homeData?.stats?.leavePending || 0;
    const payrollTotal = Array.isArray(payrollData)
  ? payrollData.reduce(
      (sum, emp) =>
        sum +
        (
          emp.net || 
          emp.netPay || 
          emp.gross || 
          emp.grossPay || 
          emp.salary || 
          0
        ),
      0
    )
  : 0;

    const KpiCard = ({ icon, title, value, color, onClick }) => (
  <div className={`kpi-card ${color}`} onClick={onClick}>
    <div className="kpi-content">
      <h1 className="kpi-title">{title}</h1>
      <div className="kpi-value">{value}</div>
    </div>
    <div className="kpi-icon">{icon}</div>
  </div>
);

    const usersData = useMemo(() => {
      return employees.filter(
        (u) =>
          (u.fullName || u.name || "").toLowerCase().includes(search.toLowerCase()) &&
          (dept === "All" || u.department === dept)
      );
    }, [search, dept, employees]);

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


    return (
      <div className="dashboard">

        {/* KPI ROW - ROLE BASED */}
        <div className="kpi-row">
          {user?.role === "employee" && (
            <>
              <KpiCard title="My Attendance" value="92%" icon={<FaUsers />} color="blue" />
              <KpiCard title="My Notifications" value="4" icon={<FaBell />} color="red" />
              <KpiCard title="My Payroll" value="$4,500" icon={<FaMoneyBillWave />} color="green" />
              <KpiCard title="Events" value="2" icon={<FaBirthdayCake />} color="blue" />
            </>
          )}

          {user?.role === "manager" && (
            <>
              <KpiCard title="Team Attendance" value="89%" icon={<FaUsers />} color="blue" />
              <KpiCard title="Team Alerts" value="7" icon={<FaBell />} color="red" />
              <KpiCard title="Team Payroll" value="$18,500" icon={<FaMoneyBillWave />} color="green" />
              <KpiCard title="Events" value="3" icon={<FaBirthdayCake />} color="blue" />
            </>
          )}

          {(user?.role === "hr" || user?.role === "admin") && (
            <>
             <KpiCard
  title="Total Employees"
  value={totalEmployees}
  icon={<FaUsers />}
  color="blue"
  onClick={() => navigate("/employees")}
/>
<KpiCard 
  title="Pending Leaves" 
  value={pendingLeaves} 
  icon={<FaBell />}
  color="red" 
/>

<KpiCard 
  title="Org Payroll" 
  value={`$${(payrollTotal || 0).toLocaleString()}`}
  icon={<FaMoneyBillWave />}
  color="orange" 
/>

<KpiCard
  title="Events"
  value={events}
  icon={<FaBirthdayCake />}
  color="yellow"
  onClick={() => navigate("/events")}
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
                   {employees.length === 0 ? (
  <tr>
    <td colSpan="4">No employees</td>
  </tr>
) : (
  usersData.slice(0, 5).map((emp, index) => (
    <tr key={index}>
      <td className="emp-cell">
        <img
         src={`https://ui-avatars.com/api/?name=${emp.fullName || emp.name || "User"}`}
          alt=""
        />
        {emp.fullName || emp.name || emp.employeeName || "N/A"}
      </td>
      <td>{emp.department}</td>
      <td>{emp.designation}</td>
      <td>
        <span className="status active">{emp.status}</span>
      </td>
    </tr>
  ))
)}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CHARTS */}
            <div className="chart-row">

              {/* ATTENDANCE */}
              <div className="panel chart-box attendance-panel">
                <h2>Attendance</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart 
                    data={last3MonthsData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="present" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="leave" fill="#facc15" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                <div className="attendance-legend">
                  <span className="legend present">● Present</span>
                  <span className="legend leave">● Leave</span>
                  <span className="legend absent">● Absent</span>
                </div>
              </div>

              {/* LEAVE */}
              <div className="panel chart-box">
                <h2>Leave Summary</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={Array.isArray(leaveChartData) && leaveChartData.length > 0 ? leaveChartData : []}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      innerRadius={0}
                      paddingAngle={2}
                      label={({ name, value }) => value > 0 ? `${value}` : ''}
                      labelLine={false}
                    >
                      {leaveChartData.map((entry, index) => {
                        const colors = ['#22c55e', '#facc15', '#ef4444'];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="leave-legend">
                  <span className="approved">● Approved</span>
                  <span className="pending">● Pending</span>
                  <span className="rejected">● Rejected</span>
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
                  <h2>Not checked in</h2>
                 <button
  className="check-btn"
 onClick={async () => {
  try {
    const res = await fetch("/api/attendance/checkin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user?.id || user?.empId,   // ✅ REQUIRED
        name: user?.name,
        department: user?.department,
      }),
    });

    if (res.ok) {
      alert("Check-in successful");
      window.location.reload();
    } else {
      alert("Check-in failed");
    }
  } catch (err) {
    console.error(err);
    alert("Error during check-in");
  }
}}
>
  Check In
</button>
                </div>
         
                <div>
                  <p>Check-Out</p>
                  <h2>Not checked out</h2>
                 <button
  className="check-btn red-btn"
onClick={async () => {
  try {
    const res = await fetch("/api/attendance/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user?.id || user?.empId,
      }),
    });

    if (res.ok) {
      alert("Check-out successful");
      window.location.reload();
    } else {
      alert("Check-out failed");
    }
  } catch (err) {
    console.error(err);
    alert("Error during check-out");
  }
}}
>
  Check Out
</button>
                </div>
              </div>
            </div>

           <Calendar
  className="styled-calendar"
  tileClassName={({ date, view }) => {
    if (view === "month") {
      const match = eventDates.find(
        d =>
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth()
      );
      return match ? "highlight-event" : null;
    }
  }}
/>
<div className="calendar-events">
  <h4>Upcoming Events</h4>

  {employees
    .filter(emp => emp.dob)
    .slice(0, 3)
    .map((emp, i) => (
      <div key={i} className="event-item">
        🎂 {emp.fullName || emp.name} -{" "}
        {new Date(emp.dob).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        })}
      </div>
    ))}
</div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="bottom-grid">
          <div className="panel small-panel">
            <h3>Payroll</h3>
            <div className="scrollable-box payroll-scroll">
              <table className="emp-table">
                <tbody>
                  <tr><td>John</td><td>Jan 2026</td><td>$5000</td><td>$500</td><td><button className="btn-primary">View</button></td></tr>
                  <tr><td>Rahul</td><td>Jan 2026</td><td>$4800</td><td>$450</td><td><button className="btn-primary">View</button></td></tr>
                  <tr><td>Priya</td><td>Jan 2026</td><td>$5200</td><td>$550</td><td><button className="btn-primary">View</button></td></tr>
                  <tr><td>Amit</td><td>Jan 2026</td><td>$5100</td><td>$500</td><td><button className="btn-primary">View</button></td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel small-panel">
            <div className="panel-header">
              <h3>Notifications</h3>
              <FaEllipsisH />
            </div>
            <div className="scrollable-box notif-scroll">
            {Array.isArray(notifications) && notifications.map((n, i) => (
  <div key={i} className={`notify ${n.type}`}>
    {n.message}
  </div>
))}
              
            </div>
          </div>
        </div>

      </div>
    );
  }
