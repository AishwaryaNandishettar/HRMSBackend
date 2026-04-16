import api from "./axios";

export const getReimbursements = () =>
  api.get("/api/reimbursements"); // ✅ FIXED

export const createReimbursement = (data) =>
  api.post("/api/reimbursements/create", data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

export const updateReimbursementStatus = (id, status) =>
  api.put(`/api/reimbursements/status/${id}?status=${status}`); // ✅ FIXED