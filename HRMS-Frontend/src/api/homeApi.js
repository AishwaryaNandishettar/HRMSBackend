import axios from "axios"; // ✅ REQUIRED

export const getHomeData = async (role) => {
  const token = localStorage.getItem("token"); // ✅ get token

  const res = await axios.get(`/api/home?role=${role}`, {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ send token
    },
  });

  return res.data;
};

export const fetchHomeData = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get("/api/home/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
