import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/reports`;

// GET ALL REPORT DATA
export const getReports = async () => {
  return await axios.get(BASE_URL);
};