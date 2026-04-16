import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/tasks`;

export const getTasks = () => axios.get(BASE_URL);
export const createTaskApi = (task) => axios.post(BASE_URL, task);
export const updateTaskApi = (id, task) =>
  axios.put(`${BASE_URL}/${id}`, task);