import React from "react";
import "./Settings.css";

const SettingsLayout = ({ activeTab, setActiveTab, children }) => {
  return (
    <div className="settings-container">
      <h2 className="settings-title">HRMS Settings</h2>

      <div className="settings-layout">

        {/* LEFT MENU */}
        <div className="settings-menu">
          <button className={activeTab==="company"?"active":""} onClick={()=>setActiveTab("company")}>Company Profile</button>
          <button className={activeTab==="departments"?"active":""} onClick={()=>setActiveTab("departments")}>Departments</button>
          <button className={activeTab==="designations"?"active":""} onClick={()=>setActiveTab("designations")}>Designations</button>
          <button className={activeTab==="roles"?"active":""} onClick={()=>setActiveTab("roles")}>Role Management</button>
          <button className={activeTab==="attendance"?"active":""} onClick={()=>setActiveTab("attendance")}>Attendance Rules</button>
          <button className={activeTab==="leave"?"active":""} onClick={()=>setActiveTab("leave")}>Leave Policies</button>
          <button className={activeTab==="salary"?"active":""} onClick={()=>setActiveTab("salary")}>Salary Structure</button>
          <button className={activeTab==="notifications"?"active":""} onClick={()=>setActiveTab("notifications")}>Notifications</button>
          <button className={activeTab==="security"?"active":""} onClick={()=>setActiveTab("security")}>Security</button>
        </div>

        {/* RIGHT PANEL */}
        <div className="settings-pane">
          {children}
        </div>

      </div>
    </div>
  );
};

export default SettingsLayout;