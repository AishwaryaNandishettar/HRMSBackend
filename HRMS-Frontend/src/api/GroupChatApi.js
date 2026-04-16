import axios from "axios";

/* =========================
   CREATE GROUP
========================= */
export const createGroup = async (payload, token) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/chat/groups/create`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

/* =========================
   FETCH MY GROUPS
========================= */
export const fetchMyGroups = async (token) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/chat/groups/my`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

/* =========================
   FETCH GROUP MESSAGES
========================= */
export const fetchGroupMessages = async (groupId, token) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/chat/groups/${groupId}/messages`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

/* =========================
   ADD MEMBERS (ADMIN ONLY)
========================= */
export const addGroupMembers = async (
  groupId,
  memberEmails,
  token
) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/chat/groups/${groupId}/members`,
    {
      members: memberEmails,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

/* =========================
   REMOVE MEMBER (ADMIN ONLY)
========================= */
export const removeGroupMember = async (
  groupId,
  email,
  token
) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_API_BASE_URL}/api/chat/groups/${groupId}/members/${email}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
