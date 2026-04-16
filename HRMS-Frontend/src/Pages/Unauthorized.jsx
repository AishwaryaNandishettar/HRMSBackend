import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome, FaUser, FaClock, FaCalendarCheck,
  FaMoneyCheckAlt, FaShieldAlt, FaWallet, FaCommentDots,
  FaCalendarAlt, FaChevronLeft, FaChevronRight, FaUmbrellaBeach
} from "react-icons/fa";
import "../Components/Sidebar.css";

import { AuthContext } from "../Context/Authcontext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useContext(AuthContext);

  const role = user?.role;

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaChevronLeft className="toggle-icon" /> : <FaChevronRight className="toggle-icon" />}
      </div>

      <h2 className="sidebar-title">{isOpen && 'Employee Portal'}</h2>

      <ul className="sidebar-menu">
        <li><NavLink to="/Home"><FaHome className="icon" /><span>{isOpen && 'Home'}</span></NavLink></li>
        <li><NavLink to="/Profile"><FaUser className="icon" /><span>{isOpen && 'Profile'}</span></NavLink></li>

        {/* Visible to all roles (example pages) */}
        <li><NavLink to="/Timesheet"><FaClock className="icon" /><span>{isOpen && 'Timesheet'}</span></NavLink></li>
        <li><NavLink to="/Attendance"><FaCalendarCheck className="icon" /><span>{isOpen && 'Attendance'}</span></NavLink></li>
        <li><NavLink to="/Leave"><FaUmbrellaBeach className="icon" /><span>{isOpen && 'Leave'}</span></NavLink></li>

        {/* Manager/Admin only */}
        {(role === "manager" || role === "admin") && (
          <li><NavLink to="/Payroll"><FaMoneyCheckAlt className="icon" /><span>{isOpen && 'Payroll'}</span></NavLink></li>
        )}

        {/* Admin only samples */}
        {role === "admin" && (
          <>
            <li><NavLink to="/Insuranceclaim"><FaShieldAlt className="icon" /><span>{isOpen && 'InsuranceClaim'}</span></NavLink></li>
            <li><NavLink to="/Reimbursementform"><FaWallet className="icon" /><span>{isOpen && 'ReimbursementForm'}</span></NavLink></li>
            <li><NavLink to="/Employeedirectory"><FaCalendarAlt className="icon" /><span>{isOpen && 'Employeedirectory'}</span></NavLink></li>
            <li><NavLink to="/Reports"><FaCalendarAlt className="icon" /><span>{isOpen && 'Reports'}</span></NavLink></li>
            <li><NavLink to="/Settings"><FaCalendarAlt className="icon" /><span>{isOpen && 'Settings'}</span></NavLink></li>
          </>
        )}

        <li><NavLink to="/Login"><FaCalendarAlt className="icon" /><span>{isOpen && 'Login'}</span></NavLink></li>
      </ul>
    </div>
  );
};

export default Sidebar;
