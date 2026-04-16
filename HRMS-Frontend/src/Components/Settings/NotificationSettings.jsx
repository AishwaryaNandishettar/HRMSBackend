import React, { useState } from "react";

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    email: false,
    attendance: false,
    salary: false,
  });

  return (
    <div className="settings-section">
      <h3>Notifications</h3>

      <label className="toggle">
        <input
          type="checkbox"
          onChange={() =>
            setSettings({ ...settings, email: !settings.email })
          }
        />
        Email Alerts
      </label>

      <label className="toggle">
        <input
          type="checkbox"
          onChange={() =>
            setSettings({ ...settings, attendance: !settings.attendance })
          }
        />
        Attendance Reminder
      </label>

      <label className="toggle">
        <input
          type="checkbox"
          onChange={() =>
            setSettings({ ...settings, salary: !settings.salary })
          }
        />
        Salary Alerts
      </label>

      <button className="save-btn">Save</button>
    </div>
  );
};

export default NotificationSettings;