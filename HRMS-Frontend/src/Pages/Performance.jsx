import React, { useState , useEffect} from "react";
import styles from "./Performance.module.css";
import { getPerformanceByEmployee } from "../api/performanceApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { FaStar, FaChartBar, FaRocket, FaUser } from "react-icons/fa";

/* ===== MOCK LOGGED-IN USER ===== */
const currentUser = {
  id: "EMP002",
  name: "Sarah Lee",
  role: "manager",
};

/* ===== EMPLOYEE DATA ===== */
const allEmployees = [
  { id: "EMP001", name: "John Smith", manager: "EMP002" },
  { id: "EMP002", name: "Sarah Lee", manager: "EMP002" },
  { id: "EMP003", name: "David Kim", manager: "EMP002" },
];

/* ===== FILTER EMPLOYEES BASED ON ROLE ===== */
let visibleEmployees = [];

if (currentUser.role === "hr") {
  visibleEmployees = allEmployees;
} else if (currentUser.role === "manager") {
  visibleEmployees = allEmployees.filter(
    (emp) => emp.manager === currentUser.id
  );
} else {
  visibleEmployees = allEmployees.filter(
    (emp) => emp.id === currentUser.id
  );
}

/* ===== MOCK DATA ===== */
const performanceData = [
  { month: "Jan", rating: 3.5 },
  { month: "Feb", rating: 4.0 },
  { month: "Mar", rating: 4.2 },
  { month: "Apr", rating: 4.5 },
  { month: "May", rating: 4.1 },
  { month: "Jun", rating: 4.6 },
];

const overallScore = 4.3;

const parameters = [
  { name: "Technical Skills", weight: 25, score: 4.3 },
  { name: "Productivity", weight: 20, score: 4.5 },
  { name: "Quality of Work", weight: 15, score: 4.1 },
  { name: "Collaboration", weight: 10, score: 4.4 },
  { name: "Communication", weight: 10, score: 4.0 },
  { name: "Innovation", weight: 10, score: 3.9 },
  { name: "Leadership", weight: 10, score: 4.2 },
];

const getBand = (score) => {
  if (score >= 4.5) return "Outstanding";
  if (score >= 4.0) return "Exceeds Expectations";
  if (score >= 3.5) return "Meets Expectations";
  return "Needs Improvement";
};

const promotionReady = overallScore >= 4.5;

const Performance = () => {
  const [showParams, setShowParams] = useState(false);
const [data, setData] = useState(null);
const performanceData = data?.monthlyRatings || [];
const overallScore = data?.overallScore || 0;
const parameters = data?.parameters || [];
const reviews = data?.reviews || [];
  const [selectedEmp, setSelectedEmp] = useState(
    currentUser.role === "employee"
      ? currentUser.id
      : visibleEmployees[0]?.id
  );


  useEffect(() => {
  if (!selectedEmp) return;

  getPerformanceByEmployee(selectedEmp)
    .then(setData)
    .catch(console.error);
}, [selectedEmp]);
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Employee Performance Overview</h2>

      {/* KPI ROW */}
      <div className={styles.kpiRow}>
        
        <div className={`${styles.kpiCard} ${styles.blue}`}>
          <div>
            <p className={styles.kpiTitle}>Overall Rating</p>
            <div className={styles.kpiValue}>{overallScore} / 5</div>
          </div>
          <FaStar className={styles.kpiIcon} />
        </div>

        <div className={`${styles.kpiCard} ${styles.green}`}>
          <div>
            <p className={styles.kpiTitle}>Performance Band</p>
            <div className={styles.kpiValue}>{getBand(overallScore)}</div>
          </div>
          <FaChartBar className={styles.kpiIcon} />
        </div>

        <div className={`${styles.kpiCard} ${styles.red}`}>
          <div>
            <p className={styles.kpiTitle}>Promotion Status</p>
            <div className={styles.kpiValue}>
              {promotionReady ? "Ready" : "Not Ready"}
            </div>
          </div>
          <FaRocket className={styles.kpiIcon} />
        </div>

        <div className={`${styles.kpiCard} ${styles.blueLight}`}>
          <div>
            <p className={styles.kpiTitle}>Employee</p>

            <select
              className={styles.empFilter}
              value={selectedEmp}
              onChange={(e) => setSelectedEmp(e.target.value)}
              disabled={currentUser.role === "employee"}
            >
              {visibleEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.id} — {emp.name}
                </option>
              ))}
            </select>
          </div>
          <FaUser className={styles.kpiIcon} />
        </div>
      </div>

      {/* VIEW BUTTON */}
      <button
        className={styles.viewBtn}
        onClick={() => setShowParams(!showParams)}
      >
        View Performance Details
      </button>

      {/* PARAMETERS TABLE */}
      {showParams && (
        <div className={styles.card}>
          <h3>Performance Parameters</h3>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Weight</th>
                <th>Score</th>
                <th>Weighted %</th>
              </tr>
            </thead>
<tbody>
  {reviews.map((r, i) => (
    <tr key={i}>
      <td>{r.reviewer}</td>
      <td>{r.quarter}</td>
      <td>{r.rating}</td>
      <td>{r.comments}</td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      )}

      {/* CHART */}
      <div className={styles.card}>
        <h3>Monthly Performance Trend</h3>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* REVIEWS */}
      <div className={styles.card}>
        <h3>Recent Reviews</h3>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Reviewer</th>
              <th>Quarter</th>
              <th>Rating</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Manager</td>
              <td>Q1</td>
              <td>4.2</td>
              <td>Strong collaboration and delivery</td>
            </tr>
            <tr>
              <td>HR</td>
              <td>Q2</td>
              <td>4.5</td>
              <td>Consistent performance growth</td>
            </tr>
            <tr>
              <td>Self</td>
              <td>Q2</td>
              <td>4.3</td>
              <td>Improved technical ownership</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Performance;