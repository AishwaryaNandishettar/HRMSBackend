import React, { useState } from "react";
import { saveCompany } from "../../Services/companyService";
//import "./CompanyForm.css"; // Add this import
const CompanyForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle form submission
  const handleSave = () => {
    saveCompany(form)
      .then((res) => {
        console.log("Saved:", res.data);
        alert("Company saved successfully!");
      })
      .catch((err) => {
        console.error(err);
        alert("Error saving company");
      });
  };

  return (
    <div className="settings-section">
      <h3>Company Profile</h3>

      <div className="form-group">
        <label>Company Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter company name"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Company Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter company email"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Address</label>
        <textarea
          name="address"
          placeholder="Enter address"
          value={form.address}
          onChange={handleChange}
        />
      </div>

      <button className="save-btn" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default CompanyForm;