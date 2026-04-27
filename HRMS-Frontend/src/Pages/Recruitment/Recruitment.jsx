import "./Recruitment.css";
import PipelineTable from "./PipelineTable";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Context/Authcontext";
import { createJob, getAllJobs , updateJobStatus} from "../../api/recruitmentApi"; // adjust path
import { Eye } from "lucide-react";
import {
  Briefcase,
  Users,
  CheckCircle,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";


/* ===== Reusable Components ===== */

const StatCard = ({ title, value, variant, icon, onClick }) => {
  return (
    <button className={`stat-card ${variant}`} onClick={onClick}>
      <div className="stat-left">
        <div className="stat-value">{title}</div>
        <div className="stat-title">{value}</div>
      </div>

      <div className="stat-icon">
        {icon}
      </div>
    </button>
  );
};

const StatusBadge = ({ type, children }) => (
  <span className={`badge ${type}`}>{children}</span>
);

const FilterDropdown = ({ values, onSelect, onClose }) => {
  return (
    <div className="filter-dropdown">
      {values.map((v) => (
        <div
          key={v}
          className="filter-option"
          onClick={() => {
            onSelect(v);
            onClose();
          }}
        >
          {v}
        </div>
      ))}
    </div>
  );
};

const JobTable = ({ jobs , setJobs}) => {
  const [search, setSearch] = useState("");
  
  const [openFilter, setOpenFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [viewJob, setViewJob] = useState(null);
const [showPostJob, setShowPostJob] = useState(false);
 
const [formData, setFormData] = useState({
  jobTitle: "",
  department: "",
  designation: "",
  ctc: "",
  applicants: "",
  status: "Open",
  postedDate: "",
  description: ""
});


const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await createJob({
      ...formData,
      applicants: Number(formData.applicants)
    });

    // ✅ Update UI with saved data
     setJobs(prev => [...prev, res?.data || res]);

    setShowPostJob(false);

     setFormData({
      jobTitle: "",
      department: "",
      designation: "",
      ctc: "",
      applicants: "",
      status: "Open",
      postedDate: "",
      description: ""
    });

  } catch (err) {
    console.error("Error saving job", err);
  }
};
 
  


 

  

 


  const uniqueTitles = [
    "All",
    ...Array.from(new Set(jobs.map(job => job.jobTitle)))
  ];

  const uniqueDates = [
    "All",
    ...Array.from(new Set(jobs.map(job => job.postedDate)))
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      `${job.jobTitle} ${job.department} ${job.status} ${job.postedDate}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || job.status === statusFilter;

    const matchesDept =
      deptFilter === "All" || job.department === deptFilter;

    const matchesDate =
      dateFilter === "All" || job.postedDate === dateFilter;

    return matchesSearch && matchesStatus && matchesDept && matchesDate;
  });

  return (
    <div className="table-section" >
      {/* ===== Search & Filters ===== */}
      <div className="table-toolbar">

        {/* TOP ROW */}
        <div className="toolbar-top">
          <div className="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" stroke="#64748b" strokeWidth="2" fill="none" />
              <line x1="16.65" y1="16.65" x2="22" y2="22" stroke="#64748b" strokeWidth="2" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* <div className="status-tabs">
            {["All", "Open", "Closed"].map(s => (
              <button
                key={s}
                className={`tab ${statusFilter === s ? "active" : ""}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div> */}

          <div className="sort">
            <button className="sort-btn"> ⇅ Recent ▾</button>
          </div>
        <button className="post-btn" onClick={() => setShowPostJob(true)}>
  + Post Job
</button>
        </div>

        {/* BOTTOM ROW */}
        {/* <div className="toolbar-bottom">
          <div>
            <button
              className={`chip ${deptFilter === "All" ? "active" : ""}`}
              onClick={() => setDeptFilter("All")}
            >
              All
            </button>
            <button
              className={`chip ${deptFilter === "IT" ? "active" : ""}`}
              onClick={() => setDeptFilter("IT")}
            >
              IT
            </button>
            <button
              className={`chip ${deptFilter === "Sales" ? "active" : ""}`}
              onClick={() => setDeptFilter("Sales")}
            >
              Sales
            </button>
            <button
              className={`chip ${deptFilter === "HR" ? "active" : ""}`}
              onClick={() => setDeptFilter("HR")}
            >
              HR
            </button>
          </div>

          <div className="right-icons">
            <button className="icon-btn">≡</button>
            <button className="icon-btn">☰</button>
          </div>
        </div> */}
      </div>

      {/* ===== TABLE ===== */}
      <div className="table-wrapper">
        <table className="job-table">
          <thead>
            <tr>
              <th> 
                <div className="th-wrap">
                  <span
                    className="filter-icon"
                    onClick={() =>
                      setOpenFilter(openFilter === "title" ? null : "title")
                    }
                  >
                     Job Domain ⌵
                  </span>
                  {openFilter === "title" && (
                    <FilterDropdown
                      values={uniqueTitles}
                      onSelect={(v) => setSearch(v === "All" ? "" : v)}
                      onClose={() => setOpenFilter(null)}
                    />
                  )}
                </div>
              </th>

              <th>
                <div className="th-wrap">
                  <span
                    className="filter-icon"
                    onClick={() =>
                      setOpenFilter(openFilter === "department" ? null : "department")
                    }
                  >
                    Dept 
                  </span>

                  {openFilter === "Dept" && (
                    <FilterDropdown
                      values={["All", "IT", "Sales", "HR", "Marketing"]}
                      onSelect={setDeptFilter}
                      onClose={() => setOpenFilter(null)}
                    />
                  )}
                </div>
              </th>
               <th>HR Action</th>
             

              <th>Applicants</th>
             <th>Posted</th>

              <th>Designation</th>
<th>CTC</th>
  <th>
                <div className="th-wrap">
                  <span
                    className="filter-icon"
                    onClick={() =>
                      setOpenFilter(openFilter === "status" ? null : "status")
                    }
                  >
                    Status ⌵
                  </span>

                  {openFilter === "status" && (
                    <FilterDropdown
                      values={[
                        "All",
                        "Open",
                        "Closed",
                        "Interview Stage",
                        "Reviewing Applications",
                      ]}
                      onSelect={setStatusFilter}
                      onClose={() => setOpenFilter(null)}
                    />
                  )}
                </div>
              </th>
              
<th>Job Description</th>
            </tr>
          </thead>


          <tbody>
            {filteredJobs.map((job, i) => {
              const badgeType =
                job.status === "Open" ? "open" :
                job.status === "Closed" ? "closed" :
                job.status.includes("Interview") ? "interview" :
                job.status.includes("Review") ? "review" :
                "open";

              return (
                <tr key={i}>
                 <td>{job.jobTitle}</td>
                  <td>{job.department}</td>

                   {/* STATUS (DISPLAY ONLY) */}
                   {/* STATUS (NOW DROPDOWN) */}
<td>
  <select
    value={job.status}
  onChange={async (e) => {
  const newStatus = e.target.value;

  const jobId = job._id || job.id;

  setJobs(prev =>
    prev.map(j =>
      (j._id || j.id) === jobId
        ? { ...j, status: newStatus }
        : j
    )
  );

  try {
    await updateJobStatus(jobId, newStatus);
  } catch (err) {
    console.error("Status update failed", err);
  }
}}
  >
    <option value="Seaching">Searching Profile</option>
    <option value="Open">Open</option>
    <option value="Closed">Closed</option>
    <option value="Interview Stage">Interview Stage</option>
    <option value="Shortlisted">Shortlisted</option>
    <option value="Rejected">Rejected</option>
    <option value="Selected">Selected</option>
  </select>
</td>

                  <td>{job.applicants}</td>
                  
                   {/* Posted Date ✅ */}
      <td>{job.postedDate || "-"}</td>
                  <td>{job.designation || "-"}</td>
                <td>{job.ctc || "-"}</td>

                <td>{job.status}</td> 
                
{/* JOB DESCRIPTION */}
<td>
  <button
    className="icon-btn"
    onClick={() => setViewJob(job)}
    title="View Description"
  >
    <Eye size={18} />
  </button>
</td>


                </tr>
              );
            })}
          </tbody>

        </table>
         
        
        {viewJob && (
  <div className="modal">
    <div className="modal-content">
     <h2>{viewJob.jobTitle}</h2>

<p><b>Designation:</b> {viewJob.designation}</p>
<p><b>Department:</b> {viewJob.department}</p>
<p><b>CTC:</b> {viewJob.ctc}</p>

<p><b>Description:</b></p>
<p>{viewJob.description || "No description available"}</p>

      <button onClick={() => setViewJob(null)}>
        Close
      </button>
    </div>
  </div>
)}


{showPostJob && (
  <div className="modal-overlay">
    <div className="modal-content">

      <h2>Post Job</h2>

     <form className="job-form" onSubmit={handleSubmit}>

     <input
  name="jobTitle"
  value={formData.jobTitle}
  onChange={handleChange}
  placeholder="Job Title"
/>

<input
  name="department"
  value={formData.department}
  onChange={handleChange}
  placeholder="Department"
/>

<input
  name="designation"
  value={formData.designation}
  onChange={handleChange}
  placeholder="Designation"
/>

<input
  name="ctc"
  value={formData.ctc}
  onChange={handleChange}
  placeholder="CTC"
/>

<input
  name="applicants"
  value={formData.applicants}
  onChange={handleChange}
  placeholder="Applicants"
/>

<select name="status" value={formData.status} onChange={handleChange}>
  <option>Open</option>
  <option>Closed</option>
  <option>Interview Stage</option>
  <option>Reviewing Applications</option>
</select>

<input
  name="postedDate"
  value={formData.postedDate}
  onChange={handleChange}
  placeholder="Posted Date"
/>

<textarea
  name="description"
  value={formData.description}
  onChange={handleChange}
  placeholder="Job Description"
/>

        <div className="modal-actions">
          <button type="button" onClick={() => setShowPostJob(false)}>
            Cancel
          </button>

          <button type="submit">
            Save
          </button>
        </div>

      </form>
      
    </div>
  </div>
)}
      </div>

      
      {/* <div style={{ textAlign: "right", marginTop: "12px" }}>
        <button
          className="post-btn"
          style={{ height: "36px", fontSize: "13px" }}
          onClick={() => window.location.href = "/recruitment/ats/open-positions"}
        >
          More →
        </button>
      </div> */}
      {selectedCandidate && (
  <div className="modal-overlay">
    <div className="modal-content">

      <h2>Candidate Details</h2>

      <p><b>Name:</b> {selectedCandidate.name || "N/A"}</p>
      <p><b>Job Title:</b> {selectedCandidate.jobTitle || "N/A"}</p>
      <p><b>Department:</b> {selectedCandidate.department || "N/A"}</p>
      <p><b>Designation:</b> {selectedCandidate.designation || "N/A"}</p>
      <p><b>Status:</b> {selectedCandidate.status || "N/A"}</p>

      <hr />

      <p><b>Current Stage Meaning:</b></p>
      <p>
        {selectedCandidate.status === "Shortlisted" &&
          "Candidate has passed initial screening and is shortlisted for next round."}

        {selectedCandidate.status === "Interview Stage" &&
          "Candidate is scheduled or undergoing interview process."}

        {selectedCandidate.status === "Selected" &&
          "Candidate has been selected for offer."}

        {!selectedCandidate.status &&
          "Candidate is under review."}
      </p>

      <div className="modal-actions">
        <button onClick={() => setSelectedCandidate(null)}>
          Close
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
};

const CandidatePipeline = ({
  appliedCount,
  shortlistedCount,
  interviewCount,
  rejectedCount,
  selectedCount,
  jobs
}) => {
  const navigate = useNavigate();
  return (
    <aside className="pipeline-card">
      <h3>Candidate Pipeline</h3>

      {/* Funnel */}
      <div className="funnel-wrapper">
        <button className="funnel-shape stage-1 blue" onClick={() => navigate("/recruitment/pipeline", { state: { stage: "Applied",jobs:jobs } })}>
          <span> Received Applications </span>
           <strong>{appliedCount}</strong>
        </button>

        <button className="funnel-shape stage-2 yellow" onClick={() => navigate("/recruitment/pipeline", { state: { stage: "Shortlisted",jobs: jobs.filter(j => j.status === "Shortlisted")} })}>
          <span> Shortlisted </span>
          <strong>{shortlistedCount}</strong>
        </button>

        <button className="funnel-shape stage-3 orange" onClick={() => navigate("/recruitment/pipeline", { state: { stage: "Interview Stage",jobs: jobs.filter(j => j.status === "Interview Stage")
 } })}>
          <span>Interview Stage </span>
          <strong>{interviewCount}</strong>
        </button>

        <button className="funnel-shape stage-4 red" onClick={() => navigate("/recruitment/pipeline", { state: { stage: "Rejected",jobs: jobs.filter(j => j.status === "Rejected") }})}>
          <span>Rejected </span>
          <strong>{rejectedCount}</strong>
        </button>

        <button className="funnel-shape stage-5 green" onClick={() => navigate("/recruitment/pipeline", { state: { stage: "Selected" ,jobs: jobs.filter(j => j.status === "Selected")
} })}>
          <span>Selected </span>
          <strong>{selectedCount}</strong>
        </button>

      </div>

      {/* Recent Candidates */}
<div className="recent">
  <h4>Recent Candidates</h4>

  {(Array.isArray(jobs) ? jobs : [])
    .slice(0, 5)
    .map((c, i) => (
      <div className="candidate" key={c._id || c.id || i}>
        <img
          src={
            c.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              c.name || c.jobTitle || "User"
            )}`
          }
          alt=""
        />

        <div>
          <strong>{c.name || c.jobTitle || "Unknown"}</strong>
          <span>{c.designation || c.department || "No Role"}</span>
        </div>

        <button
  className="action blue"
  onClick={() => setSelectedCandidate(c)}
>
  {c.status === "Interview Stage"
    ? "Interview"
    : c.status === "Selected"
    ? "Offer"
    : c.status === "Shortlisted"
    ? "Screen"
    : "Review"}
</button>
      </div>
    ))}
</div>
    </aside>
  );
};

/* ===== Hiring Analytics Block ===== */

const HiringAnalytics = ({
  jobs = [],
  appliedCount = 0,
  shortlistedCount = 0,
  interviewCount = 0,
  rejectedCount = 0,
  selectedCount = 0
}) => {
  const total = appliedCount || 1; // avoid divide by 0

// Candidate % (Pipeline based)
const appliedPct = Math.round((appliedCount / total) * 100);
const interviewPct = Math.round((interviewCount / total) * 100);
const hiredPct = Math.round((selectedCount / total) * 100);

// Department split (from table data)
const deptMap = {};

jobs.forEach(j => {
  if (!j.department) return;
  deptMap[j.department] = (deptMap[j.department] || 0) + 1;
});

const deptEntries = Object.entries(deptMap);
  return (
    <section className="hiring-analytics">
      {/* LEFT CARD */}
      <div className="analytics-card">
        <h3>Hiring Analytics</h3>

        <div className="analytics-row">
          {/* Candidates Overview */}
          <div className="donut-block">
            <h4>Candidates Overview</h4>

            <div className="donut">
              <div className="donut-center">
                <strong>{appliedPct}%</strong>
              </div>
            </div>

            <div className="legend">
             <span className="dot blue" /> Applied ({appliedPct}%)
<span className="dot orange" /> Interviewing ({interviewPct}%)
<span className="dot green" /> Hired ({hiredPct}%)
            </div>
          </div>

          {/* Hires by Department */}
          <div className="donut-block">
            <h4>Hires by Department</h4>

            <div className="donut small">
              <div className="donut-center">
             <strong>{deptEntries.length}/{jobs.length}</strong>
<small>
  {jobs.length
    ? Math.round((deptEntries.length / jobs.length) * 100)
    : 0}%
</small>
              </div>
            </div>

            <div className="legend">
              <span className="dot blue" /> IT
              <span className="dot orange" /> Sales
              <span className="dot lightblue" /> Marketing
              <span className="dot green" /> HR
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT CARD */}
      <div className="analytics-card side">
        <h3>Hiring Analytics</h3>

        <div className="side-row">
          <div>
            <h4>Candidates Overview</h4>
            <ul>
             <li><span className="dot blue" /> Applied <b>{appliedPct}%</b></li>
             <li><span className="dot orange" /> Interviewing <b>{interviewPct}%</b></li>
<li><span className="dot green" /> Hired <b>{hiredPct}%</b></li>
            </ul>
          </div>

          <div>
            <h4>Hires by Department</h4>
            <ul>
             {deptEntries.map(([dept, count], i) => (
  <li key={i}>
    <span className="dot blue" /> {dept} <b>{count}/{jobs.length}</b>
  </li>
))}
              <li><span className="dot orange" /> Sales <b>4/8</b></li>
              <li><span className="dot lightblue" /> Marketing <b>2/8</b></li>
              <li><span className="dot green" /> HR <b>1/8</b></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ===== Main Dashboard ===== */

export default function RecruitmentDashboard() {
  const navigate = useNavigate();
const { user } = useContext(AuthContext);

if (user?.role === "EMP") {
  return null; // ❌ hides entire page for employee
}
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
  const fetchJobs = async () => {
    try {
      const res = await getAllJobs();
      setJobs(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to load jobs", err);
      setJobs([]);
    }
  };

  fetchJobs();
}, []);
  // 👇 ADD HERE (THIS IS THE RIGHT PLACE)
  const appliedCount = jobs.length;

  const shortlistedCount = jobs.filter(
    j => j.status === "Shortlisted"
  ).length;

  const interviewCount = jobs.filter(
    j => j.status === "Interview Stage"
  ).length;
   const rejectedCount = jobs.filter(
    j => j.status === "Rejected"
  ).length;

  const selectedCount = jobs.filter(
    j => j.status === "Selected"
  ).length;
const openJobs = jobs.filter(j => j.status === "Open");
const newApplicants = jobs.filter(j => (j.applicants ?? 0) > 0);
const filledJobsCount = jobs.filter(j =>
  ["Selected", "Shortlisted"].includes(j.status)
).length;
const interviewJobs = jobs.filter(j => j.status === "Interview Stage");
  return (
    <div className="dashboard">
      <header className="header">
        <div>
          <h1>Recruitment Dashboard</h1>
          <p>Track and manage job openings, candidate pipelines, and hiring progress.</p>
        </div>
      </header>

    <section className="stats">
      <StatCard
  title="Open Positions"
  value={openJobs.length}   // ✅ dynamic count
  variant="blue"
  icon={<Briefcase className="stat-svg" />}
  onClick={() =>
    navigate('/recruitment/ats/open-positions', {
      state: { jobs: openJobs }   // ✅ PASS DATA
    })
  }
/>

      <StatCard
  title="New Applicants"
  value={newApplicants.length}
  variant="red"
  onClick={() =>
    navigate('/recruitment/ats/new-applications', {
      state: { jobs: newApplicants }
    })
  }
/>

<StatCard
  title="Positions Filled"
  value={filledJobsCount}
  variant="green"
  onClick={() =>
    navigate('/recruitment/ats/positions-filled', {
      state: {
  jobs: jobs.filter(j =>
    ["Selected", "Shortlisted"].includes(j.status)
  ),
  title: "Positions Filled (Selected + Shortlisted)"
}

    })
  }
/>

<StatCard
  title="Interview Scheduled"
  value={interviewJobs.length}
  variant="light"
  onClick={() =>
    navigate('/recruitment/ats/interview-scheduled', {
      state: { stage: "Interview Stage" }
    })
  }
/>
    </section>


      <section className="content">
      <JobTable jobs={jobs} setJobs={setJobs} />
      <CandidatePipeline
  appliedCount={appliedCount}
  shortlistedCount={shortlistedCount}
  interviewCount={interviewCount}
  rejectedCount={rejectedCount}
  selectedCount={selectedCount}
  jobs={jobs}

/>
        <HiringAnalytics
  jobs={jobs}
  appliedCount={appliedCount}
  shortlistedCount={shortlistedCount}
  interviewCount={interviewCount}
  rejectedCount={rejectedCount}
  selectedCount={selectedCount}
/>
      </section>
    </div>
  );
}