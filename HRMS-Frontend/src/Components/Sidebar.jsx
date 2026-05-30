// src/Components/Sidebar.jsx

import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserTie } from "react-icons/fa";
import {
  FaHome,
  FaUserCircle,
  FaClock,
  FaCalendarCheck,
   FaCalendarAlt,
  FaMoneyBillWave,
  FaShieldAlt,
  FaWallet,
  FaIdBadge,
  FaChartBar,
  FaSignOutAlt,
  
  FaCreditCard,
  FaHandHoldingUsd,
  FaComments,
  FaChevronLeft,
  FaChevronRight,
  FaTasks,          // ✅ ADDED
  FaChartLine       // ✅ ADDED
} from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import styles from "./Sidebar.module.css"; // ✅ KEEP THIS
import { AuthContext } from "../Context/Authcontext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ SAFE ROLE HANDLING
  const role = user?.role?.toLowerCase();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
const handleMenuClick = () => {
  if (window.innerWidth <= 768) {
    setIsOpen(false);
  }
};
  return (
    <div
      className={`${styles.sidebarContainer} ${
        isOpen ? styles.open : styles.closed
      }`}
    >
      {/* TOGGLE */}
      <div
        className={styles.toggleBtn}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </div>

      <ul className={styles.sidebarMenu} onClick={handleMenuClick}>

  <div className={styles.sidebarTitle}>
    <span className={styles.titleText}>
      Employee Portal
    </span>
  </div>
       

        {/* BASIC */}
        <li>
          <NavLink  to="/home"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
          
            <FaHome />
            {isOpen && <span>Home</span>}
          </NavLink>
        </li>

        <li>
        <NavLink
  to="/profile"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
  <FaUserCircle />
  {isOpen && <span>Profile</span>}
</NavLink>
        </li>

        <li>
          <NavLink  to="/timesheet"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
            <FaClock />
            {isOpen && <span>Timesheet Management</span>}
          </NavLink>
        </li>

       <li>
  <NavLink  to="/attendance"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
    <FaCalendarCheck />
    {isOpen && <span>Attendance Management</span>}
  </NavLink>
</li>

 
      {/* RECRUITMENT */}
{(role === "admin" || role === "manager") && (
  <li>
    <NavLink  to="/recruitment"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
      <FaUserTie />
      {isOpen && <span>Recruitment</span>}
    </NavLink>
  </li>
)}

        <li>
  <NavLink  to="/leave"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
    <FaCalendarAlt />
    {isOpen && <span>Leave Management</span>}
  </NavLink>
</li>

        <li>
          <NavLink  to="/workchat"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
            <FaComments />
            {isOpen && <span>Work Chat</span>}
          </NavLink>
        </li>

        {/* ✅ NEW: TASKS */}
        <li>
          <NavLink  to="/tasks"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
            <FaTasks />
            {isOpen && <span>Tasks</span>}
          </NavLink>
        </li>

<li>
  <NavLink  to="/helpdesk"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
    <FaComments />
    {isOpen && <span>Helpdesk</span>}
  </NavLink>
</li>
        {/* ✅ PERFORMANCE (All users can view performance) */}
        <li>
          <NavLink  to="/performance"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
            <FaChartLine />
            {isOpen && <span>Performance</span>}
          </NavLink>
        </li>

        {/* PAYROLL */}
        {(role === "employee" || role === "manager" || role === "admin") && (
          <li>
            <NavLink  to="/payroll"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
              <FaMoneyBillWave />
              {isOpen && <span>Payroll</span>}
            </NavLink>
          </li>
        )}



       {/* ✅ FINANCIAL ASSESSMENT (Admin / Manager) */}
{(role === "admin" || role === "manager") && (
  <li>
    <NavLink  to="/financial-assessment"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
      <FaChartBar />
      {isOpen && <span>Financial Assessment</span>}
    </NavLink>
  </li>
)}
        {/* COMMON */}
        <li>
          <NavLink  to="/insurance-claim"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
            <FaShieldAlt />
            {isOpen && <span>Insurance Claim</span>}
          </NavLink>
        </li>

<li>
  <NavLink  to="/personal-insurance"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
    <FaShieldAlt />
    {isOpen && <span>Personal Insurance Claim</span>}
  </NavLink>
</li>
        <li>
          <NavLink  to="/reimbursement"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
            <FaWallet />
            {isOpen && <span>Reimbursement</span>}
          </NavLink>
        </li>

       {/* ADMIN ONLY */}
{role === "admin" && (
  <>
    <li>
      <NavLink  to="/employee-card"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
        <FaIdBadge />
        {isOpen && <span>Employee Directory</span>}
      </NavLink>
    </li>

    <li>
      <NavLink  to="/report"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
        <FaChartBar />
        {isOpen && <span>Report</span>}
      </NavLink>
    </li>

    <li>
      <NavLink  to="/bgv"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
        <FaShieldAlt />
        {isOpen && <span>BGV</span>}
      </NavLink>
    </li>

    <li>
      <NavLink  to="/invite"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
        <FaUserTie />
        {isOpen && <span>Invite Employee</span>}
      </NavLink>
    </li>
  </>
)}

           {/* ALL ROLES */}
{(role === "admin" || role === "manager" || role === "employee") && (
  <>
    <li>
      <NavLink  to="/settings"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
        <FiSettings />
        {isOpen && <span>Settings</span>}
      </NavLink>
    </li>

    <li>
      <NavLink  to="/cibil-check"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
        <FaCreditCard />
        {isOpen && <span>CIBIL Check</span>}
      </NavLink>
    </li>

    <li>
      <NavLink  to="/loan-application"
  className={({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.activeLink : ""
    }`
  }
>
        <FaHandHoldingUsd />
        {isOpen && <span>Loan Application</span>}
      </NavLink>
    </li>
  </>
)}


          

        {/* LOGOUT */}
        <li onClick={handleLogout} style={{ cursor: "pointer" }}>
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;