import React, { useState } from "react";

const SalaryStructure = () => {
  const [salary, setSalary] = useState({
    basic: "",
    hra: "",
    pf: "",
  });

  return (
    <div className="settings-section">
      <h3>Salary Structure</h3>

      <div className="form-group">
        <label>Basic %</label>
        <input type="number" onChange={(e) => setSalary({ ...salary, basic: e.target.value })} />
      </div>

      <div className="form-group">
        <label>HRA %</label>
        <input type="number" onChange={(e) => setSalary({ ...salary, hra: e.target.value })} />
      </div>

      <div className="form-group">
        <label>PF %</label>
        <input type="number" onChange={(e) => setSalary({ ...salary, pf: e.target.value })} />
      </div>

      <button className="save-btn">Save</button>
    </div>
  );
};

export default SalaryStructure;