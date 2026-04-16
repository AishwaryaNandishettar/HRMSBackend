import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

/**
 * Fetch all available participants (users and employees)
 */
export const fetchAllParticipants = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/employee/participants`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching participants:", error);
    throw error;
  }
};

/**
 * Search participants by name, email, or department
 * @param {string} query - Search query
 */
export const searchParticipants = async (query) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/employee/participants/search`, {
      params: { query: query || "" },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Error searching participants:", error);
    throw error;
  }
};

/**
 * Get participant by email
 * @param {string} email - Email to search
 */
export const getParticipantByEmail = async (email) => {
  try {
    const participants = await searchParticipants(email);
    return participants.find(p => p.email === email);
  } catch (error) {
    console.error("Error getting participant by email:", error);
    throw error;
  }
};

/**
 * Validate participant exists in system
 * @param {string} email - Email to validate
 */
export const validateParticipant = async (email) => {
  try {
    const participant = await getParticipantByEmail(email);
    return !!participant;
  } catch (error) {
    console.error("Error validating participant:", error);
    return false;
  }
};
