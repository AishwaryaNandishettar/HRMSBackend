import api from "./axios";

export const submitOnboarding = async (payload) => {
  const res = await api.post("/api/onboarding/submit", payload);
  return res.data;
};
