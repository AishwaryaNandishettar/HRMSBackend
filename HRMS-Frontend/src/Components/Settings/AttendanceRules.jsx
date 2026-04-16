import React, { useState } from "react";

const AttendanceRules = () => {
  const [rules, setRules] = useState({
    startTime: "",
    lateMinutes: "",
    halfDayHours: "",
  });

  return (
    <div className="settings-section">
      <h3>Attendance Rules</h3>

      <div className="form-group">
        <label>Start Time</label>
        <input
          type="time"
          onChange={(e) =>
            setRules({ ...rules, startTime: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Late Minutes</label>
        <input
          type="number"
          onChange={(e) =>
            setRules({ ...rules, lateMinutes: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Half Day Hours</label>
        <input
          type="number"
          onChange={(e) =>
            setRules({ ...rules, halfDayHours: e.target.value })
          }
        />
      </div>

      <button className="save-btn">Save</button>
    </div>
  );
};

export default AttendanceRules;