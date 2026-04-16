import API from "./api";

// Invite Employee
export const inviteEmployee = (data) => {
  return API.post("/onboarding/invite", data);
};

// Submit onboarding form
export const submitOnboarding = (data) => {
  return API.post("/onboarding/submit", data);
};