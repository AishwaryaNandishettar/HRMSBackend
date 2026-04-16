import api from "./axios";

export const login = (data) => {
  return api.post("/api/auth/login", data);
};