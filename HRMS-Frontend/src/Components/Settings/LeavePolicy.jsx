import React, { useState } from "react";

const LeavePolicy = () => {
  const [policy, setPolicy] = useState({
    monthly: "",
    carry: "",
  });

  return (
    <div className="settings-section">
      <h3>Leave Policy</h3>

      <div className="form-group">
        <label>Monthly Leave</label>
        <input
          type="number"
          onChange={(e) =>
            setPolicy({ ...policy, monthly: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Carry Forward</label>
        <input
          type="number"
          onChange={(e) =>
            setPolicy({ ...policy, carry: e.target.value })
          }
        />
      </div>

      <button className="save-btn">Save</button>
    </div>
  );
};

export default LeavePolicy;