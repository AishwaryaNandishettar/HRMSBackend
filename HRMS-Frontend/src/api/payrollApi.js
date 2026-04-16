import api from "./axios";
import axios from "axios";   // ✅ ADD THIS

const API = import.meta.env.VITE_API_BASE_URL;
export const getEmployeePayroll = (empCode) =>
  api.get(`/api/payroll/employee/${empCode}`);

export const createPayroll = (data) =>
  api.post("/api/payroll/create", data);

export const getPayrollData = () => {
  return api.get("/api/payroll");
};
// ✅ CREATE PAYROLL BATCH (MUST BE HERE)

export const createPayrollBatch = (data) => {
  return api.post("/api/payroll/batch", data);
};

export const processPayroll = (empId) => {
  return api.put(`/api/payroll/process/${empId}`);
};
export const processAllPayroll = () => {
  return api.put("/api/payroll/process-all");
};