// InsuranceClaim.jsx
import React, { useState, useContext, useEffect , useRef} from "react";
import { AuthContext } from "../Context/Authcontext";
import "./InsurancClaim.css";
import { createClaim, getClaims } from "../api/insuranceApi"; 



const InsuranceClaim = () => {
  
  const { user } = useContext(AuthContext);

  
  useEffect(() => {
  fetchClaims();
}, []);

useEffect(() => {
  const handleClick = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setActiveFilter(null);
    }
  };
  document.addEventListener("mousedown", handleClick);
  return () => document.removeEventListener("mousedown", handleClick);
}, []);
const fetchClaims = async () => {
  const data = await getClaims();
  setClaims(data);
};
  const isAdmin = user.role === "admin";
  const isManager = user.role === "manager";

  const [showForm, setShowForm] = useState(false);
  
const [activeFilter, setActiveFilter] = useState(null);
const [filterText, setFilterText] = useState("");
const popupRef = useRef();
const getUnique = (key) => [
  ...new Set(claims.map((c) => c[key]))
];

const suggestions =
  activeFilter &&
  getUnique(activeFilter).filter((v) =>
    String(v || "")
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeCode: "",
    relationship: "",
    claimType: "",
   fromDate: "",
    toDate: "",
    admittedDays: "",
    hospitalName: "",
    doctorName: "",
    deliveryType: "",
    surgeryType: "",
    amount: "",
    description: "",
    documents: [],
    otherClaimReason: "",
otherDetails: "",
  });

 const [filters, setFilters] = useState({});


  const [claims, setClaims] = useState([]);

  const handleInput = (e) => {
   if (e.target.name === "documents") {
  setFormData({ ...formData, documents: Array.from(e.target.files) });
}else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const exportToCSV = () => {
  const header = [
    "ID,Name,EmpCode,Type,Date,Days,Amount,Approved,Status"
  ];

  const rows = filteredClaims.map(c =>
    [
      c.id,
      c.employeeName,
      c.employeeCode,
      c.claimType,
      c.fromDate,
      c.admittedDays,
      c.amount,
      c.approvedAmount,
      c.status
    ].join(",")
  );

  const csv = [...header, ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "insurance_claims.csv";
  a.click();
};

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.claimType === "Hospitalization" && !formData.hospitalName) {
    alert("Hospital Name is required");
    return;
  }
  if (formData.claimType === "Maternity" && !formData.deliveryType) {
    alert("Delivery Type is required");
    return;
  }
  if (formData.claimType === "Surgery" && !formData.surgeryType) {
    alert("Surgery Type is required");
    return;
  }
  if (formData.claimType === "Other" && !formData.otherClaimReason) {
  alert("Please enter claim reason");
  return;
}

  try {
    const res = await createClaim({
      ...formData,
      admittedDays: Number(formData.admittedDays || 0),  // ✅ FIX
      amount: Number(formData.amount || 0),              // ✅ FIX
      department: user.department,
      companyId: user.companyId                          // ✅ IMPORTANT
    });

    setClaims([...claims, res]); // ✅ USE BACKEND RESPONSE
    setShowForm(false);

  } catch (err) {
    console.error(err);
    alert("Error saving claim");
  }
};
 const updateStatus = async (id, value) => {
  await updateClaimStatus(id, value);
  fetchClaims();
};

