import axios from "axios";
import API from "../api/api"; // import centralized Axios instance

// Backend base URL
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/company`;

// Save new company or update existing
export const saveCompany = (companyData) => {
  return axios.post(API_URL, companyData);
};

// Fetch company by ID (optional, for edit / prefill form)
export const getCompanyById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};