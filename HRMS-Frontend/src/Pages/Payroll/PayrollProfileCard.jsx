import React from "react";
import "./payroll.css";

const PayrollProfileCard = ({ employee }) => {
 const isRecord = !!employee;

  const profile = {
   name:
    employee?.empName ||
    employee?.fullName ||
    employee?.name ||
    employee?.employee?.name,

  role:
    employee?.department ||
    employee?.dept ||
    employee?.designation ||
    employee?.employee?.role ||
    "Finance • Accountant",

  avatar:
    employee?.employee?.avatar ||
    employee?.avatar ||
    employee?.image ||
    "https://i.pravatar.cc/80?img=1",

  gross:
    employee?.gross ||
    employee?.grossPay ||
    employee?.salary ||
    0,

     deduction:
    (employee?.tax || 0) +
    (employee?.pf || 0) +
    (employee?.insurance || 0),

  net:
    employee?.net ||
    employee?.netPay ||
    employee?.salary ||
    0,

     history: employee
    ? [
        {
          month: employee?.month || "Current",
          amount: employee?.net || employee?.netPay || employee?.salary || 0,
        },
      ]
    : [
        { month: "Jan 2022", amount: 5100 },
        { month: "Dec 2021", amount: 5100 },
      ],

    notes: employee
    ? `Payroll processed for ${employee?.month || "selected employee"}`
    : "Payroll processed successfully.",
};

  return (
    <div className="profile-card">
      <img
        src={profile.avatar}
        alt={profile.name}
        className="profile-avatar"
      />

      <h3>{profile.name}</h3>
      <p className="muted">{profile.role}</p>

      <div className="salary-box">
        <div>
          <span>Gross Pay</span>
          <strong>₹{profile.gross.toLocaleString()}</strong>
        </div>

        <div>
          <span>Deductions</span>
          <strong className="danger">
            ₹{profile.deduction.toLocaleString()}
          </strong>
        </div>

        <div>
          <span>Net Pay</span>
          <strong className="success">
            ₹{profile.net.toLocaleString()}
          </strong>
        </div>
      </div>

      <button
        className="btn-primary full"
        disabled={!isRecord}
        title={
          isRecord
            ? "Edit salary details"
            : "Select an employee to edit"
        }
      >
        Edit Salary
      </button>

      <h4>Payment History</h4>
      {profile.history.map((h, i) => (
        <p key={i} className="history-row">
          {h.month} — ₹{h.amount.toLocaleString()}
        </p>
      ))}

      <h4>Notes</h4>
      <p className="notes">{profile.notes}</p>
    </div>
  );
};

export default PayrollProfileCard;
