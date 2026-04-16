import { useEffect, useRef } from "react";

export default function ChatMessages({ messages = [], loggedInEmail }) {
  const bottomRef = useRef(null);

  const getUserColor = (name = "") => {
    const colors = [
      "#4f46e5",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#3b82f6",
      "#ec4899",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash += name.charCodeAt(i);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="wc-messages">
     {messages.map((m, i) => {
  const isMe = m?.senderEmail === loggedInEmail;

  // ✅ DATE LOGIC
  const currentDate = m?.timestamp
    ? new Date(m.timestamp).toDateString()
    : "";

  const prevDate =
    i > 0 && messages[i - 1]?.timestamp
      ? new Date(messages[i - 1].timestamp).toDateString()
      : "";

  const showDate = currentDate !== prevDate;

  const userKey = m?.senderName || m?.senderEmail || "unknown";
     
  return (
  <>
    {/* ✅ DATE SEPARATOR */}
    {showDate && (
      <div
        style={{
          textAlign: "center",
          margin: "10px 0",
          fontSize: "12px",
          color: "#888",
        }}
      >
        {currentDate}
      </div>
    )}

    <div
      key={i}
      className={`wc-message ${isMe ? "me" : "them"}`}
      style={{
        display: "flex",
        justifyContent: isMe ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          background: isMe ? "#4f46e5" : "#e5e7eb",
          color: isMe ? "#fff" : "#111",
          borderRadius: "12px",
          padding: "10px 14px",
          maxWidth: "65%",
          borderLeft: `4px solid ${getUserColor(userKey)}`,
        }}
      >
        {m?.content}

        <div
          style={{
            fontSize: "10px",
            marginTop: "5px",
            opacity: 0.7,
          }}
        >
          {m?.timestamp
            ? new Date(m.timestamp).toLocaleTimeString()
            : ""}
        </div>
      </div>
    </div>
  </>
);
      })}

      <div ref={bottomRef} />
    </div>
  );
} 