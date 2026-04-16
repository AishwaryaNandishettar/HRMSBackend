import api from "./axios";

// =====================
// JOB APIs
// =====================

// Get all jobs
export const getAllJobs = async () => {
  const res = await api.get("/api/jobs/all");
  return res.data;
};

// Create new job
export const createJob = async (data) => {
  const res = await api.post("/api/jobs/create", data);
  return res.data;
};

// Update full job
export const updateJob = async (id, data) => {
  const res = await api.put(`/api/jobs/${id}`, data);
  return res.data;
};

// Update ONLY status
export const updateJobStatus = async (id, status) => {
  const res = await api.put(`/api/jobs/status/${id}?status=${status}`);
  return res.data;
};

// Delete job
export const deleteJob = async (id) => {
  const res = await api.delete(`/api/jobs/${id}`);
  return res.data;
};

// Get single job
export const getJobById = async (id) => {
  const res = await api.get(`/api/jobs/${id}`);
  return res.data;
};