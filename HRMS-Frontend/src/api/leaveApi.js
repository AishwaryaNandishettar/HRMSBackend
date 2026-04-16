import api from "./axios";

const BASE_URL = "/api/leave";

// Apply Leave
export const applyLeave = (data) => {
  return api.post(`${BASE_URL}/apply`, data);
};

// Get My Leaves
export const getMyLeaves = (userId) => {
  return api.get(`${BASE_URL}/my/${userId}`);
};

// Get All Leaves (used earlier)
export const getLeaves = () => {
  return api.get(`${BASE_URL}/all`);
};

// Get All Leaves (duplicate but keeping as you used it)
export const getAllLeaves = () => {
  return api.get(`${BASE_URL}/all`);
};

// Update Leave Status
export const updateLeaveStatus = (id, status) =>
  api.put(`/api/leave/${id}/status?status=${status}`);