
import React from "react";

const ClaimFilters = ({ filter, setFilter, employees }) => {
  const departments = ["All", ...new Set(employees.map((e) => e.department))];
  const teams = ["All", ...new Set(employees.map((e) => e.team))];
  const statuses = ["All", "Pending", "Approved", "Rejected"];

  return (
    <div className="claim-filters" style={{ marginBottom: "20px" }}>
      <label>
        Department:
        <select
          value={filter.department}
          onChange={(e) => setFilter({ ...filter, department: e.target.value })}
        >
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </label>
      <label style={{ marginLeft: "10px" }}>
        Team:
        <select
          value={filter.team}
          onChange={(e) => setFilter({ ...filter, team: e.target.value })}
        >
          {teams.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>
      <label style={{ marginLeft: "10px" }}>
        Status:
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default ClaimFilters;
