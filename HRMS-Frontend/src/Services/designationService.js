import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/designations`;

export const getDesignations = () => axios.get(BASE_URL);

export const addDesignation = (data) => axios.post(BASE_URL, data);

export const deleteDesignation = (id) =>
  axios.delete(`${BASE_URL}/${id}`);