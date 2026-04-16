import React from "react";
import "./payroll.css";

const PayrollFooter = ({ currentPage, setCurrentPage, totalPages }) => {
  return (
    <div className="payroll-footer">
      <div className="legend">
        <span className="dot pending" /> Pending
        <span className="dot approved" /> Approved
        <span className="dot rejected" /> Rejected
      </div>

      <div className="pagination">
  <button 
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Previous
  </button>

  {[...Array(totalPages)].map((_, i) => (
    <button
      key={i}
      className={currentPage === i + 1 ? "active" : ""}
      onClick={() => setCurrentPage(i + 1)}
    >
      {i + 1}
    </button>
  ))}

  <button 
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Next
  </button>
</div>
    </div>
  );
};

export default PayrollFooter;
