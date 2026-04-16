import React, { useState } from "react";
import "./LoanApplication.css";
import { FaPlusCircle } from "react-icons/fa";

const LoanApplication = () => {
  const [search, setSearch] = useState("");
  const [selectedLender, setSelectedLender] = useState(null);
  const [step, setStep] = useState(1);

  const [loanDetails, setLoanDetails] = useState({
    amount: "",
    purpose: "",
    tenure: 12,
    rate: 10,
  });

  const lenders = [
    { id: 1, name: "State Bank of India (SBI)", type: "Bank" },
    { id: 2, name: "HDFC Bank", type: "Bank" },
    { id: 3, name: "ICICI Bank", type: "Bank" },
    { id: 4, name: "Kotak Mahindra Bank", type: "Bank" },
    { id: 5, name: "Bajaj Finance", type: "NBFC" },
    { id: 6, name: "Tata Capital", type: "NBFC" },
  ];

  // EMI Calculation
  const calculateEMI = () => {
    const P = parseFloat(loanDetails.amount);
    const R = parseFloat(loanDetails.rate) / 12 / 100;
    const N = parseInt(loanDetails.tenure);
    if (!P || !R || !N) return 0;
    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    return emi.toFixed(2);
  };

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="loan-wrapper">
      <div className="loan-container">
        {/* LEFT SIDEBAR */}
        <div className="loan-left">
          <h3 className="left-title">Loan Menu</h3>
          <ul className="loan-menu">
            <li className="active"><FaPlusCircle /> Apply Loan</li>
          </ul>

          <input
            type="text"
            placeholder="Search Bank / NBFC..."
            className="search-box"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="lender-list">
            {lenders
              .filter((l) => l.name.toLowerCase().includes(search.toLowerCase()))
              .map((lender) => (
                <div
                  key={lender.id}
                  className={`lender-card ${selectedLender?.id === lender.id ? "active" : ""}`}
                  onClick={() => { setSelectedLender(lender); setStep(1); }}
                >
                  <h4>{lender.name}</h4>
                  <p>{lender.type}</p>
                </div>
              ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="loan-right">
          {!selectedLender ? (
            <div className="placeholder">
              <h2>Select a lender to apply loan</h2>
            </div>
          ) : (
            <>
              <h2 className="main-title">Loan Application — {selectedLender.name}</h2>

              <div className="loan-form">
                {/* Stepper Navigation */}
                <div className="stepper">
                  <span className={step >= 1 ? "active-step" : ""}>1. Details</span>
                  <span className={step >= 2 ? "active-step" : ""}>2. EMI</span>
                  <span className={step >= 3 ? "active-step" : ""}>3. Upload</span>
                </div>

                {/* Step 1 – Loan Details */}
                {step === 1 && (
                  <>
                    <label>Loan Amount</label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={loanDetails.amount}
                      onChange={(e) => setLoanDetails({ ...loanDetails, amount: e.target.value })}
                    />

                    <label>Loan Purpose</label>
                    <input
                      type="text"
                      placeholder="Ex: Personal, Education..."
                      value={loanDetails.purpose}
                      onChange={(e) => setLoanDetails({ ...loanDetails, purpose: e.target.value })}
                    />

                    <label>Tenure (months)</label>
                    <input
                      type="number"
                      value={loanDetails.tenure}
                      onChange={(e) => setLoanDetails({ ...loanDetails, tenure: e.target.value })}
                    />

                    <label>Interest Rate (%)</label>
                    <input
                      type="number"
                      value={loanDetails.rate}
                      onChange={(e) => setLoanDetails({ ...loanDetails, rate: e.target.value })}
                    />

                    <button className="submit-btn" onClick={handleNext}>Next →</button>
                  </>
                )}

                {/* Step 2 – EMI Calculator */}
                {step === 2 && (
                  <>
                    <h3>Auto EMI Calculator</h3>
                    <p>Loan Amount: ₹{loanDetails.amount}</p>
                    <p>Tenure: {loanDetails.tenure} months</p>
                    <p>Interest Rate: {loanDetails.rate}%</p>
                    <h4>Estimated EMI: ₹{calculateEMI()}</h4>

                    <div className="step-buttons">
                      <button onClick={handlePrev}>← Back</button>
                      <button onClick={handleNext}>Next →</button>
                    </div>
                  </>
                )}

                {/* Step 3 – Upload Documents */}
                {step === 3 && (
                  <>
                    <label>Upload Documents</label>
                    <input type="file" multiple />

                    <div className="step-buttons">
                      <button onClick={handlePrev}>← Back</button>
                      <button className="submit-btn">Submit Application</button>
                    </div>

                    <p style={{ marginTop: "10px", color: "#666" }}>
                      Admin will review and approve your loan.
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;