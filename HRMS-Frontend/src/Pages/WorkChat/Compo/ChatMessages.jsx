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
        const isMe =
          m?.senderEmail?.toLowerCase() ===
          loggedInEmail?.toLowerCase();

        // ✅ FIX: support both timestamp & createdAt
        const msgTime = m?.timestamp || m?.createdAt;

        // ✅ DATE LOGIC FIXED
        const currentDate = msgTime
          ? new Date(msgTime).toDateString()
          : "";

        const prevMsg = messages[i - 1];
        const prevTime = prevMsg?.timestamp || prevMsg?.createdAt;

        const prevDate = prevTime
          ? new Date(prevTime).toDateString()
          : "";

        const showDate = currentDate !== prevDate;

        const userKey =
          m?.senderName || m?.senderEmail || "unknown";

        return (
          <div key={m.id || `${m.senderEmail}-${msgTime}-${i}`}>
            {/* DATE */}
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

            {/* MESSAGE */}
            <div
              className={`wc-message ${isMe ? "me" : "them"}`}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  background: isMe ? "#f4f6fa" : "#f3f4f6",
                  color: "#111",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  maxWidth: "65%",
                  borderLeft: `4px solid ${getUserColor(userKey)}`,
                }}
              >
                {/* ✅ Sender name (group chat) */}
                {!isMe && (
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#555",
                      marginBottom: "4px",
                    }}
                  >
                    {m.senderName || m.senderEmail?.split("@")[0]}
                  </div>
                )}

                {/* TEXT */}
                {m?.content && <div>{m.content}</div>}

                {/* FILE */}
                {m?.fileUrl && (
                  <div
                    style={{
                      marginTop: "8px",
                      padding: "8px",
                      borderRadius: "10px",
                      background: "#fff",
                      border: "1px solid #ddd",
                    }}
                  >
                    {m.fileType?.startsWith("image") ? (
                      <>
                        <img
                          src={
                            m.fileUrl.startsWith("blob:")
                              ? m.fileUrl
                              : `${import.meta.env.VITE_API_BASE_URL.replace(
                                  "/api",
                                  ""
                                )}${m.fileUrl}`
                          }
                          alt="img"
                          style={{
                            maxWidth: "200px",
                            borderRadius: "8px",
                          }}
                        />
                        <a
                          href={`${import.meta.env.VITE_API_BASE_URL.replace(
                            "/api",
                            ""
                          )}${m.fileUrl}`}
                          download
                          style={{
                            display: "block",
                            marginTop: "5px",
                            fontSize: "12px",
                            color: "#2563eb",
                          }}
                        >
                          ⬇ Download
                        </a>
                      </>
                    ) : (
                      <div style={{ display: "flex", gap: "8px" }}>
                        📄
                        <div>
                          <div style={{ fontSize: "13px" }}>
                            {m.fileName}
                          </div>
                          <a
                            href={`${import.meta.env.VITE_API_BASE_URL.replace(
                              "/api",
                              ""
                            )}${m.fileUrl}`}
                            download
                            style={{
                              fontSize: "12px",
                              color: "#2563eb",
                            }}
                          >
                            Download file
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ✅ TIME FIXED */}
                <div
                  style={{
                    fontSize: "10px",
                    marginTop: "5px",
                    opacity: 0.7,
                    textAlign: "right",
                  }}
                >
                  {msgTime &&
                    new Date(msgTime).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}