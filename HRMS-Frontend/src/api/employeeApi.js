// api/employeeApi.js
import axios from "axios";

const API = `${import.meta.env.VITE_API_BASE_URL}`;

// ✅ GET ALL EMPLOYEES

export const getAllEmployees = async () => {
  const token = localStorage.getItem("token");

 // return await axios.get("http://localhost:8082/api/employees", {
 // ✅ CORRECT
return await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/employee/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ✅ GET BIRTHDAYS (ONLY THIS ONE KEEP)
export const getBirthdays = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `${API}/api/employee/birthdays/current-month`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};


export const fetchEmployeesAsUsers = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/employee/as-users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const fetchAllParticipants = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/employee/participants`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const searchParticipants = async (query) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/employee/participants/search`, {
    params: { query: query || "" },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const fetchAllEmployees = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/employee/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};