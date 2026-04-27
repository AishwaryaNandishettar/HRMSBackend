import { useState, useEffect, useContext } from "react";
import "./TaskProfessional.css";
import { AuthContext } from "../Context/Authcontext";
import { TaskContext } from "../Context/TaskContext";
import {
  createTaskApi, updateTaskApi,
  acceptTaskApi, rejectTaskApi,
  submitTaskApi, updateProgressApi,
  approveTaskApi, rejectSubmissionApi,
} from "../api/taskApi";
import { getAllEmployees } from "../api/employeeApi";
import {
  FaPlus, FaTimes, FaCheck, FaEye, FaUndo,
  FaFlag, FaUser, FaCalendarAlt, FaClock,
} from "react-icons/fa";

/* ── status helpers ── */
const STATUS_COLOR = {
  ASSIGNED:   "#f59e0b",
  ACCEPTED:   "#3b82f6",
  IN_PROGRESS:"#8b5cf6",
  SUBMITTED:  "#ec4899",
  COMPLETED:  "#10b981",
  REJECTED:   "#ef4444",
};
const PRIORITY_COLOR = { HIGH: "#ef4444", MEDIUM: "#f59e0b", LOW: "#10b981" };

const Badge = ({ text, color }) => (
  <span style={{
    background: color, color: "#fff", fontSize: 11,
    padding: "2px 8px", borderRadius: 20, fontWeight: 600,
  }}>{text}</span>
);

const ProgressBar = ({ value }) => (
  <div style={{ background: "#e5e7eb", borderRadius: 8, height: 8, width: "100%", overflow: "hidden" }}>
    <div style={{
      width: `${value}%`, height: "100%",
      background: value === 100 ? "#10b981" : "#3b82f6",
      transition: "width 0.3s",
    }} />
  </div>
);

