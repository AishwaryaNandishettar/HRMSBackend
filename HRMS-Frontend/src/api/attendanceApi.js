// src/api/attendanceApi.js
import api from "./axios";



/* ================= CHECK IN ================= */

// Check-In
export const checkIn = async (record) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return api.post("/api/attendance/checkin", {
    userId: user.id,   // ✅ FIXED
    date: record.date,
    checkIn: record.checkIn,
    locationIn: record.locationIn
  });
};


// Check-Out
export const checkOut = async (record) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return api.post("/api/attendance/checkout", {
    userId: user.id,   // ✅ FIXED
    date: record.date,
    checkOut: record.checkOut,
    locationOut: record.locationOut
  });
};

// Get My Attendance
// Get My Attendance
export const getMyAttendance = async (empId) => {
  const res = await fetch(`${BASE_URL}/api/attendance/my/${empId}`);
  return res.json();
};
/* ================= MANAGER APPROVAL ================= */
export const approveAttendance = async (empId, date) => {
  return api.put("/api/attendance/approve", { empId, date })
    .then(res => res.data);
};

/* ================= MANAGER CUSTOM MARK ================= */
export const managerMarkAttendance = async (record) => {
  // record: { empId, date, checkIn, checkOut, locationIn, locationOut, status }
  return api.post("/api/attendance/manager-mark", record)
    .then(res => res.data);
};

export const getAllAttendance = async () => {
  const res = await api.get("/api/attendance/all");
  return res.data;
};