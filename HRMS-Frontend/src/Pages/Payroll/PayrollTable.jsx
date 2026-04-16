import React from "react";
import PayrollRow from "./PayrollRow";
import payslipData from "../../Data/PaySlipData";
import "./Payroll.css";

const PayrollTable = ({ data, onViewPayslip, onProfileView , onEditPayroll, onDownloadPayslip,onProcessPayroll,onStatusChange}) => {
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
           data.map((record) => (
              <PayrollRow
                key={record.employeeId || record.empId || record.empCode}
                record={record}
                onViewPayslip={onViewPayslip}
                onProfileView={onProfileView}
                 onEditPayroll={onEditPayroll}   // ✅ ADD THIS
                 onDownloadPayslip={onDownloadPayslip}
                  onProcessPayroll={onProcessPayroll}   // ✅ ADD
  onStatusChange={onStatusChange}       // ✅ ADD
              />
            ))
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
