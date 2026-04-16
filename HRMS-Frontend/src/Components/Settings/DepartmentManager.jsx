import React, { useEffect, useState } from "react";
import {
  getDepartments,
  addDepartment,
  deleteDepartment,
} from "../../Services/settingsService";

const DepartmentManager = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data || []); // ✅ SAFE FIX
    } catch (err) {
      console.error(err);
      setDepartments([]); // ✅ SAFE FALLBACK
    }
  };

 const handleAdd = async () => {
  if (!name) return;

  try {
    const res = await addDepartment({ name, code: "GEN" });

    console.log("ADD RESPONSE:", res); // 🔥 DEBUG

    setDepartments([...(departments || []), res.data]);
    setName("");
  } catch (err) {
    console.error("ADD ERROR:", err.response || err);
  }
};

  const handleDelete = async (id) => {
    try {
      await deleteDepartment(id);
      setDepartments((departments || []).filter((d) => d.id !== id)); // ✅ SAFE FIX
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="settings-section">
      <h3>Departments</h3>

      <div className="inline-form">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add department"
        />
        <button className="add-btn" onClick={handleAdd}>Add</button>
      </div>

      <ul className="list-box">
        {(departments || []).map((d) => (   // ✅ SAFE FIX
          <li key={d.id}>
            {d.name}
            <button onClick={() => handleDelete(d.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentManager;