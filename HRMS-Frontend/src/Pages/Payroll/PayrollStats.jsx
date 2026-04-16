import React from "react";
import {
  FaMoneyBillWave,
  FaMinusCircle,
  FaWallet,
} from "react-icons/fa";

const PayrollStats = ({
  totalEmployees,
  totalPayroll,
  totalDeductions,
  totalNetPay
}) => {
  return (
    <div className="kpi-row">
      {/* TOTAL SALARY */}
      <div className="kpi-card blue">
        <div className="kpi-content">
          <p className="kpi-title">Total Salary</p>
          <h2 className="kpi-value">
  ₹ {totalPayroll?.toLocaleString() || 0}
</h2>
        </div>
        <div className="kpi-icon">
          <FaMoneyBillWave />
        </div>
      </div>

      {/* TOTAL DEDUCTIONS */}
      <div className="kpi-card red">
        <div className="kpi-content">
          <p className="kpi-title">Total Deductions</p>
     <h2 className="kpi-value">
  -₹ {totalDeductions?.toLocaleString() || 0}
</h2>
        </div>
        <div className="kpi-icon">
          <FaMinusCircle />
        </div>
      </div>

      {/* TOTAL NET PAY */}
      <div className="kpi-card green">
        <div className="kpi-content">
          <p className="kpi-title">Total Net Pay</p>
        <h2 className="kpi-value">
  ₹ {totalNetPay?.toLocaleString() || 0}
</h2>
        </div>
        <div className="kpi-icon">
          <FaWallet />
        </div>
      </div>
    </div>
  );
};

export default PayrollStats;
