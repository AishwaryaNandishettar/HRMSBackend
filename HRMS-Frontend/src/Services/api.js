import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// ✅ SUBMIT ONBOARDING
export const submitOnboarding = (data) =>
  API.post("/api/onboarding/submit", data);