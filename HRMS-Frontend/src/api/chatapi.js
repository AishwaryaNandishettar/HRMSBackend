import axios from "axios";
const API = `${import.meta.env.VITE_API_BASE_URL}/api/chat`;

export const fetchChatMessages = async (sender, receiver, token) => {
  const res = await axios.get(`${API}/history`, {
    params: { sender, receiver },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
