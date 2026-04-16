import api from "./axios";

export const fetchMyProfile = async () => {
  try {
    const response = await api.get("/api/employee/me");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch profile");
  }
};

export const updateJobDetails = async (jobData) => {
  try {
    const response = await api.put("/api/employee/update-job", jobData);
    return response.data;
  } catch (error) {
    console.error("Job update error:", error);
    throw new Error("Failed to update job details");
  }
};