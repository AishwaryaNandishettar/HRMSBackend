import React, { useState, useEffect } from "react";
import "./Task.css";
import { getTasks } from "../api/taskApi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export default function Task() {

  /* =========================
     ROLE BASED LOGIN DEMO
  ========================= */

const role =
  localStorage.getItem("role")?.toLowerCase() || "employee";

  /* =========================
     TASK FORM
  ========================= */

  const [taskForm, setTaskForm] = useState({
    task: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
  });

  /* =========================
     TASK DATA
  ========================= */

const [taskData, setTaskData] = useState([]);
const [activeFilter, setActiveFilter] = useState(null);
const [filterText, setFilterText] = useState("");
const [columnFilters, setColumnFilters] = useState({
  empid: [],
  employeename: [],
  task: [],
  assignedby: [],
  priority: [],
  assignDate: [],
  dueDate: [],
  department: [],
  status: [],
  approval: [],
});
const [popupFilterText, setPopupFilterText] =
  useState("");

  const fieldMap = {
  empid: "assigneeId",
  employeename: "assigneeName",
  task: "title",
  assignedby: "assignedBy",
  priority: "priority",
  status: "status",
  approval: "approval",
};

const getUniqueValues = (key) => {
  return [
    ...new Set(
      taskData
        .map((t) => {

          const field =
            fieldMap[key];

          return (
            t[field] ||
            t[key]
          );

        })
        .filter(Boolean)
    ),
  ];
};

const filterSuggestions =
  activeFilter &&
  getUniqueValues(activeFilter).filter(
    (v) =>
      String(v)
        .toLowerCase()
        .includes(
          popupFilterText.toLowerCase()
        )
  );

useEffect(() => {
  loadTasks();
}, []);

const loadTasks = async () => {
  try {
    const response = await getTasks();

    console.log("BACKEND TASKS =", response.data);

    setTaskData(response.data);

  } catch (error) {

    console.error("TASK FETCH ERROR =", error);

  }
};





const suggestions =
  activeFilter
    ? getUniqueValues(activeFilter).filter(
        (v) =>
          String(v)
            .toLowerCase()
            .includes(
              popupFilterText.toLowerCase()
            )
      )
    : [];

  const getUnique = (key) => {
  return [
    ...new Set(
      taskData
        .map((t) => t[fieldMap[key]] || t[key])
        .filter(Boolean)
    ),
  ];
};

const renderFilterPopup = (key) => {
  if (activeFilter !== key) return null;

  return (
    <div className="taskPage-filterPopup">

      <input
        type="text"
        placeholder="Search..."
        value={popupFilterText}
        onChange={(e) =>
          setPopupFilterText(e.target.value)
        }
      />

      <div className="taskPage-filterList">

        {suggestions.length > 0 ? (

          suggestions.map((s) => (

            <label
              key={s}
              className="taskPage-filterItem"
            >

              <input
                type="checkbox"
                checked={
                  Array.isArray(columnFilters[key])
                    ? columnFilters[key].includes(s)
                    : false
                }
                onChange={(e) => {

                const prev =
  columnFilters[key] || [];

                  let updated = [];

                  if (e.target.checked) {

                    updated = [...prev, s];

                  } else {

                    updated = prev.filter(
                      (item) => item !== s
                    );

                  }

                  setColumnFilters({
                    ...columnFilters,
                    [key]: updated,
                  });

                }}
              />

              <span>{s}</span>

            </label>

          ))

        ) : (

          <div className="taskPage-noData">
            No Data
          </div>

        )}

      </div>
<div className="taskPage-filterActions">

  {/* OK = same as current Close */}
  <button
    onClick={() => {
      setActiveFilter(null);
      setPopupFilterText("");
    }}
  >
    OK
  </button>

  {/* Cancel = same as current Clear */}
  <button
    onClick={() => {
      setColumnFilters({
        ...columnFilters,
        [key]: [],
      });
    }}
  >
    Cancel
  </button>

</div>

    </div>
  );
};
      const exportData = (type) => {

  const exportRows = taskData.map((t) => ({
    "Emp ID": t.assigneeId || t.id,
    "Employee Name": t.assigneeName || t.employee,
    "Task": t.title || t.task,
    "Assigned By": t.assignedBy || t.manager,
    "Priority": t.priority,
    "Assign Date":
      t.createdAt
        ? new Date(t.createdAt).toLocaleDateString()
        : t.assignDate,
    "Due Date": t.dueDate,
    "Department": t.department || t.dept,
    "Progress": `${t.progress}%`,
    "Status": t.status,
    "Approval": t.approval,
  }));

  if (type === "csv") {

    const worksheet =
      XLSX.utils.json_to_sheet(exportRows);

    const csv =
      XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    saveAs(blob, "Task_Report.csv");
  }

  if (type === "excel") {

    const worksheet =
      XLSX.utils.json_to_sheet(exportRows);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Tasks"
    );

    const excelBuffer =
      XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

    const blob = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(blob, "Task_Report.xlsx");
  }
};
  /* =========================
     ASSIGN TASK
  ========================= */

  const assignTask = () => {

    if (
      !taskForm.task ||
      !taskForm.assignedTo ||
      !taskForm.dueDate
    ) {
      alert("Please fill all fields");
      return;
    }


    const newTask = {
      id: `EMP00${taskData.length + 1}`,
      employee: taskForm.assignedTo,
      task: taskForm.task,
      manager: role,
      priority: taskForm.priority,
      assignDate: new Date().toLocaleDateString(),
      dueDate: taskForm.dueDate,
      dept: "HRMS",
      progress: 0,
      status: "Assigned",
      approval: "Pending",
    };

    setTaskData([newTask, ...taskData]);

    setTaskForm({
      task: "",
      assignedTo: "",
      priority: "Medium",
      dueDate: "",
    });
  };

  return (

    <div className="taskPage-container">

      {/* =========================
          TOP BAR
      ========================= */}

      <div className="taskPage-topBar">

        <div>

          <h1 className="taskPage-title">
             Task Management
          </h1>

        

        </div>

        {/* ROLE SWITCH */}

    <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "14px",
  }}
