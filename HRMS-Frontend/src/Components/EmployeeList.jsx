// src/Components/EmployeeList.jsx
import React from "react";
import "./payroll.css"; // reuse same styles

const EmployeeList = ({ employees, onSelect }) => {
  return (
    <div className="monthly-table">
      <h4>All Employees</h4>
      <div className="table-header">
        <span>Employee Name</span>
        <span>Designation</span>
        <span>Action</span>
      </div>

      {employees.map((emp, index) => (
        <div key={index} className="table-row">
          <span>{emp.name}</span>
          <span>{emp.designation}</span>
          <button
            className="download-btn"
            onClick={() => onSelect(emp)}
          >
            View Payslip
          </button>
        </div>
      ))}
    </div>
  );
};

export default EmployeeList;
