import axios from "axios";
export const getDepartments = () => {
  return axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/departments`);
};

export const addDepartment = (dept) => {
  return axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/departments`, dept);
};

export const deleteDepartment = (id) => {
  return axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/departments/${id}`);
};