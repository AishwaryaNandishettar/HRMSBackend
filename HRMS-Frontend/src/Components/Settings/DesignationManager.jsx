import React, { useState, useEffect } from "react";
import {
  getDesignations,
  addDesignation,
  deleteDesignation,
} from "../../Services/designationService";

const DesignationManager = () => {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
  loadDesignations();
}, []);

const loadDesignations = async () => {
  const res = await getDesignations();
  setList(res.data || []);
};

  const handleAdd = async () => {
  if (!name) return;

  const res = await addDesignation({ name });
  setList([...(list || []), res.data]);
  setName("");
   setDesignation("")};

 const handleDelete = async (id) => {
  await deleteDesignation(id);
  setList(list.filter((d) => d.id !== id));
};

  return (
    <div className="settings-section">
      <h3>Designations</h3>

      <div className="inline-form">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add designation"
        />
        <button className="add-btn" onClick={handleAdd}>Add</button>
      </div>

      <ul className="list-box">
        {list.map((d) => (
          <li key={d.id}>
            {d.name}
            <button onClick={() => handleDelete(d.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DesignationManager;