export default function TaskProfessional() {
  const { user } = useContext(AuthContext);
  const { tasks, fetchTasks, setTasks } = useContext(TaskContext);

  const role = (user?.role || "employee").toLowerCase();
  const isAdmin   = role === "admin";
  const isManager = role === "manager";
  const isEmployee = role === "employee";
  const canManage = isAdmin || isManager;

  const userEmail = user?.email || "";

  /* ── state ── */
  const [loading, setLoading]         = useState(true);
  const [employees, setEmployees]     = useState([]);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreate, setShowCreate]   = useState(false);
  const [showDetail, setShowDetail]   = useState(false);
  const [rejectInput, setRejectInput] = useState("");
  const [rejectingId, setRejectingId] = useState(null);

  const [form, setForm] = useState({
    title: "", description: "", priority: "MEDIUM",
    assignee: "", dueDate: "",
  });

  /* ── load ── */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchTasks();
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (canManage) {
      getAllEmployees()
        .then((res) => {
          const list = res?.data?.content || res?.data || [];
          setEmployees(Array.isArray(list) ? list : []);
        })
        .catch(() => {});
    }
  }, [canManage]);

  /* ── role-based task list ── */
  const myTasks = isEmployee
    ? tasks.filter((t) => t.assignee === userEmail)
    : tasks;

  /* ── filters ── */
  const filtered = myTasks.filter((t) => {
    const matchSearch =
      !search ||
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.assignee?.toLowerCase().includes(search.toLowerCase());
    const matchStatus   = statusFilter === "All"   || t.status === statusFilter;
    const matchPriority = priorityFilter === "All" || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  /* ── KPIs ── */
  const kpi = {
    total:      myTasks.length,
    assigned:   myTasks.filter((t) => t.status === "ASSIGNED").length,
    inProgress: myTasks.filter((t) => t.status === "IN_PROGRESS" || t.status === "ACCEPTED").length,
    submitted:  myTasks.filter((t) => t.status === "SUBMITTED").length,
    completed:  myTasks.filter((t) => t.status === "COMPLETED").length,
    rejected:   myTasks.filter((t) => t.status === "REJECTED").length,
  };

  /* ── actions ── */
  const refresh = async () => { await fetchTasks(); };

  const handleCreate = async () => {
    if (!form.title || !form.assignee) {
      alert("Task title and assignee are required.");
      return;
    }
    try {
      await createTaskApi({
        title: form.title,
        description: form.description,
        priority: form.priority,
        assignee: form.assignee,
        dueDate: form.dueDate || null,
        status: "ASSIGNED",
        progress: 0,
        history: [],
      });
      setForm({ title: "", description: "", priority: "MEDIUM", assignee: "", dueDate: "" });
      setShowCreate(false);
      await refresh();
    } catch { alert("Failed to create task."); }
  };

  const handleAccept = async (id) => {
    try { await acceptTaskApi(id); await refresh(); }
    catch { alert("Failed to accept task."); }
  };

  const handleReject = async (id) => {
    try {
      await rejectTaskApi(id, rejectInput);
      setRejectingId(null); setRejectInput("");
      await refresh();
    } catch { alert("Failed to reject task."); }
  };

  const handleProgress = async (id, progress) => {
    try {
      await updateProgressApi(id, progress);
      setTasks((prev) => prev.map((t) => t.id === id ? { ...t, progress } : t));
    } catch { /* silent */ }
  };

  const handleSubmit = async (id) => {
    try { await submitTaskApi(id); await refresh(); }
    catch { alert("Failed to submit task."); }
  };

  const handleApprove = async (id) => {
    try { await approveTaskApi(id); await refresh(); }
    catch { alert("Failed to approve task."); }
  };

  const handleRejectSubmission = async (id) => {
    try {
      await rejectSubmissionApi(id, rejectInput);
      setRejectingId(null); setRejectInput("");
      await refresh();
    } catch { alert("Failed to reject submission."); }
  };

  const daysLeft = (due) => {
    if (!due) return null;
    const d = Math.ceil((new Date(due) - new Date()) / 86400000);
    return d;
  };

  /* ── render ── */
  return (
    <div className="tp-container">

      {/* HEADER */}
      <div className="tp-header">
        <div>
          <h2 className="tp-title">Task Management</h2>
          <span className="tp-role-badge">{role.toUpperCase()}</span>
        </div>
        {canManage && (
          <button className="tp-btn tp-btn-primary" onClick={() => setShowCreate(true)}>
            <FaPlus /> Create Task
          </button>
        )}
      </div>

      {/* KPI CARDS */}
      <div className="tp-kpi-row">
        <div className="tp-kpi tp-kpi-blue">
          <div className="tp-kpi-label">Total</div>
          <div className="tp-kpi-value">{kpi.total}</div>
        </div>
        <div className="tp-kpi tp-kpi-orange">
          <div className="tp-kpi-label">Assigned</div>
          <div className="tp-kpi-value">{kpi.assigned}</div>
        </div>
        <div className="tp-kpi tp-kpi-purple">
          <div className="tp-kpi-label">In Progress</div>
          <div className="tp-kpi-value">{kpi.inProgress}</div>
        </div>
        <div className="tp-kpi tp-kpi-pink">
          <div className="tp-kpi-label">Submitted</div>
          <div className="tp-kpi-value">{kpi.submitted}</div>
        </div>
        <div className="tp-kpi tp-kpi-green">
          <div className="tp-kpi-label">Completed</div>
          <div className="tp-kpi-value">{kpi.completed}</div>
        </div>
        <div className="tp-kpi tp-kpi-red">
          <div className="tp-kpi-label">Rejected</div>
          <div className="tp-kpi-value">{kpi.rejected}</div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="tp-toolbar">
        <input
          className="tp-search"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="tp-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <select className="tp-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="All">All Priority</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="tp-table-wrap">
        {loading ? (
          <div className="tp-empty">Loading tasks...</div>
        ) : filtered.length === 0 ? (
          <div className="tp-empty">No tasks found.</div>
        ) : (
          <table className="tp-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>{canManage ? "Assigned To" : "Assigned By"}</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => {
                const days = daysLeft(task.dueDate);
                const overdue = days !== null && days < 0 && task.status !== "COMPLETED";
                return (
                  <tr key={task.id} className={overdue ? "tp-overdue" : ""}>
                    <td>
                      <div className="tp-task-name">{task.title}</div>
                      {task.description && (
                        <div className="tp-task-desc">{task.description.slice(0, 60)}{task.description.length > 60 ? "…" : ""}</div>
                      )}
                      {overdue && <span className="tp-overdue-badge">OVERDUE</span>}
                    </td>
                    <td className="tp-assignee">
                      <FaUser style={{ marginRight: 4, color: "#94a3b8" }} />
                      {canManage ? task.assignee : task.assignedBy || "—"}
                    </td>
                    <td>
                      <Badge text={task.priority || "—"} color={PRIORITY_COLOR[task.priority] || "#6b7280"} />
                    </td>
                    <td>
                      {task.dueDate ? (
                        <span style={{ color: overdue ? "#ef4444" : "#374151", fontSize: 13 }}>
                          {new Date(task.dueDate).toLocaleDateString()}
                          {days !== null && (
                            <div style={{ fontSize: 11, color: overdue ? "#ef4444" : "#6b7280" }}>
                              {overdue ? `${Math.abs(days)}d overdue` : `${days}d left`}
                            </div>
                          )}
                        </span>
                      ) : "—"}
                    </td>
                    <td style={{ minWidth: 120 }}>
                      {/* Employee can drag progress when accepted */}
                      {isEmployee && task.assignee === userEmail &&
                       (task.status === "ACCEPTED" || task.status === "IN_PROGRESS") ? (
                        <div>
                          <input
                            type="range" min="0" max="100"
                            value={task.progress || 0}
                            onChange={(e) => handleProgress(task.id, parseInt(e.target.value))}
                            className="tp-slider"
                          />
                          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{task.progress || 0}%</div>
                          <ProgressBar value={task.progress || 0} />
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 3 }}>{task.progress || 0}%</div>
                          <ProgressBar value={task.progress || 0} />
                        </div>
                      )}
                    </td>
                    <td>
                      <Badge text={task.status} color={STATUS_COLOR[task.status] || "#6b7280"} />
                    </td>
                    <td>
                      <div className="tp-actions">
                        {/* View detail */}
                        <button className="tp-btn-icon tp-btn-info" title="View"
                          onClick={() => { setSelectedTask(task); setShowDetail(true); }}>
                          <FaEye />
                        </button>

                        {/* Employee: Accept / Reject when ASSIGNED */}
                        {isEmployee && task.assignee === userEmail && task.status === "ASSIGNED" && (
                          <>
                            <button className="tp-btn-icon tp-btn-success" title="Accept"
                              onClick={() => handleAccept(task.id)}>
                              <FaCheck />
                            </button>
                            <button className="tp-btn-icon tp-btn-danger" title="Reject"
                              onClick={() => setRejectingId(task.id)}>
                              <FaTimes />
                            </button>
                          </>
                        )}

                        {/* Employee: Submit when IN_PROGRESS */}
                        {isEmployee && task.assignee === userEmail &&
                         (task.status === "IN_PROGRESS" || task.status === "ACCEPTED") && (
                          <button className="tp-btn-sm tp-btn-primary" title="Submit for approval"
                            onClick={() => handleSubmit(task.id)}>
                            Submit
                          </button>
                        )}

                        {/* Manager/Admin: Approve / Reject when SUBMITTED */}
                        {canManage && task.status === "SUBMITTED" && (
                          <>
                            <button className="tp-btn-icon tp-btn-success" title="Approve"
                              onClick={() => handleApprove(task.id)}>
                              <FaCheck />
                            </button>
                            <button className="tp-btn-icon tp-btn-danger" title="Send back"
                              onClick={() => setRejectingId(task.id)}>
                              <FaUndo />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Inline reject reason input */}
                      {rejectingId === task.id && (
                        <div className="tp-reject-box">
                          <input
                            className="tp-reject-input"
                            placeholder="Reason (optional)"
                            value={rejectInput}
                            onChange={(e) => setRejectInput(e.target.value)}
                          />
                          <button className="tp-btn-sm tp-btn-danger"
                            onClick={() => canManage ? handleRejectSubmission(task.id) : handleReject(task.id)}>
                            Confirm
                          </button>
                          <button className="tp-btn-sm tp-btn-secondary"
                            onClick={() => { setRejectingId(null); setRejectInput(""); }}>
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── CREATE TASK MODAL ── */}
      {showCreate && (
        <div className="tp-overlay" onClick={() => setShowCreate(false)}>
          <div className="tp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tp-modal-header">
              <h3>Create New Task</h3>
              <button className="tp-close" onClick={() => setShowCreate(false)}><FaTimes /></button>
            </div>
            <div className="tp-modal-body">
              <div className="tp-form-group">
                <label>Task Title *</label>
                <input className="tp-input" placeholder="Enter task title"
                  value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="tp-form-group">
                <label>Description</label>
                <textarea className="tp-textarea" rows={3} placeholder="Task description"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="tp-form-row">
                <div className="tp-form-group">
                  <label>Priority *</label>
                  <select className="tp-input" value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                <div className="tp-form-group">
                  <label>Due Date</label>
                  <input type="date" className="tp-input" value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                </div>
              </div>
              <div className="tp-form-group">
                <label>Assign To (email) *</label>
                {employees.length > 0 ? (
                  <select className="tp-input" value={form.assignee}
                    onChange={(e) => setForm({ ...form, assignee: e.target.value })}>
                    <option value="">-- Select Employee --</option>
                    {employees.map((emp) => (
                      <option key={emp.id || emp.email} value={emp.email || emp.workEmail}>
                        {emp.fullName} ({emp.email || emp.workEmail})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input className="tp-input" placeholder="employee@company.com"
                    value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} />
                )}
              </div>
            </div>
            <div className="tp-modal-footer">
              <button className="tp-btn tp-btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="tp-btn tp-btn-primary" onClick={handleCreate}>Create Task</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DETAIL MODAL ── */}
      {showDetail && selectedTask && (
        <div className="tp-overlay" onClick={() => setShowDetail(false)}>
          <div className="tp-modal tp-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="tp-modal-header">
              <h3>{selectedTask.title}</h3>
              <button className="tp-close" onClick={() => setShowDetail(false)}><FaTimes /></button>
            </div>
            <div className="tp-modal-body">
              <div className="tp-detail-grid">
                <div className="tp-detail-item">
                  <label>Status</label>
                  <Badge text={selectedTask.status} color={STATUS_COLOR[selectedTask.status] || "#6b7280"} />
                </div>
                <div className="tp-detail-item">
                  <label>Priority</label>
                  <Badge text={selectedTask.priority} color={PRIORITY_COLOR[selectedTask.priority] || "#6b7280"} />
                </div>
                <div className="tp-detail-item">
                  <label>Assigned To</label>
                  <span>{selectedTask.assignee || "—"}</span>
                </div>
                <div className="tp-detail-item">
                  <label>Assigned By</label>
                  <span>{selectedTask.assignedBy || "—"}</span>
                </div>
                <div className="tp-detail-item">
                  <label>Due Date</label>
                  <span>{selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : "—"}</span>
                </div>
                <div className="tp-detail-item">
                  <label>Progress</label>
                  <span>{selectedTask.progress || 0}%</span>
                </div>
              </div>

              {selectedTask.description && (
                <div className="tp-detail-section">
                  <h4>Description</h4>
                  <p>{selectedTask.description}</p>
                </div>
              )}

              {selectedTask.remarks && (
                <div className="tp-detail-section">
                  <h4>Remarks</h4>
                  <p>{selectedTask.remarks}</p>
                </div>
              )}

              {selectedTask.rejectReason && (
                <div className="tp-detail-section tp-detail-warn">
                  <h4>Rejection Reason</h4>
                  <p>{selectedTask.rejectReason}</p>
                </div>
              )}

              {selectedTask.history && selectedTask.history.length > 0 && (
                <div className="tp-detail-section">
                  <h4>History</h4>
                  <div className="tp-timeline">
                    {selectedTask.history.map((h, i) => (
                      <div key={i} className="tp-timeline-item">
                        <div className="tp-timeline-dot" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
