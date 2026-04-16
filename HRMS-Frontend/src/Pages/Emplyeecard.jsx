import React, { useState, useMemo, useEffect , useRef} from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import "./EmployeeDirectory.css";
import InviteEmployee from "../Components/InviteEmployee";
const sampleEmployees = [
  {
    id: "EMP001",
    name: "Raj Kumar",
    designation: "Software Developer",
    department: "IT",
    location: "Bangalore",
    email: "raj@example.com",
    manager: "Nilesh B",
    managerEmail: "nilesh@company.com",
    doj: "2020-05-10",
    dob: "1995-06-22",
    status: "Active",
    exitDate: "-",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "EMP002",
    name: "Priya Sharma",
    designation: "HR Manager",
    department: "Human Resources",
    location: "Mumbai",
    email: "priya@example.com",
    manager: "Sujata M",
    managerEmail: "sujata@company.com",
    doj: "2019-08-25",
    dob: "1990-02-15",
    status: "Active",
    exitDate: "-",
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "EMP003",
    name: "Amit Singh",
    designation: "UI/UX Designer",
    department: "Design",
    location: "Delhi",
    email: "amit@example.com",
    manager: "Raj K",
    managerEmail: "raj.k@company.com",
    doj: "2021-03-15",
    dob: "1997-11-03",
    status: "Resigned",
    exitDate: "2024-09-10",
    image: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "EMP004",
    name: "Riya Patel",
    designation: "Finance Analyst",
    department: "Finance",
    location: "Hyderabad",
    email: "riya@example.com",
    manager: "Shreya P",
    managerEmail: "shreya@company.com",
    doj: "2018-12-02",
    dob: "1996-09-12",
    status: "Serving Notice",
    exitDate: "2025-02-20",
    image: "https://i.pravatar.cc/150?img=4",
  },
];


function formatDateForCompare(d) {
  if (!d || d === "-") return null;
  const date = new Date(d);
  return isNaN(date.getTime()) ? null : date;
}

