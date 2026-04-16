import React, { useEffect, useState , useContext} from "react";
import { getAllEmployees } from "../../api/employeeApi";
import { createPayrollBatch } from "../../api/payrollApi";
import "./UpdatePayroll.css";
import { useNavigate , useLocation} from "react-router-dom";

const UpdatePayroll = () => {
  
   const navigate = useNavigate();   // ✅ ADD HERE
   const location = useLocation();
  const [employees, setEmployees] = useState([]);
  const [payrollData, setPayrollData] = useState({});
  const [mode, setMode] = useState("EDIT"); // EDIT | REVIEW
  const [month] = useState("April-2026");

  useEffect(() => {
  getAllEmployees()
    .then((res) => {
      const data = Array.isArray(res) ? res : res.data;

      console.log("🔥 FETCHED EMPLOYEES:", data); // Debug

      setEmployees(data);

      const initial = {};
      data.forEach((emp) => {
        console.log(`Employee: ${emp.fullName}, Status: '${emp.status}'`); // Debug
        
        initial[emp.employeeId] = {
          companyName: "OMOIKANE INNOVATIONS PVT LTD",
          empName: emp.fullName,
          department: emp.department,
          doj: emp.doj || emp.joiningDate || "",

          // ✅ MAP FROM DIRECTORY (FIXED - case-insensitive)
          birthDate: emp.dob || emp.birthDate || "",
          isActive: (emp.status || "").toUpperCase() === "ACTIVE" || emp.isActive === true,

          reportManager: emp.manager || "",

          esi: 0,
          pf: 0,
          tax: 0,
          incentive: 0,
          allowance: 0,
          bonus: 0,
          basic: 0,
          hra: 0,
          deduction: 0,
          gross: 0,
          net: 0,
          conveyance: 0,
          professionalTax: 0,
          lopDeduction: 0,
          otherDeduction: 0,

          workingDays: 30,
          paidDays: 30,
          lopDays: 0,
        };
      });

      console.log("🔥 INITIAL PAYROLL DATA:", initial); // Debug

      setPayrollData(initial);
    })
    .catch((err) => console.error("❌ Employee fetch error:", err));
}, []);

useEffect(() => {
  if (location.state?.employee) {
    const emp = location.state.employee;

    setPayrollData((prev) => ({
      ...prev,
      [emp.employeeId]: {
        ...prev[emp.employeeId],
        empName: emp.empName,
        department: emp.department,
        basic: emp.basic || 0,
        hra: emp.hra || 0,
        allowance: emp.allowance || 0,
        bonus: emp.bonus || 0,
        incentive: emp.incentive || 0,
        pf: emp.pf || 0,
        esi: emp.esi || 0,
        tax: emp.tax || 0,
        deduction: emp.deduction || 0,
        gross: emp.gross || 0,
        net: emp.net || 0,
        conveyance: emp.conveyance || 0,
        professionalTax: emp.professionalTax || 0,
        lopDeduction: emp.lopDeduction || 0,
        otherDeduction: emp.otherDeduction || 0,
        workingDays: emp.workingDays || 30,
        paidDays: emp.paidDays || 30,
        lopDays: emp.lopDays || 0,
        reportManager: emp.reportManager || ""
      }
    }));

    setMode("EDIT"); // optional but useful
  }
}, [location.state]);

useEffect(() => {
  if (location.state?.employee) {
    setMode("EDIT");
  }
}, []);

  // ---------------- CALCULATION ----------------
 const updateField = (id, field, value) => {

  const numericFields = [
    "esi","pf","tax","incentive","allowance",
    "bonus","basic","hra","deduction",
    "conveyance",
    "professionalTax",
    "lopDeduction",
    "otherDeduction",
    "workingDays",
    "paidDays",
    "lopDays"
  ];

  const updated = {
    ...payrollData[id],
    [field]: numericFields.includes(field)
      ? Number(value || 0)
      : value,
  };

  // ✅ AUTO CALC AFTER updated exists
  updated.workingDays = 30;
  updated.lopDays = Number(updated.lopDays || 0);
  updated.paidDays = updated.workingDays - updated.lopDays;

  const gross =
    updated.basic +
    updated.hra +
    updated.allowance +
    updated.bonus +
    updated.incentive +
    updated.conveyance;

  const deductions =
    updated.pf +
    updated.tax +
    updated.esi +
    updated.deduction +
    updated.professionalTax +
    updated.lopDeduction +
    updated.otherDeduction;

  setPayrollData({
    ...payrollData,
    [id]: updated,
  });
};
  // ---------------- SAVE ----------------
const savePayroll = async () => {
  const payload = Object.keys(payrollData).map((id) => {
    const d = payrollData[id];

    // ✅ CALCULATE GROSS AND NET
    const gross =
      Number(d.basic || 0) +
      Number(d.hra || 0) +
      Number(d.allowance || 0) +
      Number(d.bonus || 0) +
      Number(d.incentive || 0) +
      Number(d.conveyance || 0);

    const deductions =
      Number(d.pf || 0) +
      Number(d.esi || 0) +
      Number(d.tax || 0) +
      Number(d.deduction || 0) +
      Number(d.professionalTax || 0) +
      Number(d.lopDeduction || 0) +
      Number(d.otherDeduction || 0);

    const net = gross - deductions;

    return {
      companyName: d.companyName,
      employeeId: id,
      empName: d.empName,
      department: d.department,
      month,
      // ✅ STATUS MUST BE "ACTIVE" (not "Active")
      status: d.isActive ? "ACTIVE" : "INACTIVE",
      updatedAt: Date.now(),
      birthDate: d.birthDate,
      isActive: d.isActive,
      basic: Number(d.basic || 0),
      hra: Number(d.hra || 0),
      allowance: Number(d.allowance || 0),
      bonus: Number(d.bonus || 0),
      incentive: Number(d.incentive || 0),
      pf: Number(d.pf || 0),
      esi: Number(d.esi || 0),
      tax: Number(d.tax || 0),
      deduction: Number(d.deduction || 0),
      // ✅ USE CALCULATED VALUES
      gross: gross,
      net: net,
      conveyance: Number(d.conveyance || 0),
      professionalTax: Number(d.professionalTax || 0),
      lopDeduction: Number(d.lopDeduction || 0),
      otherDeduction: Number(d.otherDeduction || 0),
      workingDays: Number(d.workingDays || 30),
      paidDays: Number(d.paidDays || 30),
      lopDays: Number(d.lopDays || 0),
      reportManager: d.reportManager || ""
    };
  });

  console.log("🔥 CLEAN PAYLOAD:", payload);

  try {
    const res = await createPayrollBatch(payload);
    console.log("🔥 RESPONSE:", res.data);
    alert("✅ Payroll Saved Successfully!");

    // 🚀 NAVIGATE AFTER SUCCESS
    navigate("/payroll", { state: { refresh: Date.now() } });
  } catch (err) {
    console.error("❌ SAVE FAILED:", err.response?.data || err.message);
    alert("❌ Failed to save: " + (err.response?.data?.message || err.message));
  }
};

  return (
    <div className="update-payroll-container">

      {/* HEADER ACTIONS */}
      <div className="actions" style={{ marginBottom: 15 }}>
        <button className="btn-primary" onClick={() => setMode("EDIT")}>
          Edit Mode
        </button>

        <button onClick={() => setMode("REVIEW")}>
          Review Mode
        </button>

        <button className="btn-primary" onClick={savePayroll}>
          Save Payroll
        </button>

       <button
  className="btn-danger"
  onClick={() => navigate("/payroll")}
>
  Cancel
</button>
      </div>

      {/* FULL TABLE */}
      <div className="table-wrapper">
        <table className="table full-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Dept</th>
              <th>DOJ</th>
              <th>Birth Date</th>
<th>Status</th>
              <th>Report Manager</th>
              <th>ESI</th>
              <th>PF</th>
              <th>Tax</th>
              <th>Incentive</th>
              <th>Allowance</th>
              <th>Bonus</th>
              <th>Basic</th>
              <th>HRA</th>
              <th>Deduction</th>
              <th>Gross Pay</th>
              <th>Net Pay</th>
              <th>Conveyance</th>
<th>Prof Tax</th>
<th>LOP Ded</th>
<th>Other Ded</th>

<th>Working Days</th>
<th>Paid Days</th>
<th>LOP Days</th>
            </tr>
          </thead>

          <tbody>
  {Object.keys(payrollData).map((id) => {
    const d = payrollData[id];

    return (
      <tr key={id}>
        <td>
  <input
    value={d.companyName}
    disabled={mode === "REVIEW"}
    onChange={(e) => updateField(id, "companyName", e.target.value)}
  />
</td>
        <td>{id}</td>
        <td>{d.empName}</td>
        <td>{d.department}</td>
        <td>{d.doj}</td>

        <td>{d.birthDate}</td>
        <td>{d.isActive ? "Active" : "Inactive"}</td>

        <td>
          <input
            value={d.reportManager}
            disabled={mode === "REVIEW"}
            onChange={(e) => updateField(id, "reportManager", e.target.value)}
          />
        </td>

        <td>
          <input
            value={d.esi}
            disabled={mode === "REVIEW"}
            onChange={(e) => updateField(id, "esi", e.target.value)}
          />
        </td>

        <td>
          <input
            value={d.pf}
            disabled={mode === "REVIEW"}
            onChange={(e) => updateField(id, "pf", e.target.value)}
          />
        </td>

        <td>
          <input
            value={d.tax}
            disabled={mode === "REVIEW"}
            onChange={(e) => updateField(id, "tax", e.target.value)}
          />
        </td>

        <td>
          <input
            value={d.incentive}
            disabled={mode === "REVIEW"}
            onChange={(e) => updateField(id, "incentive", e.target.value)}
          />
        </td>

        <td>
          <input
            value={d.allowance}
            disabled={mode === "REVIEW"}
            onChange={(e) => updateField(id, "allowance", e.target.value)}
          />
        </td>

        <td>
          <input
            value={d.bonus}
            disabled={mode === "REVIEW"}
            onChange={(e) => updateField(id, "bonus", e.target.value)}
          />
        </td>

        <td>
          <input
            value={d.basic}
            disabled={mode === "REVIEW"}
            onChange={(e) => updateField(id, "basic", e.target.value)}
          />
        </td>

        <td>
          <input
            value={d.hra}
            disabled={mode === "REVIEW"}
            onChange={(e) => updateField(id, "hra", e.target.value)}
          />
        </td>

        <td>
          <input
            value={d.deduction}
            disabled={mode === "REVIEW"}
            onChange={(e) => updateField(id, "deduction", e.target.value)}
          />
        </td>

        <td>{d.gross}</td>
        <td>{d.net}</td>
        <td>
  <input
    value={d.conveyance}
    disabled={mode === "REVIEW"}
    onChange={(e) => updateField(id, "conveyance", e.target.value)}
  />
</td>

<td>
  <input
    value={d.professionalTax}
    disabled={mode === "REVIEW"}
    onChange={(e) => updateField(id, "professionalTax", e.target.value)}
  />
</td>

<td>
  <input
    value={d.lopDeduction}
    disabled={mode === "REVIEW"}
    onChange={(e) => updateField(id, "lopDeduction", e.target.value)}
  />
</td>

<td>
  <input
    value={d.otherDeduction}
    disabled={mode === "REVIEW"}
    onChange={(e) => updateField(id, "otherDeduction", e.target.value)}
  />
</td>

<td>
  <input
    value={d.workingDays}
    disabled={mode === "REVIEW"}
    onChange={(e) => updateField(id, "workingDays", e.target.value)}
  />
</td>

<td>
  <input
    value={d.paidDays}
    disabled={mode === "REVIEW"}
    onChange={(e) => updateField(id, "paidDays", e.target.value)}
  />
</td>

<td>
  <input
    value={d.lopDays}
    disabled={mode === "REVIEW"}
    onChange={(e) => updateField(id, "lopDays", e.target.value)}
  />
</td>





      </tr>
    );
  })}
</tbody>
        </table>
      </div>
    </div>
  );
};

export default UpdatePayroll;