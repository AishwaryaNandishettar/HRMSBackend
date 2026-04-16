import React, { useState } from "react";
import SettingsLayout from "./SettingsLayout";

import CompanyForm from "../Components/Settings/CompanyForm";
import DepartmentManager from "../Components/Settings/DepartmentManager";
import DesignationManager from "../Components/Settings/DesignationManager";
import RoleManagement from "../Components/Settings/RoleManagement";
import AttendanceRules from "../Components/Settings/AttendanceRules";
import LeavePolicy from "../Components/Settings/LeavePolicy";
import SalaryStructure from "../Components/Settings/SalaryStructure";
import NotificationSettings from "../Components/Settings/NotificationSettings";
import SecuritySettings from "../Components/Settings/SecuritySettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("company");

  const renderComponent = () => {
    switch (activeTab) {
      case "company": return <CompanyForm />;
      case "departments": return <DepartmentManager />;
      case "designations": return <DesignationManager />;
      case "roles": return <RoleManagement />;
      case "attendance": return <AttendanceRules />;
      case "leave": return <LeavePolicy />;
      case "salary": return <SalaryStructure />;
      case "notifications": return <NotificationSettings />;
      case "security": return <SecuritySettings />;
      default: return <CompanyForm />;
    }
  };

  return (
    <SettingsLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderComponent()}
    </SettingsLayout>
  );
};

export default Settings;