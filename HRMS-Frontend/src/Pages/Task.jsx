import React, { useState, useEffect } from "react";
import "./Task.css";
import { FaCheckCircle, FaClock, FaDownload } from "react-icons/fa";
import { createTaskApi, getTasks } from "../api/taskApi";

const dummyUsers = [
  { name: "Aman", id: "EMP01" },
  { name: "Priya", id: "EMP02" },
  { name: "Rahul", id: "EMP03" },
  { name: "Sneha", id: "EMP04" },
   { name: "adhviti@gmail.com", id: "EMP9902" }
];

export default function AdvancedTaskPage() {
  const [tasks, setTasks] = useState(() => {
  const saved = localStorage.getItem("tasks");
  return saved ? JSON.parse(saved) : [];
});
useEffect(() => {
  fetchTasks();
}, []);

const fetchTasks = async () => {
  try {
    const res = await getTasks();
    setTasks(res.data || res || []);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    setTasks([]);
  }
};
  const [filter, setFilter] = useState("All");
  const [role, setRole] = useState("Manager");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activity, setActivity] = useState([]);

  const [form, setForm] = useState({
    project: "",
    priority: "Medium",
    team: [],
    deadline: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleUser = (user) => {
    setForm(prev => ({
      ...prev,
      team: prev.team.includes(user)
        ? prev.team.filter(u => u !== user)
        : [...prev.team, user]
    }));
  };

  const addTask = async () => {
  if (!form.project) return;

  const newTask = {
    id: Date.now(),
    ...form,
    assignedBy: role,
    assignedDate: new Date().toLocaleDateString(),
    progress: 0,
    status: "Assigned",
    acceptedStatus: "Not Accepted",
    file: null,
    remarks: "",
     // ✅ NEW FIELDS (ADD ONLY THESE)
  acceptedBy: [],        // employee accepts task
  accepted: false,       // quick flag (optional but useful)
  submitted: false,      // employee submitted work
  approvalStatus: "Pending" // Pending | Approved | Rejected
  };

  

  try {
    await createTaskApi({
  project: newTask.project,
  priority: newTask.priority,
  deadline: newTask.deadline,
  assignedBy: newTask.assignedBy,
  assignedDate: newTask.assignedDate,
  progress: newTask.progress,
  status: newTask.status,
  team: newTask.team.map(u => u.name) // ✅ IMPORTANT FIX
});
  } catch (err) {
    console.error("Error saving task:", err);
  }

  // ✅ KEEP YOUR EXISTING LOGIC (NO CHANGE)
  setTasks([newTask, ...tasks]);

  setActivity(prev => [
    { text: `Task Assigned: ${form.project}`, time: new Date().toLocaleTimeString() },
    ...prev
  ]);
};

  const updateProgress = (id, value) => {
    setTasks(tasks.map(t =>
      t.id === id
        ? {
            ...t,
            progress: value,
            status: value === 100 ? "Completed" : "In Progress"
          }
        : t
    ));
  };

  const uploadFile = (id, file) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, file } : t
    ));
  };

 const LOGGED_IN_USER = localStorage.getItem("loggedUser")
  ? JSON.parse(localStorage.getItem("loggedUser")).email
  : null;

const userTasks = tasks.filter(t =>
t.team.some(u =>
  (typeof u === "string" ? u : u.name)
    ?.trim()
    .toLowerCase() === LOGGED_IN_USER?.trim().toLowerCase()
)
);

const visibleTasks = role === "Employee" ? userTasks : tasks;

const filtered =
  filter === "All"
    ? visibleTasks
    : visibleTasks.filter(t => t.status === filter);


    const updateAcceptance = (id, value) => {
  setTasks(tasks.map(t =>
    t.id === id
      ? {
          ...t,
          accepted: value === "Accepted",
          acceptedStatus: value
        }
      : t
  ));
};
const submitTask = (id) => {
  setTasks(tasks.map(t =>
    t.id === id
      ? {
          ...t,
          submitted: true,
          submissionStatus: "Submitted"
        }
      : t
  ));
};
const updateApproval = (id, value) => {
  setTasks(tasks.map(t =>
    t.id === id
      ? {
          ...t,
          approvalStatus: value,
          status: value === "Approved"
            ? "Completed"
            : value === "Rejected"
              ? "Rejected"
              : t.status
        }
      : t
  ));
};

