import axios from "axios";

export const verifyOtp = (data) => {
  return axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/verify`, data);
};