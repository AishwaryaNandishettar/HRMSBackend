import axios from "axios";
const BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:8082";
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

/* =========================
   MARK GROUP MESSAGES AS SEEN
========================= */
export const markGroupMessagesSeen = async (groupId, token) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_BASE_URL}/api/chat/groups/${groupId}/seen`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

/* =========================
   FETCH UNREAD GROUPS COUNT
========================= */
export const fetchUnreadGroupsCount = async (token) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/chat/groups/unread-count`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

/* =========================
   FETCH UNREAD MESSAGES PER GROUP
========================= */
export const fetchUnreadMessagesPerGroup = async (token) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/chat/groups/unread-per-group`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

/* =========================
   LEAVE GROUP (any member)
========================= */
export const leaveGroup = async (groupId, token) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_API_BASE_URL}/api/chat/groups/${groupId}/leave`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

/* =========================
   UPDATE GROUP NAME (admin only)
========================= */
export const updateGroupName = async (groupId, name, token) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_BASE_URL}/api/chat/groups/${groupId}/name`,
    { name },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

/* =========================
   UPLOAD FILE TO GROUP
========================= */
export const uploadGroupFile = async (groupId, formData, token) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/chat/groups/${groupId}/upload`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }
  );
  if (!res.ok) throw new Error(`Group file upload failed: ${res.status}`);
  return res.json();
};
/* =========================
   FETCH UNREAD USERS COUNT
========================= */
export const fetchUnreadUsersCount = async (email, token) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/chat/unread-count?receiver=${email}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/* =========================
   FETCH UNREAD MESSAGES PER USER
========================= */
export const fetchUnreadMessagesPerUser = async (email, token) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/chat/unread-per-user?receiver=${email}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};