export default function EmployeeDirectory() {

  const navigate = useNavigate();

  // Filters
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [managerFilter, setManagerFilter] = useState("");
  const [managerEmailFilter, setManagerEmailFilter] = useState("");
  const [dojFrom, setDojFrom] = useState("");
  const [dojTo, setDojTo] = useState("");
  const [exitFrom, setExitFrom] = useState("");
  const [exitTo, setExitTo] = useState("");
  const [viewMode, setViewMode] = useState("all");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
const [otp, setOtp] = useState("");


const [employees, setEmployees] = useState([]);
const [activeFilter, setActiveFilter] = useState(null);
const [filterText, setFilterText] = useState("");
const [columnFilters, setColumnFilters] = useState({});
const popupRef = useRef();

 // ✅ ADD HERE (IMPORTANT)
  const fieldMap = {
    employeename: "name",
    employeeId: "id",
    employeedepartment: "department",
    employeedesignation: "designation",
    employeelocation: "location",
    employeeemail: "email",
    employeereporting: "manager",
    employeestatus: "status",
    employeeDOB: "dob",
    employeeDOJ: "doj",
    employeeexitdate: "exitDate",
  };


  useEffect(() => {
  fetchEmployees();
}, []);

useEffect(() => {
  const handleClick = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setActiveFilter(null);
    }
  };
  document.addEventListener("mousedown", handleClick);
  return () => document.removeEventListener("mousedown", handleClick);
}, []);

 const fetchEmployees = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/employee/all`);
    console.log("Employees response:", res.data);
    // Ensure response is an array
    if (Array.isArray(res.data)) {
      setEmployees(res.data);
    } else {
      console.error("Expected array, got:", typeof res.data);
      setEmployees([]);
    }
  } catch (err) {
    console.error("Error fetching employees", err);
    setEmployees([]);
  }
};

const getUnique = (key) => {
  return [...new Set(employees.map((e) => e[key]).filter(Boolean))];
};

const suggestions =
  activeFilter &&
  getUnique(activeFilter).filter((v) =>
    String(v).toLowerCase().includes(filterText.toLowerCase())
  );

 // const employees = sampleEmployees;

const styles = {
  input: {
    padding: "8px",
    marginTop: "10px",
    width: "100%",
    borderRadius: "6px",
    border: "1px solid #ccc"
  }
};

 const sendInviteEmployee = async () => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/onboarding/invite`,
      {
        email: inviteEmail,
        fullName: "Test User",
        department: "IT",
        designation: "Developer",
      }
    );
    console.log("Invite response:", res);
    alert("Invite sent successfully");
    setInviteEmail("");
    setShowInvite(false);
  } catch (err) {
    console.error("FULL ERROR:", err);
    alert("Failed to send invite: " + (err.response?.data?.message || err.message));
  }
};
  // Derived options
  const departments = useMemo(
    () => Array.from(new Set(employees.map((e) => e.department))).sort(),
    [employees]
  );
  const locations = useMemo(
    () => Array.from(new Set(employees.map((e) => e.location))).sort(),
    [employees]
  );
  const managers = useMemo(
    () => Array.from(new Set(employees.map((e) => e.manager))).sort(),
    [employees]
  );
  const managerEmails = useMemo(
    () => Array.from(new Set(employees.map((e) => e.managerEmail))).sort(),
    [employees]
  );
  const statuses = useMemo(
    () => Array.from(new Set(employees.map((e) => e.status))).sort(),
    [employees]
  );

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const filteredEmployees = useMemo(() => {
    // COLUMN HEADER FILTERS (NEW - does not affect existing filters)
const matchesColumnFilters = Object.keys(columnFilters).every((key) => {
  if (!columnFilters[key]) return true;


    const actualField = fieldMap[key];   // 🔥 important mapping fix
 

return String(emp[actualField] || "")
    .toLowerCase()
    .includes(String(columnFilters[key]).toLowerCase());
});

if (!matchesColumnFilters) return false;
    return employees.filter((emp) => {
      const empDOB = formatDateForCompare(emp.dob);
      const empDOJ = formatDateForCompare(emp.doj);
      const empExit =
        emp.exitDate && emp.exitDate !== "-" ? formatDateForCompare(emp.exitDate) : null;

      const isBirthday =
        empDOB && empDOB.getMonth() + 1 === currentMonth && empDOB.getDate() === currentDay;
      const isAnniversary =
        empDOJ && empDOJ.getMonth() + 1 === currentMonth && empDOJ.getDate() === currentDay;

      if (viewMode === "birthday" && !isBirthday) return false;
      if (viewMode === "anniversary" && !isAnniversary) return false;
      if (viewMode === "resigned" && (emp.status || "").toUpperCase() === "ACTIVE") return false;

      const lowerSearch = search.trim().toLowerCase();
      if (lowerSearch) {
        const matches =
          emp.name.toLowerCase().includes(lowerSearch) ||
          emp.id.toLowerCase().includes(lowerSearch) ||
          emp.designation.toLowerCase().includes(lowerSearch) ||
          emp.email.toLowerCase().includes(lowerSearch);
        if (!matches) return false;
      }

      if (departmentFilter && emp.department !== departmentFilter) return false;
      if (locationFilter && emp.location !== locationFilter) return false;
      if (statusFilter && (emp.status || "").toUpperCase() !== (statusFilter || "").toUpperCase()) return false;
      if (managerFilter && emp.manager !== managerFilter) return false;
      if (managerEmailFilter && emp.managerEmail !== managerEmailFilter) return false;

      if (dojFrom) {
        const from = formatDateForCompare(dojFrom);
        if (!empDOJ || empDOJ < from) return false;
      }
      if (dojTo) {
        const to = formatDateForCompare(dojTo);
        if (!empDOJ || empDOJ > new Date(new Date(to).setHours(23, 59, 59))) return false;
      }
      if (exitFrom) {
        const from = formatDateForCompare(exitFrom);
        if (!empExit || empExit < from) return false;
      }
      if (exitTo) {
        const to = formatDateForCompare(exitTo);
        if (!empExit || empExit > new Date(new Date(to).setHours(23, 59, 59))) return false;
      }

      return true;
    });
  }, [
    employees,
    search,
    departmentFilter,
    locationFilter,
    statusFilter,
    managerFilter,
    managerEmailFilter,
    dojFrom,
    dojTo,
    exitFrom,
    exitTo,
    viewMode,
    currentMonth,
    currentDay,
  ]);

  const clearAll = () => {
    setSearch("");
    setDepartmentFilter("");
    setLocationFilter("");
    setStatusFilter("");
    setManagerFilter("");
    setManagerEmailFilter("");
    setDojFrom("");
    setDojTo("");
    setExitFrom("");
    setExitTo("");
    setViewMode("all");
  };

  const exportExcel = () => {
    const tableData = filteredEmployees.map((emp) => ({
      ID: emp.id,
      Name: emp.name,
      Department: emp.department,
      Designation: emp.designation,
      Location: emp.location,
      Email: emp.email,
      Manager: emp.manager,
      ManagerEmail: emp.managerEmail,
      DOB: emp.dob,
      DOJ: emp.doj,
      ExitDate: emp.exitDate,
      Status: emp.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(
      workbook,
      `Employee_Directory_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const handleAddEmployee = () => {
    navigate("/onboarding"); // redirect to onboarding page
  };


 

const getAvatarColor = (name) => {
  if (!name) return "cccccc"; // ✅ prevent crash

  const colors = ["1abc9c", "3498db", "9b59b6", "e67e22", "e74c3c", "2ecc71"];
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};
  return (
    <div className="directory-container">
      {/* Top Add Employee button */}
      <div className="header-actions" style={{ marginBottom: "10px" }}>
        <button className="add-btn-top" onClick={handleAddEmployee}>
          ➕ Add Employee
        </button>
         <button className="invite-btn-top" onClick={() => setShowInvite(true)}>
    📩 Invite Employee
  </button> 
      </div>

   {showInvite && (
  <div className="invite-modal-overlay">
    <div className="invite-modal">
      <h3>Invite Employee</h3>

      <input
        type="email"
        placeholder="Enter employee email "
        value={inviteEmail}
  onChange={(e) => setInviteEmail(e.target.value)}
      />

      <input
  
  type="text"
  placeholder="Enter Temporary Password "
  onChange={(e) => setOtp(e.target.value)}
/>

    <div className="invite-info">
  The employee will receive an email with a secure onboarding link.
  <br /><br />
  They need to click the link and set their password to access the HRMS portal.
</div>

      <div className="invite-actions">
        <button className="send-btn" onClick={sendInviteEmployee}>
  Send Invite
</button>
        <button className="cancel-btn" onClick={() => setShowInvite(false)}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
      {/* Main Header */}
      <div className="directory-header">
        <h2>Employee Directory</h2>

        <div className="header-actions">
          <div className="mode-buttons">
            <button
              className={viewMode === "all" ? "active-mode" : ""}
              onClick={() => setViewMode("all")}
            >
              📋 View All
            </button>
            <button
              className={viewMode === "birthday" ? "active-mode" : ""}
              onClick={() => setViewMode("birthday")}
            >
              🎂 Birthdays
            </button>
            <button
              className={viewMode === "anniversary" ? "active-mode" : ""}
              onClick={() => setViewMode("anniversary")}
            >
              🎉 Anniversary
            </button>
            <button
              className={viewMode === "resigned" ? "active-mode" : ""}
              onClick={() => setViewMode("resigned")}
            >
              🚪 Resigned
            </button>
          </div>

          <div className="action-buttons">
            <button className="clear-btn" onClick={clearAll}>
              Clear Filters
            </button>
            <button className="export-btn" onClick={exportExcel}>
              ⬇ Download
            </button>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="table-wrapper">
        <table className="employee-table">
          <thead>
            <tr className="table-head">
             <th>
  <div className="th-header">
    Profile
    <span onClick={() => setActiveFilter("profile")}>⏷</span>
  </div>

  {activeFilter === "profile" && (
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
              setColumnFilters({
                ...columnFilters,
                profile: s,
              });
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
              <th>
  <div className="th-header">
    Employee Name
    <span onClick={() => setActiveFilter("employeename")}>⏷</span>
  </div>

  {activeFilter === "employeename" && (
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
              setColumnFilters({
                ...columnFilters,
                employeename: s,
              });
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
             <th>
  <div className="th-header">
    Emp ID
    <span onClick={() => setActiveFilter("employeeId")}>⏷</span>
  </div>

  {activeFilter === "employeeId" && (
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
              setColumnFilters({
                ...columnFilters,
                employeeId: s,
              });
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
             <th>
  <div className="th-header">
    Department
    <span onClick={() => setActiveFilter("employeedepartment")}>⏷</span>
  </div>

  {activeFilter === "employeedepartment" && (
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
              setColumnFilters({
                ...columnFilters,
                employeedepartment: s,
              });
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
            <th>
  <div className="th-header">
    Designation
    <span onClick={() => setActiveFilter("employeedesignation")}>⏷</span>
  </div>

  {activeFilter === "employeedesignation" && (
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
              setColumnFilters({
                ...columnFilters,
                employeedesignation: s,
              });
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
           <th>
  <div className="th-header">
    Location
    <span onClick={() => setActiveFilter("employeelocation")}>⏷</span>
  </div>

  {activeFilter === "employeelocation" && (
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
              setColumnFilters({
                ...columnFilters,
                employeelocation: s,
              });
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
             <th>
  <div className="th-header">
    Employee Email
    <span onClick={() => setActiveFilter("employeeId")}>⏷</span>
  </div>

  {activeFilter === "employeeemail" && (
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
              setColumnFilters({
                ...columnFilters,
                employeeemail: s,
              });
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
            <th>
  <div className="th-header">
    Reporting Manager
    <span onClick={() => setActiveFilter("employeereportingmanager")}>⏷</span>
  </div>

  {activeFilter === "employeereportingmanager" && (
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
              setColumnFilters({
                ...columnFilters,
                employeereporting: s,
              });
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
             <th>
  <div className="th-header">
    Employee DOB
    <span onClick={() => setActiveFilter("employeeDOB")}>⏷</span>
  </div>

  {activeFilter === "employeeDOB" && (
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
              setColumnFilters({
                ...columnFilters,
                employeeDOB: s,
              });
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
             <th>
  <div className="th-header">
    Employee DOJ
    <span onClick={() => setActiveFilter("employeeDOJ")}>⏷</span>
  </div>

  {activeFilter === "employeeDOJ" && (
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
              setColumnFilters({
                ...columnFilters,
                employeeDOJ: s,
              });
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
            <th>
  <div className="th-header">
    Employee ExitDate
    <span onClick={() => setActiveFilter("employeeexitdate")}>⏷</span>
  </div>

  {activeFilter === "employeeexitdate" && (
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
              setColumnFilters({
                ...columnFilters,
                employeeexitdate: s,
              });
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
              <th>
  <div className="th-header">
    Status
    <span onClick={() => setActiveFilter("employeestatus")}>⏷</span>
  </div>

  {activeFilter === "employeestatus" && (
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
              setColumnFilters({
                ...columnFilters,
                employeestatus: s,
              });
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
            </tr>

            {/* Filter row */}
            <tr className="filter-row">
              
             
             
              
            
         
             
             
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="12" className="no-data">
                  No employees found
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp, index) => (
                <tr key={`${emp.employeeId}-${emp.email}-${index}`}>
                  <td>
                 <img
  src={
    emp.image && emp.image !== ""
      ? emp.image
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.fullName)}&background=${getAvatarColor(emp.fullName)}&color=fff`
  }
  alt={emp.fullName}
  className="profile-pic"
/>
                  </td>
                  <td>{emp.fullName}</td> 
                  <td>{emp.employeeId}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.location}</td>
                  <td>{emp.email}</td>
                  <td>
                    {emp.manager}
                    <div className="mgr-email">{emp.managerEmail}</div>
                  </td>
                  <td>{emp.dob}</td>
                  <td>{emp.doj}</td>
                  <td>{emp.exitDate}</td>
                  <td>
                    <span
                      className={`status ${
                        (emp.status || "").toUpperCase() === "ACTIVE"
                          ? "active"
                          : (emp.status || "").toUpperCase() === "SERVING NOTICE"
                          ? "notice"
                          : "resigned"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        
        
      </div>
    </div>
  );
}
