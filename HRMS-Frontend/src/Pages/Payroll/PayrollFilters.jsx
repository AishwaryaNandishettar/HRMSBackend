const PayrollFilters = () => {
  return (
    <div className="payroll-filters">
      <input type="text" placeholder="Search employees..." />

    From Month   →   To Month

      <button className="btn-secondary" onClick={onExport}>Export</button>
    </div>
  );
};

export default PayrollFilters;
