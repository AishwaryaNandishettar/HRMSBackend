import React from "react";
import PayrollRow from "./PayrollRow";
import payslipData from "../../Data/PaySlipData";
import "./Payroll.css";

const PayrollTable = ({ data, onViewPayslip, onProfileView , onEditPayroll, onDownloadPayslip,onProcessPayroll,onStatusChange}) => {
  // ✅ GRAND TOTAL CALCULATION (based on table data only)
const totalGross = data.reduce(
  (sum, emp) => sum + (emp.gross || emp.grossPay || emp.salary || 0),
  0
);

const totalDeductions = data.reduce(
  (sum, emp) =>
    sum + ((emp.tax || 0) + (emp.pf || 0) + (emp.insurance || 0)),
  0
);

const totalNet = data.reduce(
  (sum, emp) => sum + (emp.net || emp.netPay || 0),
  0
);
  return (
    <div className="payroll-table-wrapper">
      <table className="payroll-table">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Employee ID</th>
            <th> DEpartment</th>
          
<th>Gross Pay</th>
<th>Deductions</th>
<th>Net Pay</th>
<th>Status</th>

      <th>Payroll Status</th>   {/* ✅ NEW COLUMN */}     
            <th style={{ textAlign: "right" }}>Actions</th>
           
            
          
          </tr>
        </thead>

       <tbody>
  {!data || data.length === 0 ? (
    <tr>
      <td colSpan="9" className="empty-row">
        No payroll records found
      </td>
    </tr>
  ) : (
    <>
      {/* ✅ ROWS */}
      {data.map((record) => (
        <PayrollRow
          key={record.employeeId || record.empId || record.empCode}
          record={record}
          onViewPayslip={onViewPayslip}
          onProfileView={onProfileView}
          onEditPayroll={onEditPayroll}
          onDownloadPayslip={onDownloadPayslip}
          onProcessPayroll={onProcessPayroll}
          onStatusChange={onStatusChange}
        />
      ))}

      {/* ✅ GRAND TOTAL ROW (ADD HERE EXACTLY) */}
      <tr className="grand-total-row">
        <td colSpan="3"><strong>Grand Total</strong></td>
        <td><strong>{totalGross.toLocaleString()}</strong></td>
        <td><strong>{totalDeductions.toLocaleString()}</strong></td>
        <td><strong>{totalNet.toLocaleString()}</strong></td>
        <td colSpan="3"></td>
      </tr>
    </>
  )}
</tbody>
      </table>

      <div className="table-footer">
        Showing <strong>{data.length}</strong> records
      </div>
    </div>
  );
};

export default PayrollTable;
