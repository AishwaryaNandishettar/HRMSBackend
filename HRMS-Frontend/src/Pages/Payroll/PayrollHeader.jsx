import React from "react";
import { useNavigate } from "react-router-dom";
import "./payroll.css";

const PayrollHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="payroll-header">
      <div>
        <h2>Payroll Management</h2>
        <p>View and manage payroll records</p>
      </div>

      {/* ✅ REPLACED BUTTON */}
      <button
        className="btn-primary"
        onClick={() => navigate("/update-payroll")}
      >
        Update Payroll
      </button>
    </div>
  );
};

export default PayrollHeader;