const updateApprovedAmountHandler = async (id, value) => {
  await updateApprovedAmount(id, value);
  fetchClaims();
};

  // ✅ TIMELINE LOGIC
  const getTimeline = (status) => {
    const stages = [
      "Submitted",
      "Manager Approved",
      "HR Approved",
      "Insurance Approved",
      "Settled",
    ];
    const currentIndex = stages.indexOf(status);

    return stages.map((stage, index) => ({
      stage,
      completed: index <= currentIndex,
    }));
  };

 const filteredClaims = claims.filter((claim) => {
  if (isManager && claim.department !== user.department) return false;

  return Object.keys(filters).every((key) => {
    if (!filters[key]) return true;

    return String(claim[key] || "")
      .toLowerCase()
      .includes(filters[key].toLowerCase());
  });
});

  return (
    <div className="insurance-container">
      <h2>Insurance Claim Management</h2>

      {/* ================= DASHBOARD ================= */}
      <div className="claim-dashboard">
        <div className="card total">
          <h4>Total Claims</h4>
          <p>{claims.length}</p>
        </div>

        <div className="card approved">
          <h4>Approved</h4>
          <p>{claims.filter(c => c.status === "Insurance Approved" || c.status === "Settled").length}</p>
        </div>

        <div className="card pending">
          <h4>Pending</h4>
          <p>{claims.filter(c => c.status === "Submitted" || c.status === "Manager Approved").length}</p>
        </div>

        <div className="card rejected">
          <h4>Rejected</h4>
          <p>{claims.filter(c => c.status === "Rejected").length}</p>
        </div>

        <div className="card amount">
          <h4>Total Amount</h4>
          <p>₹{claims.reduce((acc, c) => acc + Number(c.amount || 0), 0)}</p>
        </div>
      </div>
<div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
  <button onClick={exportToCSV} className="export-btn">
    Export CSV
  </button>
</div>
      {/* FILTER */}
      {!showForm && (
  <div className="filter-section">
        <input
          type="text"
          placeholder="Employee Name"
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />

        <input
          type="text"
          placeholder="Department"
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
        />

        <select onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">Status</option>
          <option value="Submitted">Submitted</option>
          <option value="Manager Approved">Manager Approved</option>
          <option value="HR Approved">HR Approved</option>
          <option value="Insurance Approved">Insurance Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Settled">Settled</option>
        </select>

        {isAdmin && (
          <button className="new-claim-btn" onClick={() => setShowForm(!showForm)}>
            + New Claim
          </button>
        )}
      </div>
      )}

      {/* CLAIM FORM */}
      {isAdmin && showForm && (
        <div className="claim-form">
          <h3>Create New Claim</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              
              <input name="employeeName" placeholder="Employee Name *" onChange={handleInput} required />
              <input name="employeeCode" placeholder="Employee Code *" onChange={handleInput} required />
                 <select name="relationship" onChange={handleInput} required>
  <option value="">Relationship *</option>
  <option value="Father">Father</option>
  <option value="Mother">Mother</option>
  <option value="Wife">Wife</option>
  <option value="Husband">Husband</option>
  <option value="Brother">Brother</option>
  <option value="Other">Other</option>
</select>
              <select name="claimType" onChange={handleInput} required>
                <option value="">Select Claim Type</option>
                <option value="Hospitalization">Hospitalization</option>
                <option value="Maternity">Maternity</option>
                <option value="Surgery">Surgery</option>
                <option value="Medical">Medical</option>
                <option value="Accident">Accident</option>
                <option value="Other">Other</option>
              </select>
              
           <div className="date-range">
  <input
    type="date"
    name="fromDate"
    onChange={handleInput}
    required
  />

  <span className="date-separator">to</span>

  <input
    type="date"
    name="toDate"
    onChange={handleInput}
    required
  />
</div>
<input type="number" name="admittedDays" placeholder="No of Admitted Days" onChange={handleInput} />
              <input type="number" name="amount" placeholder="Claim Amount *" onChange={handleInput} required />
            </div>

            {/* Dynamic Fields */}
            {formData.claimType === "Hospitalization" && (
              <div className="form-grid">
                <input name="hospitalName" placeholder="Hospital Name *" onChange={handleInput} required />
                <input name="doctorName" placeholder="Doctor Name *" onChange={handleInput} required />
              </div>
            )}

            {formData.claimType === "Maternity" && (
              <div className="form-grid">
                <select name="deliveryType" onChange={handleInput} required>
                  <option value="">Delivery Type *</option>
                  <option value="Normal">Normal</option>
                  <option value="C-Section">C-Section</option>
                </select>
                <input name="hospitalName" placeholder="Hospital Name *" onChange={handleInput} required />
              </div>
            )}

            {formData.claimType === "Surgery" && (
              <div className="form-grid">
                <input name="surgeryType" placeholder="Surgery Type *" onChange={handleInput} required />
                <input name="hospitalName" placeholder="Hospital Name *" onChange={handleInput} required />
              </div>
            )}

            {formData.claimType === "Medical" && (
              <div className="form-grid">
                <input name="doctorName" placeholder="Doctor Name *" onChange={handleInput} required />
              </div>
            )}

            {formData.claimType === "Other" && (
  <div className="form-grid">
    <input
      name="otherClaimReason"
      placeholder="Enter Claim Reason *"
      onChange={handleInput}
      required
    />

    <input
      name="otherDetails"
      placeholder="Additional Details"
      onChange={handleInput}
    />
  </div>
)}

            <textarea name="description" placeholder="Description" onChange={handleInput}></textarea>
            <input type="file" name="documents" multiple onChange={handleInput} />

{formData.documents.length > 0 && (
  <ul>
    {formData.documents.map((file, index) => (
      <li key={index}>{file.name}</li>
    ))}
  </ul>
)}
            <button type="submit" className="submit-btn">
              Submit Claim
            </button>

             <button
    type="button"
    className="cancel-btn"
    onClick={() => setShowForm(false)}
  >
    Close
  </button>
          </form>
        </div>
      )}

      {/* TABLE */}
      <table className="claim-table">
<thead>
  <tr>
    {[
      { label: "Employee ID", key: "id" },
      { label: "Employee Name", key: "employeeName" },
      { label: "Emp Code", key: "employeeCode" },
      { label: "Claim Type", key: "claimType" },
      { label: "Claim Raised Date", key: "fromDate" },
      { label: "Admitted Days", key: "admittedDays" },
      { label: "Claim Amount", key: "amount" },
      { label: "Approved Amount", key: "approvedAmount" },
      { label: "Status", key: "status" }
    ].map(col => (
      <th key={col.key} style={{ position: "relative" }}>
        <div
          onClick={() => {
            setActiveFilter(col.key);
            setFilterText("");
          }}
          style={{ cursor: "pointer" }}
        >
          {col.label} ⏷
        </div>

        {/* FILTER POPUP */}
        {activeFilter === col.key && (
          <div className="filter-popup" ref={popupRef}>
            <input
              type="text"
              placeholder="Search..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />

            <div className="filter-list">
              {suggestions.map((val, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setFilters({
                      ...filters,
                      [col.key]: val
                    });
                    setActiveFilter(null);
                  }}
                >
                  {val || "Empty"}
                </div>
              ))}
            </div>
          </div>
        )}
      </th>
    ))}

    {(isAdmin || isManager) && <th>Actions</th>}
  </tr>
</thead>

        <tbody>
          {filteredClaims.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.employeeName}</td>
              <td>{c.employeeCode}</td>
              <td>{c.claimType}</td>
              <td>{c.fromDate || c.incidentDate}</td>
              <td>{c.admittedDays}</td>
              <td>₹{c.amount}</td>

              <td>
                {(isAdmin || isManager) ? (
                 <input
  type="number"
  value={c.approvedAmount}
  onChange={(e) => updateApprovedAmount(c.id, e.target.value)}
  style={{ border: "none", background: "transparent", width: "80px", textAlign: "center" }}
/>
                ) : c.approvedAmount}
              </td>

             <td className="status">
  {c.status?.replaceAll("_", " ")}
</td>

             

              {(isAdmin || isManager) && (
                <td>
                  <select value={c.status} onChange={(e) => updateStatus(c.id, e.target.value)}>
                    <option value="Submitted">Submitted</option>
                    <option value="Manager Approved">Manager Approved</option>
                    <option value="HR Approved">HR Approved</option>
                    <option value="Insurance Approved">Insurance Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Settled">Settled</option>
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InsuranceClaim;