>

{(role === "admin" ||
  role === "manager") && (

  <div className="taskPage-exportWrapper">

    <button className="taskPage-exportBtn">
      ⬇ Export
    </button>

    <div className="taskPage-exportDropdown">

      <div onClick={() => exportData("csv")}>
        📄 Download CSV
      </div>

      <div onClick={() => exportData("excel")}>
        📊 Download Excel
      </div>

    </div>

  </div>

)}
  <div className="taskPage-roleInfo">

    Logged in as :
    <span>
      {" "}
      {role.charAt(0).toUpperCase() +
        role.slice(1)}
    </span>

  </div>

</div>

      </div>

      {/* =========================
          KPI CARDS
      ========================= */}

      <div className="taskPage-topCards">

        <div className="taskPage-card">
          <h3>Total Tasks</h3>
          <h1>{taskData.length}</h1>
        </div>

        <div className="taskPage-card">
          <h3>Completed</h3>
          <h1>
            {
              taskData.filter(
                (t) => t.status === "Completed"
              ).length
            }
          </h1>
        </div>

        <div className="taskPage-card">
          <h3>In Progress</h3>
          <h1>
            {
              taskData.filter(
                (t) => t.status === "In Progress"
              ).length
            }
          </h1>
        </div>

        <div className="taskPage-card">
          <h3>Pending</h3>
          <h1>
            {
              taskData.filter(
                (t) => t.approval === "Pending"
              ).length
            }
          </h1>
        </div>

      </div>

      {/* =========================
          ASSIGN TASK
      ========================= */}

     {(role === "admin" || role === "manager") && (

        <div className="taskPage-assignCard">

          <h2>Assign Task</h2>

          <div className="taskPage-formGrid">

            <input
              type="text"
              placeholder="Enter Task Name"
              value={taskForm.task}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  task: e.target.value,
                })
              }
            />

            <select
              value={taskForm.assignedTo}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  assignedTo: e.target.value,
                })
              }
            >
              <option value="">
                Select Employee
              </option>

              <option>Aman</option>
              <option>Priya</option>
              <option>Rahul</option>
              <option>Sneha</option>
              <option>Kiran</option>
              <option>Divya</option>

            </select>

            <select
              value={taskForm.priority}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  priority: e.target.value,
                })
              }
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <input
              type="date"
              value={taskForm.dueDate}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  dueDate: e.target.value,
                })
              }
            />

            <button
              className="taskPage-assignBtn"
              onClick={assignTask}
            >
              Assign Task
            </button>

          </div>

        </div>

      )}

      {/* =========================
          TABLE
      ========================= */}

    <div className="taskPage-tableWrapper">

  <div className="taskPage-tableContainer">

    <table className="taskPage-table">

      <thead>

        <tr>

          <th className="taskPage-sticky-col taskPage-col-1">

  <div className="taskPage-thHeader">
    Emp ID
    <span onClick={() => setActiveFilter("empid")}>
      ⏷
    </span>
  </div>

  {renderFilterPopup("empid")}

