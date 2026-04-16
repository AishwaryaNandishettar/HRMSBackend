import React, { useState } from "react";

const RoleManagement = () => {
  const [roles, setRoles] = useState([
    { name: "Admin", view: true, edit: true, delete: true },
    { name: "Manager", view: true, edit: true, delete: false },
    { name: "Employee", view: true, edit: false, delete: false },
  ]);

  const togglePermission = (index, field) => {
    const updated = [...roles];
    updated[index][field] = !updated[index][field];
    setRoles(updated);
  };

  return (
    <div className="settings-section">
      <h3>Role Management</h3>

      <table className="role-table">
        <thead>
          <tr>
            <th>Role</th>
            <th>View</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, i) => (
            <tr key={i}>
              <td>{role.name}</td>
              <td><input type="checkbox" checked={role.view} onChange={() => togglePermission(i, "view")} /></td>
              <td><input type="checkbox" checked={role.edit} onChange={() => togglePermission(i, "edit")} /></td>
              <td><input type="checkbox" checked={role.delete} onChange={() => togglePermission(i, "delete")} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleManagement;