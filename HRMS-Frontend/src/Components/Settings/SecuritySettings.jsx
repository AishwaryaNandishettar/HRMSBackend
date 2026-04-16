import React, { useState } from "react";

const SecuritySettings = () => {
  const [password, setPassword] = useState({
    newPass: "",
    confirmPass: "",
  });

  const handleSave = () => {
    if (password.newPass !== password.confirmPass) {
      alert("Passwords do not match");
      return;
    }
    alert("Password Updated");
  };

  return (
    <div className="settings-section">
      <h3>Security</h3>

      <div className="form-group">
        <label>New Password</label>
        <input
          type="password"
          onChange={(e) =>
            setPassword({ ...password, newPass: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          onChange={(e) =>
            setPassword({ ...password, confirmPass: e.target.value })
          }
        />
      </div>

      <button className="save-btn" onClick={handleSave}>
        Update Password
      </button>
    </div>
  );
};

export default SecuritySettings;