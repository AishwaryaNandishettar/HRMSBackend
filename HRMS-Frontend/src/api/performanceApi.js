import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/performance`;

export const getPerformanceByEmployee = async (empId) => {
  const token = localStorage.getItem("token"); // or sessionStorage

  const res = await axios.get(`${BASE_URL}/${empId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};