</th>

        <th className="taskPage-sticky-col taskPage-col-2">

  <div className="taskPage-thHeader">
    Employee Name
    <span
      onClick={() =>
        setActiveFilter("employeename")
      }
    >
      ⏷
    </span>
  </div>

{renderFilterPopup("employeename")}

</th>

        <th className="taskPage-sticky-col taskPage-col-3">

  <div className="taskPage-thHeader">
    Task
    <span onClick={() => setActiveFilter("task")}>
      ⏷
    </span>
  </div>

{renderFilterPopup("task")}

</th>

        <th>

  <div className="taskPage-thHeader">
    Assigned By

    <span
      onClick={() =>
        setActiveFilter("assignedby")
      }
    >
      ⏷
    </span>
  </div>

{renderFilterPopup("assignedby")}

</th>
          <th>

  <div className="taskPage-thHeader">
    Priority

    <span
      onClick={() =>
        setActiveFilter("priority")
      }
    >
      ⏷
    </span>
  </div>

 {renderFilterPopup("priority")}

</th>
         <th>

  <div className="taskPage-thHeader">
    Assign Date

    <span
      onClick={() =>
        setActiveFilter("assignDate")
      }
    >
      ⏷
    </span>
  </div>

{renderFilterPopup("assignDate")}

</th>
         <th>

  <div className="taskPage-thHeader">
    Due Date

    <span
      onClick={() =>
        setActiveFilter("dueDate")
      }
    >
      ⏷
    </span>
  </div>

  {renderFilterPopup("dueDate")}
</th>
          <th>

  <div className="taskPage-thHeader">
    Department

    <span
      onClick={() =>
        setActiveFilter("department")
      }
    >
      ⏷
    </span>
  </div>

{renderFilterPopup("department")}
</th>
          <th>Progress</th>
          <th>

  <div className="taskPage-thHeader">
    Status

    <span
      onClick={() =>
        setActiveFilter("status")
      }
    >
      ⏷
    </span>
  </div>

{renderFilterPopup("status")}
</th>
         <th>

  <div className="taskPage-thHeader">
    Approval

    <span
      onClick={() =>
        setActiveFilter("approval")
      }
    >
      ⏷
    </span>
  </div>

  {renderFilterPopup("approval")}
</th>
          <th>Attachment</th>
          <th>Remarks</th>
          <th>Action</th>

        </tr>

      </thead>

      <tbody>
{taskData
  .filter((t) => {

  return Object.keys(columnFilters).every((key) => {

    const selected =
      columnFilters[key];

    if (
      !selected ||
      selected.length === 0
    ) {
      return true;
    }

    const actualField =
      fieldMap[key];

    const value =
      t[actualField] ||
      t[key] ||
      "";

    return selected.includes(
      String(value)
    );

  });

})

  .map((t, index) => (

          <tr key={index}>

          <td className="taskPage-sticky-col taskPage-col-1">
  {t.assigneeId || t.id}
</td>

           <td className="taskPage-sticky-col taskPage-col-2">
  {t.assigneeName || t.employee}
</td>

           <td className="taskPage-sticky-col taskPage-col-3">
  {t.title || t.task}
</td>

           <td>{t.assignedBy || t.manager}</td>

            <td>

              <span
                className={`taskPage-priority ${t.priority}`}
              >
                {t.priority}
              </span>

            </td>

            <td>
  {t.createdAt
    ? new Date(t.createdAt).toLocaleDateString()
    : t.assignDate}
</td>

            <td>{t.dueDate}</td>

            <td>{t.department || t.dept || "HRMS"}</td>

            <td>

              <div className="taskPage-progressBox">

                <div
                  className="taskPage-progressFill"
                  style={{
                    width: `${t.progress}%`,
                  }}
                />

              </div>

              {t.progress}%

            </td>

            <td>

              <span
                className={`taskPage-status ${t.status.replace(
                  /\s/g,
                  ""
                )}`}
              >
                {t.status}
              </span>

            </td>

            <td>{t.approval}</td>

            <td>

              <button className="taskPage-uploadBtn">
                Upload
              </button>

            </td>

            <td>
              API Integration Pending
            </td>

            <td>

              <button className="taskPage-actionBtn">
                View
              </button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>

    </div>
  );
}