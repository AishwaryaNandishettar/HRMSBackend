// src/Pages/BGV.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import "./BGV.css";

// In-memory + localStorage backed storage
let bgvRecords = [];

// load from localStorage on import time if available
try {
  const raw = localStorage.getItem("bgv_records");
  if (raw) bgvRecords = JSON.parse(raw);
} catch (e) {
  bgvRecords = [];
}

// exported function used by Onboarding.jsx
export function addBGVRecord(record) {
  const rec = {
    ...record,
    _id: Date.now() + Math.floor(Math.random() * 999),
  };
  bgvRecords.push(rec);
  // persist
  try {
    localStorage.setItem("bgv_records", JSON.stringify(bgvRecords));
  } catch (e) {
    console.warn("Could not save BGV record to localStorage", e);
  }
}

// update helper
function saveAll(records) {
  bgvRecords = records;
  try {
    localStorage.setItem("bgv_records", JSON.stringify(bgvRecords));
  } catch (e) {
    console.warn("Could not persist BGV records", e);
  }
}

export default function BGV() {
  
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("");
  const [cibilMin, setCibilMin] = useState("");
  const [cibilMax, setCibilMax] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate(); // ✅ ADD THIS

 useEffect(() => {
  const loadData = () => {
    try {
      const data = JSON.parse(localStorage.getItem("bgv_records")) || [];
       console.log("Loaded BGV:", data);
      bgvRecords = data;
      setRecords([...data].reverse());
    } catch (e) {
      console.error("Error loading BGV records", e);
      setRecords([]);
    }
  };

  loadData(); // ✅ load on mount
 

  // ✅ also listen for changes
  const onStorage = (ev) => {
    if (ev.key === "bgv_records") {
      loadData();
    }
  };

  window.addEventListener("storage", onStorage);

  return () => window.removeEventListener("storage", onStorage);
}, []);

  const applyFilters = () => {
    return records.filter((r) => {
      const lower = (s) => (s || "").toString().toLowerCase();
      const matchesSearch =
        !search ||
        lower(r.fullName).includes(lower(search)) ||
        lower(r.email).includes(lower(search)) ||
        lower(r.employeeId).includes(lower(search));
      const matchesStatus = statusFilter === "All" || (r.bgvStatus || "Pending") === statusFilter;
      const matchesDept = !deptFilter || r.department === deptFilter;
      const score = Number(r.cibilScore || 0);
      const minOK = !cibilMin || score >= Number(cibilMin);
      const maxOK = !cibilMax || score <= Number(cibilMax);
      return matchesSearch && matchesStatus && matchesDept && minOK && maxOK;
    });
  };

  const filtered = applyFilters();

  const toggleExpand = (id) => setExpandedId((cur) => (cur === id ? null : id));

  const updateStatus = (id, newStatus) => {
    const next = [...bgvRecords];
    const idx = next.findIndex((x) => x._id === id);
    if (idx === -1) return;
    next[idx].bgvStatus = newStatus;
    saveAll(next);
    setRecords([...next].reverse());
  };

  const exportCSV = () => {
    if (!records.length) return alert("No records to export");
    const header = ["Full Name","Employee ID","Email","Phone","Department","BGV Status","CIBIL Score","Police Status","Submitted At"];
    const rows = records.map((r) => [
      r.fullName || "",
      r.employeeId || "",
      r.email || "",
      r.phone || "",
      r.department || "",
      r.bgvStatus || "Pending",
      r.cibilScore || "",
      r.policeStatus || "",
      r.submittedAt || "",
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/\"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bgv_records.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bgv-root">
     <div className="bgv-header">
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <h2>BGV Dashboard</h2>

    {/* ✅ NEW CLAIM BUTTON */}
    <button onClick={() => navigate("/onboarding")}>
  + New Onboarding
</button>
  </div>

  <div className="bgv-tools">
          <input placeholder="Search name / email / emp id..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="">All Departments</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
            <option value="Operations">Operations</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Clear">Clear</option>
            <option value="Issue Found">Issue Found</option>
          </select>

          <input placeholder="CIBIL min" type="number" value={cibilMin} onChange={(e) => setCibilMin(e.target.value)} />
          <input placeholder="CIBIL max" type="number" value={cibilMax} onChange={(e) => setCibilMax(e.target.value)} />

          <button className="export-btn" onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

     <div className="bgv-list">

  {filtered.length === 0 ? (
    <div className="empty">No records found</div>
  ) : (
    <>
      {/* ✅ TABLE VIEW */}
      <table className="bgv-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Employee ID</th>
            <th>Department</th>
            <th>Status</th>
            <th>Action</th> {/* ✅ NEW */}
          </tr>
        </thead>

       <tbody>
  {filtered.map((r) => (
    <React.Fragment key={r._id}>
      
      {/* MAIN ROW */}
      <tr>
        <td>{r.fullName}</td>
        <td>{r.email}</td>
        <td>{r.employeeId}</td>
        <td>{r.department}</td>
        <td>{r.bgvStatus || "Pending"}</td>

        <td>
          <button onClick={() => toggleExpand(r._id)}>
            {expandedId === r._id ? "Hide" : "View More"}
          </button>
        </td>
      </tr>

      {/* ✅ EXPAND ROW */}
      {expandedId === r._id && (
        <tr>
          <td colSpan="6">
            <div className="card-details">
              <div><strong>Phone:</strong> {r.phone}</div>
              <div><strong>Designation:</strong> {r.designation}</div>
              <div><strong>CIBIL:</strong> {r.cibilScore}</div>
              <div><strong>Police:</strong> {r.policeStatus}</div>
            </div>
          </td>
        </tr>
      )}

    </React.Fragment>
  ))}
</tbody>
      </table>

      {/* ✅ EXISTING CARDS (UNCHANGED) */}
      {filtered.map((r) => (
        <div className="bgv-card" key={r._id}>
          <div className="card-main">
            <div className="card-left">
              <div className="photo">
                {r.documents?.photo ? (
                  <img src={r.documents.photo} alt="profile" />
                ) : (
                  <div className="no-photo">No Photo</div>
                )}
              </div>

              <div className="info">
                <div className="name">{r.fullName}</div>
                <div className="meta">
                  {r.designation || ""}{" "}
                  {r.department ? `• ${r.department}` : ""}
                </div>
                <div className="submeta">
                  {r.email} {r.phone ? `• ${r.phone}` : ""}
                </div>
              </div>
            </div>

            <div className="card-middle">
              <div>
                <strong>Experience:</strong>{" "}
                {r.experience?.length
                  ? `${r.experience.length} entries`
                  : "—"}
              </div>
              <div>
                <strong>CIBIL:</strong> {r.cibilScore || "—"}{" "}
                {r.cibilRemarks ? `• ${r.cibilRemarks}` : ""}
              </div>
              <div>
                <strong>Police:</strong> {r.policeStatus || "—"}{" "}
                {r.policeVerificationNumber
                  ? `• Ref:${r.policeVerificationNumber}`
                  : ""}
              </div>
            </div>

            <div className="card-right">
              <div
                className={`status-pill ${String(
                  r.bgvStatus || "Pending"
                ).replace(/\s+/g, "-")}`}
              >
                {r.bgvStatus || "Pending"}
              </div>

              <div className="submitted">
                {r.submittedAt
                  ? new Date(r.submittedAt).toLocaleString()
                  : ""}
              </div>

              <select
                defaultValue={r.bgvStatus || "Pending"}
                onChange={(e) =>
                  updateStatus(r._id, e.target.value)
                }
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Clear</option>
                <option>Issue Found</option>
              </select>

              <button
                className="view-btn"
                onClick={() => toggleExpand(r._id)}
              >
                {expandedId === r._id ? "Hide" : "View Details"}
              </button>
            </div>
          </div>

          {expandedId === r._id && (
            <div className="card-details">
              <section>
                <h4>Personal</h4>
                <div><strong>Address:</strong> {r.address || "-"}</div>
                <div><strong>DOB:</strong> {r.dob || "-"}</div>
                <div><strong>Blood Group:</strong> {r.bloodGroup || "-"}</div>
                <div>
                  <strong>Emergency:</strong> {r.emergencyContactName || "-"}{" "}
                  {r.emergencyContactPhone
                    ? `(${r.emergencyContactPhone})`
                    : ""}
                </div>
              </section>

              <section>
                <h4>Job</h4>
                <div><strong>Dept:</strong> {r.department || "-"}</div>
                <div><strong>Designation:</strong> {r.designation || "-"}</div>
                <div><strong>Employee ID:</strong> {r.employeeId || "-"}</div>
                <div><strong>Joining:</strong> {r.joiningDate || "-"}</div>
                <div><strong>Last CTC:</strong> {r.lastCTC || "-"}</div>
                <div><strong>Reason for Leaving:</strong> {r.reasonForLeaving || "-"}</div>
              </section>

              <section>
                <h4>Experience</h4>
                {r.experience?.length ? (
                  r.experience.map((ex, i) => (
                    <div className="exp-row" key={i}>
                      <div><strong>{ex.company}</strong> — {ex.designation}</div>
                      <div>Manager: {ex.managerName}</div>
                      <div>Feedback: {ex.managerFeedback}</div>
                    </div>
                  ))
                ) : (
                  <div>No experience</div>
                )}
              </section>

              <section>
                <h4>Documents</h4>
                <div><strong>Resume:</strong> {r.documents?.resume || "N/A"}</div>
                <div><strong>Aadhaar:</strong> {r.documents?.aadharFile || "N/A"}</div>
                <div><strong>PAN:</strong> {r.documents?.panFile || "N/A"}</div>
              </section>
            </div>
          )}
        </div>
      ))}
    </>
  )}

</div>
    </div>
  );
}
