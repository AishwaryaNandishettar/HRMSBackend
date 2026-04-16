
import React, { useState } from "react";
import "./CibilCheck.css"; // 

const CibilCheck = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [scoreData, setScoreData] = useState(null);

  const handleCheckScore = (e) => {
    e.preventDefault();
    const score = Math.floor(Math.random() * 300) + 550; // 550-850
    let status = "";
    if (score >= 750) status = "Excellent";
    else if (score >= 700) status = "Good";
    else if (score >= 650) status = "Fair";
    else status = "Poor";

    setScoreData({
      name: employeeName,
      email: employeeEmail,
      score,
      status,
      date: new Date().toLocaleDateString(),
    });
  };

  return (
    <div className="cibil-container">
      <h1 className="cibil-title">CIBIL Score Verification</h1>
      <p className="cibil-subtitle">
        Check the credit score of onboarding employees.
      </p>

      <form onSubmit={handleCheckScore} className="cibil-form">
        <label>Employee Name</label>
        <input
          type="text"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          required
        />

        <label>Employee Email</label>
        <input
          type="email"
          value={employeeEmail}
          onChange={(e) => setEmployeeEmail(e.target.value)}
          required
        />

        <label>PAN / Aadhaar Number</label>
        <input
          type="text"
          value={panNumber}
          onChange={(e) => setPanNumber(e.target.value)}
          required
        />

        <button type="submit">Check Score</button>
      </form>

      {scoreData && (
        <div className="cibil-result">
          <h2>{scoreData.name}</h2>
          <p>Email: {scoreData.email}</p>
          <p>
            Score: <span className={`status ${scoreData.status.toLowerCase()}`}>
              {scoreData.score} ({scoreData.status})
            </span>
          </p>
          <p>Checked On: {scoreData.date}</p>
        </div>
      )}

      <div className="cibil-history">
        <h3>Previously Checked Employees</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Score</th>
              <th>Status</th>
              <th>Checked On</th>
            </tr>
          </thead>
          <tbody>
            {scoreData && (
              <tr>
                <td>{scoreData.name}</td>
                <td>{scoreData.email}</td>
                <td>{scoreData.score}</td>
                <td>{scoreData.status}</td>
                <td>{scoreData.date}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CibilCheck;
