import axios from "./axios";

const API = `${import.meta.env.VITE_API_BASE_URL}/api/financial`;


export const getTrendData = () => axios.get(`${API}/trend`);

export const addFinancialData = (data) =>
  axios.post(`${API}`, data);