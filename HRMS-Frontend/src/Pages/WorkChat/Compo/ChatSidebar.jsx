import { useState, useMemo } from "react";
import {
  FaPlus,
  FaCog,
  FaBell,
  FaCalendarAlt,
  FaSearch,
  FaThumbtack
} from "react-icons/fa";

import "./ChatSidebar.css";

/* =========================
   AVATAR HELPERS
========================= */

const getInitials = (name) => {
  if (!name) return "??";

  const words = name.trim().split(" ").filter(Boolean);

  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();

  return (words[0][0] + words[1][0]).toUpperCase();
};

const getAvatarColor = (text) => {
  if (!text) return "#6b7280";

  const colors = [
    "#2563eb",
    "#7c3aed",
    "#059669",
    "#ea580c",
    "#db2777",
    "#0ea5e9",
    "#16a34a",
    "#9333ea",
    "#f59e0b",
  ];

  let hash = 0;

  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

/* =========================
   TIME FORMAT
========================= */

const formatTime = (time) => {
  if (!time) return "";
  const date = new Date(time);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function ChatSidebar({
  users = [],
  groups = [],
  activities = [],
  selectedChat,
  onSelectUser,
  onSelectGroup,
  onCreateGroup,
}) {

  const [search, setSearch] = useState("");

  /* =========================
     MERGE USERS + GROUPS
  ========================= */

  const chats = useMemo(() => {

    const userChats = users.map((u) => ({
      ...u,
      type: "USER",
      id: u.email,
      name: u.name,
      pinned: u.pinned || false
    }));

    const groupChats = groups.map((g) => ({
      ...g,
      type: "GROUP",
      id: g.id,
      name: g.name,
      pinned: g.pinned || false
    }));

    return [...userChats, ...groupChats];

  }, [users, groups]);

  /* =========================
     SEARCH FILTER
  ========================= */

  const filteredChats = chats.filter((chat) =>
    chat?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const pinnedChats = filteredChats.filter((c) => c.pinned);
  const normalChats = filteredChats.filter((c) => !c.pinned);

  /* =========================
     SELECT CHAT
  ========================= */

  const handleSelect = (chat) => {
    if (chat.type === "USER") {
      onSelectUser(chat);
    } else {
      onSelectGroup(chat);
    }
  };

  return (
    <div className="chat-sidebar">

      {/* HEADER */}
      <div className="sidebar-header">
        <span>Work Chat</span>
        <FaPlus title="Create Group" onClick={onCreateGroup} />
      </div>

      {/* SEARCH */}
      <div className="sidebar-search">
        <FaSearch />
        <input
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ACTIVITY */}
      <div className="sidebar-label">Activity</div>

      {activities.map((activity, index) => (
        <div key={index} className="activity-item">

          <div className="activity-text">
            {activity.icon === "meeting" && <FaCalendarAlt />}
            {activity.icon === "notification" && <FaBell />}
            {activity.text}
          </div>

          <div className="activity-time">{activity.time}</div>

        </div>
      ))}

      {/* PINNED */}
      {pinnedChats.length > 0 && (
        <>
          <div className="sidebar-label">Pinned</div>

          {pinnedChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              selectedChat={selectedChat}
              onClick={handleSelect}
            />
          ))}
        </>
      )}

      {/* ALL CHATS */}
      <div className="sidebar-label">Chats</div>

      <div className="chat-list">

        {normalChats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            selectedChat={selectedChat}
            onClick={handleSelect}
          />
        ))}

      </div>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <FaCog title="Settings" />
      </div>

    </div>
  );
}

/* =========================
   CHAT ITEM
========================= */

function ChatItem({ chat, selectedChat, onClick }) {

  const isActive =
    selectedChat?.type === chat.type &&
    (selectedChat?.email === chat.email ||
      selectedChat?.id === chat.id);

  return (
    <div
      className={`chat-user ${isActive ? "active" : ""}`}
      onClick={() => onClick(chat)}
    >

      {/* AVATAR */}
      <div
        className="avatar"
        style={{ background: getAvatarColor(chat.name) }}
      >
        {getInitials(chat.name)}

        {/* ONLINE DOT */}
        {chat.type === "USER" && (
          <span
            className={`status-dot ${chat.online ? "online" : "offline"}`}
          />
        )}
      </div>

      {/* CHAT INFO */}
      <div className="info">

        <div className="top-row">

          <div className="name">{chat.name}</div>

          <div className="meta">

            {chat.pinned && <FaThumbtack className="pin-icon" />}

            <span className="time">
              {formatTime(chat.lastMessageTime)}
            </span>

          </div>

        </div>

        {/* LAST MESSAGE */}
        <div className="message-preview">
          {chat.lastMessage || "No messages yet"}
        </div>

      </div>

      {/* UNREAD */}
      {chat.unread > 0 && (
        <div className="unread-badge animate">
          {chat.unread}
        </div>
      )}

    </div>
  );
}