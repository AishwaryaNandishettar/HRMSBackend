import { useState, useEffect } from "react";
import "./Helpdesk.css";
import api from "../api/axios";

export default function Helpdesk() {

  const [tickets, setTickets] = useState([]);

  const [form, setForm] = useState({
    issue: "Login Issue",
    customIssue: "",
    remarks: "",
    file: null
  });

  const [filter, setFilter] = useState({
    search: "",
    issue: "",
    status: "",
    raisedBy: "",
    fromDate: "",
    toDate: ""
  });

  /* ================= FETCH ================= */
  const fetchTickets = async () => {
    try {
      const res = await api.get("/api/helpdesk");
      setTickets(res.data.reverse());
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();

    try {
      const issueValue =
        form.issue === "Other" ? form.customIssue : form.issue;

      await api.post("/api/helpdesk", {
        issue: issueValue,
        remarks: form.remarks,
        raisedBy: "You",
        attachment: form.file ? form.file.name : "-"
      });

      alert("✅ Ticket Created");

      fetchTickets();

      setForm({
        issue: "Login Issue",
        customIssue: "",
        remarks: "",
        file: null
      });

    } catch (err) {
      console.error(err);
      alert("❌ Failed to create ticket");
    }
  };

  /* ================= KPI ================= */
  const total = tickets.length;
  const open = tickets.filter(t => t.status === "Open").length;
  const resolved = tickets.filter(t => t.status === "Resolved").length;

  /* ================= FILTER ================= */
  const filteredTickets = tickets.filter(t => {

    const matchSearch =
      filter.search === "" ||
      Object.values(t).some(val =>
        val?.toString().toLowerCase().includes(filter.search.toLowerCase())
      );

    const matchIssue = filter.issue ? t.issue === filter.issue : true;
    const matchStatus = filter.status ? t.status === filter.status : true;
    const matchUser = filter.raisedBy
      ? t.raisedBy?.toLowerCase().includes(filter.raisedBy.toLowerCase())
      : true;

    const matchDate =
      (!filter.fromDate || t.date >= filter.fromDate) &&
      (!filter.toDate || t.date <= filter.toDate);

    return matchSearch && matchIssue && matchStatus && matchUser && matchDate;
  });

  const clearFilters = () => {
    setFilter({
      search: "",
      issue: "",
      status: "",
      raisedBy: "",
      fromDate: "",
      toDate: ""
    });
  };

  return (
    <div className="hd-container">

      {/* KPI */}
      <div className="hd-kpi-row">
        <div className="hd-kpi total">
          <h3>{total}</h3>
          <span>Total Tickets</span>
        </div>
        <div className="hd-kpi open">
          <h3>{open}</h3>
          <span>Open</span>
        </div>
        <div className="hd-kpi resolved">
          <h3>{resolved}</h3>
          <span>Resolved</span>
        </div>
      </div>

      {/* FORM */}
      <div className="hd-card">
        <h3>Raise Ticket</h3>

        <form className="hd-form" onSubmit={submit}>
          <select
            value={form.issue}
            onChange={(e)=>setForm({...form,issue:e.target.value})}
          >
            <option>Login Issue</option>
            <option>System Error</option>
            <option>HR Query</option>
            <option>Payroll Issue</option>
            <option>Complaint</option>
            <option>Other</option>
          </select>

          {form.issue === "Other" && (
            <input
              placeholder="Enter custom issue..."
              value={form.customIssue}
              onChange={(e)=>setForm({...form,customIssue:e.target.value})}
            />
          )}

          <textarea
            placeholder="Remarks..."
            value={form.remarks}
            onChange={(e)=>setForm({...form,remarks:e.target.value})}
          />

          <input
            type="file"
            onChange={(e)=>setForm({...form,file:e.target.files[0]})}
          />

          <button className="hd-btn">Submit Ticket</button>
        </form>
      </div>

      {/* TABLE */}
      <div className="hd-card">

        <div className="hd-header">
          <h3>Ticket Tracker</h3>

          <div className="hd-filters">
            <input
              placeholder="Search..."
              value={filter.search}
              onChange={(e)=>setFilter({...filter,search:e.target.value})}
            />

            <input
              placeholder="Raised By"
              value={filter.raisedBy}
              onChange={(e)=>setFilter({...filter,raisedBy:e.target.value})}
            />

            <select
              value={filter.issue}
              onChange={(e)=>setFilter({...filter,issue:e.target.value})}
            >
              <option value="">All Issues</option>
              <option>Login Issue</option>
              <option>System Error</option>
              <option>HR Query</option>
              <option>Payroll Issue</option>
              <option>Complaint</option>
            </select>

            <select
              value={filter.status}
              onChange={(e)=>setFilter({...filter,status:e.target.value})}
            >
              <option value="">All Status</option>
              <option>Open</option>
              <option>Resolved</option>
            </select>

            <input
              type="date"
              value={filter.fromDate}
              onChange={(e)=>setFilter({...filter,fromDate:e.target.value})}
            />

            <input
              type="date"
              value={filter.toDate}
              onChange={(e)=>setFilter({...filter,toDate:e.target.value})}
            />

            <button onClick={clearFilters} className="hd-clear">
              Clear
            </button>
          </div>
        </div>

        <div className="hd-table-wrap">
          <table className="hd-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Issue Type</th>
                <th>Raised By</th>
                <th>Attachment</th>
                <th>Resolved By</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Resolved Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="8" className="hd-empty">
                    No tickets found
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t, i) => (
                  <tr key={i}>
                    <td>{t.id}</td>
                    <td>{t.issue}</td>
                    <td>{t.raisedBy}</td>
                    <td>{t.attachment}</td>
                    <td>{t.resolvedBy}</td>
                    <td>
                      <span className={`hd-badge hd-${t.status}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>{t.date}</td>
                    <td>{t.resolvedDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}