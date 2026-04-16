import React, { useState } from "react";
import "./PersonalInsurance.css";

const PersonalInsurance = () => {
  const [activeTab, setActiveTab] = useState("apply");
  const [company, setCompany] = useState("LIC");

  const licPlans = [
    {
      name: "Health Shield Plan",
      premium: "₹799 / month",
      coverage: "₹5,00,000 Coverage",
      benefits: [
        "Cashless Hospitals",
        "Family Coverage",
        "No Claim Bonus"
      ]
    },
    {
      name: "Family Secure Plan",
      premium: "₹1299 / month",
      coverage: "₹10,00,000 Coverage",
      benefits: [
        "Free Annual Checkup",
        "Daycare Coverage",
        "Maternity Benefits"
      ]
    }
  ];

  const insuranceHistory = [
    {
      policyName: "Health Shield Plan",
      company: "LIC of India",
      premium: "₹799",
      start: "01 Jan 2024",
      expiry: "01 Jan 2025",
      status: "Expired"
    },
    {
      policyName: "Family Secure Plan",
      company: "LIC of India",
      premium: "₹1299",
      start: "01 Jan 2025",
      expiry: "01 Jan 2026",
      status: "Active"
    }
  ];

  const currentPlan = {
    policyName: "Family Secure Plan",
    company: "LIC of India",
    premium: "₹1299 / month",
    coverage: "₹10,00,000 Coverage",
    startDate: "01 Jan 2025",
    expiryDate: "01 Jan 2026",
    benefits: [
      "Free Annual Checkup",
      "Daycare Coverage",
      "Maternity Benefits"
    ]
  };

  return (
    <div className="insurance-page">
      <h2 className="insurance-title">Personal Insurance</h2>

      {/* Tabs */}
      <div className="insurance-tabs">
        <button
          className={`insurance-tab-btn ${
            activeTab === "apply" ? "active" : ""
          }`}
          onClick={() => setActiveTab("apply")}
        >
          Apply Insurance
        </button>

        <button
          className={`insurance-tab-btn ${
            activeTab === "history" ? "active" : ""
          }`}
          onClick={() => setActiveTab("history")}
        >
          Insurance History
        </button>

        <button
          className={`insurance-tab-btn ${
            activeTab === "current" ? "active" : ""
          }`}
          onClick={() => setActiveTab("current")}
        >
          Current Plan
        </button>
      </div>

      {/* APPLY */}
      {activeTab === "apply" && (
        <div className="insurance-section">
          <h3>Select Insurance Company</h3>

          <div className="insurance-company-buttons">
            <button
              className={
                company === "LIC"
                  ? "insurance-company-btn selected"
                  : "insurance-company-btn"
              }
              onClick={() => setCompany("LIC")}
            >
              LIC of India
            </button>

            <button
              className={
                company === "HDFC"
                  ? "insurance-company-btn selected"
                  : "insurance-company-btn"
              }
              onClick={() => setCompany("HDFC")}
            >
              HDFC Ergo
            </button>
          </div>

          <h3>{company} Plans</h3>

          <div className="insurance-plans-grid">
            {licPlans.map((plan, idx) => (
              <div key={idx} className="insurance-plan-card">
                <h4>{plan.name}</h4>
                <p><b>Premium:</b> {plan.premium}</p>
                <p><b>Coverage:</b> {plan.coverage}</p>
                <ul>
                  {plan.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3>Upload Required Documents</h3>

          <div className="insurance-upload-section">
            <label>Aadhaar:</label>
            <input type="file" />

            <label>PAN:</label>
            <input type="file" />

            <label>Photo:</label>
            <input type="file" />
          </div>

          <button className="insurance-submit-btn">
            Submit Insurance Application
          </button>
        </div>
      )}

      {/* HISTORY */}
      {activeTab === "history" && (
        <div className="insurance-section">
          <h3>Insurance History</h3>

          <table className="insurance-history-table">
            <thead>
              <tr>
                <th>Policy Name</th>
                <th>Company</th>
                <th>Premium</th>
                <th>Start Date</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Renew</th>
              </tr>
            </thead>
            <tbody>
              {insuranceHistory.map((h, index) => (
                <tr key={index}>
                  <td>{h.policyName}</td>
                  <td>{h.company}</td>
                  <td>{h.premium}</td>
                  <td>{h.start}</td>
                  <td>{h.expiry}</td>
                  <td
                    className={
                      h.status === "Active"
                        ? "insurance-status-active"
                        : "insurance-status-expired"
                    }
                  >
                    {h.status}
                  </td>
                  <td>
                    {h.status === "Expired" ? (
                      <button className="insurance-renew-btn">
                        Renew
                      </button>
                    ) : (
                      "Active"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CURRENT PLAN */}
      {activeTab === "current" && (
        <div className="insurance-section">
          <h3>Current Active Insurance Plan</h3>

          <div className="insurance-current-card">
            <h4>{currentPlan.policyName}</h4>
            <p><b>Company:</b> {currentPlan.company}</p>
            <p><b>Premium:</b> {currentPlan.premium}</p>
            <p><b>Coverage:</b> {currentPlan.coverage}</p>
            <p><b>Start Date:</b> {currentPlan.startDate}</p>
            <p><b>Expiry:</b> {currentPlan.expiryDate}</p>

            <ul>
              {currentPlan.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            <button className="insurance-renew-btn">
              Renew Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInsurance;