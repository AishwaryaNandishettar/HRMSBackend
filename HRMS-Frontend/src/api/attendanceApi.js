import api from "./axios";

/* ================= CHECK IN ================= */
export const checkIn = async (record) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return api.post("/api/attendance/checkin", {
    userId: user.id,
    date: record.date,
    checkIn: record.checkIn,
    locationIn: record.locationIn
  });
};

/* ================= CHECK OUT ================= */
export const checkOut = async (record) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return api.post("/api/attendance/checkout", {
    userId: user.id,
    date: record.date,
    checkOut: record.checkOut,
    locationOut: record.locationOut
  });
};

/* ================= GET MY ATTENDANCE ================= */
export const getMyAttendance = async (empId) => {
  const res = await api.get(`/api/attendance/my/${empId}`);
  return res.data;   // ✅ FIXED
};

/* ================= MANAGER APPROVAL ================= */
export const approveAttendance = async (empId, date) => {
  const res = await api.put("/api/attendance/approve", { empId, date });
  return res.data;   // ✅ FIXED
};

/* ================= MANAGER CUSTOM MARK ================= */
export const managerMarkAttendance = async (record) => {
  return api.post("/api/attendance/manager-mark", record)
    .then(res => res.data);
};

/* ================= GET ALL ================= */
export const getAllAttendance = async () => {
  const res = await api.get("/api/attendance/all");
  return res.data;
};