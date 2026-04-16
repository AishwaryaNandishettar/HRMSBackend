import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/departments`;

export const getDepartments = () => axios.get(BASE_URL);

export const createDepartment = (data) => axios.post(BASE_URL, data);

export const deleteDepartment = (id) =>
  axios.delete(`${BASE_URL}/${id}`);