const adminSummary = {
  approved: tasks.filter(t => t.approvalStatus === "Approved").length,
  rejected: tasks.filter(t => t.approvalStatus === "Rejected").length,
  pending: tasks.filter(t => t.approvalStatus === "Pending").length,
};
  return (
    <div className="task-container">

      {/* KPI */}
      <div className="kpi">
        <div>Total Tasks <span>{tasks.length}</span></div>
        <div>Completed <span>{tasks.filter(t => t.status === "Completed").length}</span></div>
        <div>Members <span>{dummyUsers.length}</span></div>
      </div>

      {/* ROLE */}
      <div className="role-switch">
        {["Admin", "Manager", "Employee"].map(r => (
          <button key={r} onClick={() => setRole(r)} className={role === r ? "active" : ""}>
            {r}
          </button>
        ))}
      </div>

      {/* FORM */}
      {(role !== "Employee") && (
        <div className="task-form">

          <input name="project" placeholder="Task Name" onChange={handleChange} />

          <select name="priority" onChange={handleChange}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <input type="date" name="deadline" onChange={handleChange} />

          {/* CLEAN MULTI SELECT */}
          <div className="dropdown">
            <div className="dropdown-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {form.team.length
                ? form.team.map(u => u.name).join(", ")
                : "Select Team"}
            </div>

            {dropdownOpen && (
              <div className="dropdown-content">
                {dummyUsers.map(u => (
                  <label key={u.id}>
                    <input
                      type="checkbox"
                      checked={form.team.includes(u)}
                      onChange={() => toggleUser(u)}
                    />
                    {u.name} ({u.id})
                  </label>
                ))}
              </div>
            )}
          </div>

          <button onClick={addTask}>Assign Task</button>
        </div>
      )}

      {/* FILTER */}
      <div className="filters">
        {["All", "Assigned", "In Progress", "Completed"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={filter === f ? "active" : ""}>
            {f}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <div className="main">

        {/* TABLE */}
        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Assigned By</th>
                <th>Date</th>
                <th>Deadline</th>
                <th>Team</th>
                <th>Priority</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Acceptance</th>
<th>Submission</th>
<th>Approval</th>
                <th>Attachment</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td>{t.project}</td>
                  <td>{t.assignedBy}</td>
                  <td>{t.assignedDate}</td>
                  <td>{t.deadline}</td>

                  <td>{t.team.map(u => u.name).join(", ")}</td>

                  <td className={`priority ${t.priority}`}>
                    {t.priority}
                  </td>

                  <td>
                    <input
                      type="range"
                      value={t.progress}
                      onChange={(e) =>
                        updateProgress(t.id, Number(e.target.value))
                      }
                    />
                    {Math.round(t.progress)}%
                  </td>

                  <td className={`status ${t.status}`}>
                    {t.status === "Completed" ? <FaCheckCircle /> : <FaClock />}
                    {t.status}
                  </td>

                  {/* ACCEPTANCE COLUMN - Employee can accept, others see read-only */}
                  <td>
                    {role === "Employee" ? (
                      <select
                        value={t.acceptedStatus || "Not Accepted"}
                        onChange={(e) => updateAcceptance(t.id, e.target.value)}
                      >
                        <option value="Not Accepted">Not Accepted</option>
                        <option value="Accepted">Accepted</option>
                      </select>
                    ) : (
                      t.acceptedStatus || "Not Accepted"
                    )}
                  </td>

                  {/* SUBMISSION COLUMN - Employee can submit (after accepting), others see read-only */}
                  <td>
                    {role === "Employee" ? (
                      <select
                        disabled={t.acceptedStatus !== "Accepted"}
                        value={t.submissionStatus || "Not Submitted"}
                        onChange={(e) =>
                          setTasks(tasks.map(task =>
                            task.id === t.id
                              ? {
                                  ...task,
                                  submissionStatus: e.target.value,
                                  submitted: e.target.value === "Submitted"
                                }
                              : task
                          ))
                        }
                      >
                        <option value="Not Submitted">Not Submitted</option>
                        <option value="Submitted">Submitted</option>
                      </select>
                    ) : (
                      t.submissionStatus || "Not Submitted"
                    )}
                  </td>

                  {/* APPROVAL COLUMN - Manager/Admin can approve, Employee sees read-only */}
                  <td>
                    {role === "Manager" || role === "Admin" ? (
                      <select
                        value={t.approvalStatus || "Pending"}
                        onChange={(e) => updateApproval(t.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    ) : (
                      t.approvalStatus || "Pending"
                    )}
                  </td>

                  {/* ATTACHMENT */}
                  <td>
                    <input
                      type="file"
                      onChange={(e) =>
                        uploadFile(t.id, e.target.files[0])
                      }
                    />
                    {t.file && (
                      <a href={URL.createObjectURL(t.file)} download>
                        <FaDownload />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ACTIVITY */}
        <div className="activity">
          <h3>Live Activity</h3>
          {activity.map((a, i) => (
            <div key={i} className="activity-item">
              <p>{a.text}</p>
              <span>{a.time}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}