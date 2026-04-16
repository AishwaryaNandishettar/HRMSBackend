import React, { useEffect, useState } from "react";
import { useNavigate, useParams , useLocation} from "react-router-dom";
import "./ATSTable.css";
import { getAllJobs } from "../../api/recruitmentApi";

export default function ATSTable() {
    const navigate = useNavigate();

    const location = useLocation();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [showExport, setShowExport] = useState(false);

    const PAGE_SIZE = 15;
    const { type } = useParams();

    const exportData = (type) => {
        if (!jobs.length) return alert("No data");

        const headers = config.columns
            .filter(c => c.key !== "actions")
            .map(c => c.label);

        const keys = config.columns
            .filter(c => c.key !== "actions")
            .map(c => c.key);

        const body = jobs.map(r =>
            keys.map(k => `"${String(r[k] ?? "").replace(/"/g, '""')}"`)
        );

        const content = [
            headers.join(","),
            ...body.map(r => r.join(","))
        ].join("\n");

        const blob = new Blob([content], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${config.title}.${type === "excel" ? "xls" : type}`;
        link.click();
        };

        const columns = [
  { key: "jobTitle", label: "Job Title" },
  { key: "department", label: "Department" },
  { key: "designation", label: "Designation" },
  { key: "ctc", label: "CTC" },
  { key: "postedDate", label: "Posted Date" },
  { key: "status", label: "Status", type: "badge" },
  { key: "description", label: "Description" }
];
    /* =========================
       FETCH DATA (BACKEND)
    ========================== */

  

const fetchJobs = async () => {
  try {
    const stateJobs = location.state?.jobs;

    const stage = location.state?.stage;

    // ✅ NEW SAFE PRIORITY
    if (Array.isArray(stateJobs) && stateJobs.length > 0) {
      setJobs(stateJobs);
      return;
    }

    const res = await getAllJobs();
    let data = Array.isArray(res) ? res : [];

    if (stage) {
      const normalized = stage.toLowerCase();

      data = data.filter(job => {
        const status = (job.status || "").toLowerCase();

        if (normalized === "selected") return status === "selected";
        if (normalized === "shortlisted") return status === "shortlisted";
        if (normalized === "interview stage") return status.includes("interview");

        return status.includes(normalized);
      });
    }

    setJobs(data);

  } catch (err) {
    console.error("Failed to fetch jobs", err);
    setJobs([]);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  fetchJobs();
}, [location.state, type]);



   

  const sourceData =
  Array.isArray(location.state?.jobs) && location.state.jobs.length > 0
    ? location.state.jobs
    : jobs;

const filteredData = sourceData.filter(row =>
        Object.values(row).some(v =>
            String(v).toLowerCase().includes(search.toLowerCase())
        )
    );

    const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

    const paginatedData = filteredData.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    /* =========================
       UI
    ========================== */

    return (
        <div className="ats-wrapper">
            <div className="ats-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Back
                </button>
               <h2>
  {type === "interview-scheduled"
    ? "Interview Scheduled"
    : type === "positions-filled"
    ? "Positions Filled"
    : type === "new-applications"
    ? "New Applicants"
    : "Open Positions"}
</h2>
            </div>

            <div className="ats-toolbar">
                <input
                    type="text"
                    className="ats-search"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                    }}
                />

                <div className="export-wrapper">
                    <button
                        className="export-btn"
                        onClick={() => setShowExport(true)}
                    >
                        ⬇ Export
                    </button>
                </div>
                
                {showExport && (
                <div
                    className="export-overlay"
                    onClick={() => setShowExport(false)}
                >
                    <div
                    className="export-modal"
                    onClick={(e) => e.stopPropagation()}
                    >
                    <h3>Export Format</h3>

                    <button onClick={() => exportData("csv")}>CSV</button>
                    <button onClick={() => exportData("excel")}>Excel</button>
                    <button onClick={() => exportData("txt")}>
                        Notepad (TXT)
                    </button>

                    <button
                        className="cancel-btn"
                        onClick={() => setShowExport(false)}
                    >
                        Cancel
                    </button>
                    </div>
                </div>
                )}

            </div> 
            {filteredData.length === 0 ? (
                <p>No Matching Records Found</p>
            ) : (
                <table className="ats-table">
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th key={col.key}>{col.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
{paginatedData.map((row, i) => (
  <tr key={i}>
    {columns.map(col => (
      <td key={col.key}>
       {col.key === "description" ? (
  <button onClick={() => setViewJob(row)}>
    View
  </button>
) : col.type === "badge" ? (
  <span className={`badge ${row[col.key]?.toLowerCase()}`}>
    {row[col.key]}
  </span>
) : (
  row[col.key] ?? "-"
)}
      </td>
    ))}
  </tr>
))}
                    </tbody>
                </table>
            )}
            {totalPages > 1 && (
            <div className="pagination">
                <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                >
                Prev
                </button>
                <span>
                Page {page} of {totalPages}
                </span>

                <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                >
                Next
                </button>
            </div>
            )}
            
        </div>
    );
}
