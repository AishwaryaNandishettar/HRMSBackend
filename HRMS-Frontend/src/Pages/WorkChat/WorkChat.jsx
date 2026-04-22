import { useContext, useEffect, useRef, useState } from "react";
import "./WorkChat.css";

import { AuthContext } from "../../Context/Authcontext";
import { useCall } from "../../Context/CallContext";

/* COMPONENTS */
import ChatSidebar from "./Compo/ChatSidebar";
import ChatHeader from "./Compo/ChatHeader";
import ChatMessages from "./Compo/ChatMessages";
import ChatComposer from "./Compo/ChatComposer";
import CreateGroupModal from "./Compo/CreateGroupModal";
import GroupMembersPanel from "./Compo/GroupMemberPanel";
import CallScreen from "./Compo/CallScreen";

/* 🆕 MEETINGS */
import MeetingsContainer from "./Compo/Meetings/MeetingsContainer";

/* SOCKET */
import {
  connectSocket,
  sendMessageWS,
  subscribeToGroup,
  sendGroupMessageWS,
  sendCallSignal
} from "../../api/socket";
import TokenManager from "../../Utils/tokenManager";

/* API */
import { fetchChatMessages } from "../../api/chatapi";
import { fetchChatUsers } from "../../api/chatUsersApi";
import {
  fetchMyGroups,
  fetchGroupMessages,
} from "../../api/GroupChatApi";

export default function WorkChat() {
  const { user, token } = useContext(AuthContext);
  
  // Use global call context
  const { call, incomingCall, callState, startCall, endCall, acceptCall, rejectCall } = useCall();

  // Try multiple ways to get the logged-in user's email
  const LOGGED_IN_EMAIL = (() => {
    if (user?.email) return user.email.trim().toLowerCase();
    if (user?.userEmail) return user.userEmail.trim().toLowerCase();
    
    try {
      const storedUser = localStorage.getItem('loggedUser');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const email = parsed.email || parsed.userEmail;
        return email ? email.trim().toLowerCase() : null;
      }
    } catch (e) {
      console.error('Error parsing stored user:', e);
    }
    return null;
  })();
  
  const TOKEN = token;

  // Early return if no user email is available
  if (!LOGGED_IN_EMAIL) {
    console.error('❌ No user email available. User must be logged in.');
    return (
      <div className="wc-root modern-bg">
        <div className="wc-empty">
          Please log in to access Work Chat
        </div>
      </div>
    );
  }

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const [msgSearch, setMsgSearch] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showMeetings, setShowMeetings] = useState(false);

  const selectedChatRef = useRef(null);
  const socketConnectedForChat = useRef(false);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
    setShowMembers(false);
  }, [selectedChat]);

  // Connect WebSocket for chat messages (CallContext handles call signals)
 useEffect(() => {
  if (!TOKEN || !LOGGED_IN_EMAIL || socketConnectedForChat.current) return;

  const connectForChat = async () => {
    try {
      const activeToken = await TokenManager.getValidToken();

      await connectSocket(
        LOGGED_IN_EMAIL,
        activeToken,

        (incomingMsg) => {
          const current = selectedChatRef.current;
          if (!current || current.type !== "USER") return;

          const isCurrentChat =
            (incomingMsg.senderEmail === LOGGED_IN_EMAIL &&
              incomingMsg.receiverEmail === current.email) ||
            (incomingMsg.senderEmail === current.email &&
              incomingMsg.receiverEmail === LOGGED_IN_EMAIL);

          if (!isCurrentChat) return;

          // ❌ prevent duplicate
          if (incomingMsg.senderEmail === LOGGED_IN_EMAIL) return;

          setMessages((prev) => [...prev, incomingMsg]);
        },

        () => {}, // onTask
        () => {}, // onStatus
        () => {}  // onChat
      );

      socketConnectedForChat.current = true;

    } catch (error) {
      console.error("WebSocket error:", error);
    }
  };

  connectForChat();
}, [TOKEN, LOGGED_IN_EMAIL]);


  useEffect(() => {
    if (!TOKEN || !LOGGED_IN_EMAIL) return;
    fetchChatUsers(TOKEN)
      .then((data) =>
        setUsers(data.filter((u) => u.email !== LOGGED_IN_EMAIL))
      )
      .catch(() => setUsers([]));
  }, [TOKEN, LOGGED_IN_EMAIL]);

  useEffect(() => {
  // Only request if not already decided (not granted and not denied)
  if (Notification.permission === "default") {
    Notification.requestPermission().catch(() => {});
  }
}, []);
  useEffect(() => {
    if (!TOKEN) return;
    fetchMyGroups(TOKEN)
      .then((data) => setGroups(data || []))
      .catch(() => setGroups([]));
  }, [TOKEN]);

  useEffect(() => {
    if (!selectedChat || selectedChat.type !== "USER" || !TOKEN) return;
    setMessages([]);
    fetchChatMessages(
      LOGGED_IN_EMAIL,
      selectedChat.email,
      TOKEN
    )
      .then(setMessages)
      .catch(() => setMessages([]));
  }, [selectedChat, TOKEN, LOGGED_IN_EMAIL]);

useEffect(() => {
  if (!selectedChat || selectedChat.type !== "GROUP" || !TOKEN) return;

  setMessages([]);

  fetchGroupMessages(selectedChat.id, TOKEN)
    .then(setMessages)
    .catch(() => setMessages([]));

  // 🔥 subscribe ONCE and cleanup
  const unsubscribe = subscribeToGroup(selectedChat.id, (groupMsg) => {
    setMessages((prev) =>
      prev.some((m) => m.id === groupMsg.id)
        ? prev // ❌ prevent duplicate
        : [...prev, groupMsg]
    );
  });

  return () => {
    // 🔥 VERY IMPORTANT (prevents duplicate subscriptions)
    if (unsubscribe) unsubscribe();
  };

}, [selectedChat?.id]);  // ✅ ONLY depend on group id

const sendMessage = async (text, files) => {
  if (!selectedChat) return;

  /* =========================
     🔥 GROUP CHAT (FIXED)
  ========================= */
  if (selectedChat.type === "GROUP") {

    const tempMessage = {
      // id: Date.now(),
      groupId: selectedChat.id,
      senderEmail: LOGGED_IN_EMAIL,
      senderName: user?.name || LOGGED_IN_EMAIL,
      content: text,
      id: "temp-" + Date.now(),
timestamp: new Date().toISOString(),
    };

    

    // ✅ SEND VIA SOCKET
    sendGroupMessageWS({
      groupId: selectedChat.id,
      senderEmail: LOGGED_IN_EMAIL,
      senderName: user?.name || LOGGED_IN_EMAIL,
      content: text,
    });

    return;
  }

  /* =========================
     🔥 PRIVATE CHAT (YOUR OLD)
  ========================= */
  const tempMessages = [];

  if (files && files.length > 0) {
    files.forEach((file) => {
      tempMessages.push({
        senderEmail: LOGGED_IN_EMAIL,
        receiverEmail: selectedChat.email,
        content: text || "",
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileType: file.type,
        timestamp: new Date().toISOString(),
      });
    });
  } else if (text.trim()) {
    tempMessages.push({
      senderEmail: LOGGED_IN_EMAIL,
      receiverEmail: selectedChat.email,
      content: text,
      timestamp: new Date().toISOString(),
    });
  }

  setMessages((prev) => [...prev, ...tempMessages]);

  try {
    if (files && files.length > 0) {
      const formData = new FormData();

      formData.append("senderEmail", LOGGED_IN_EMAIL);
      formData.append("receiverEmail", selectedChat.email);
      formData.append("text", text || "");

      files.forEach((f) => formData.append("files", f));

      await fetch(`${import.meta.env.VITE_API_URL}/chat/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
        body: formData,
      });
    } else {
      sendMessageWS({
        senderEmail: LOGGED_IN_EMAIL,
        receiverEmail: selectedChat.email,
        content: text,
      });
    }
  } catch (err) {
    console.error("Send failed", err);
  }
};

  /* 📞 CALL FUNCTIONS - Now using global context */
  const handleStartCall = (type) => {
    if (!selectedChat || selectedChat.type !== "USER") {
      alert('Please select a user to call');
      return;
    }

    startCall(type, {
      email: selectedChat.email,
      name: selectedChat.name || selectedChat.email
    });
  };

  const filteredMessages = messages.filter((m) =>
    m.content?.toLowerCase().includes(msgSearch.toLowerCase())
  );

  /* ========== RENDER ========== */
  return (
    <div className="wc-root modern-bg">
      {/* 📞 CALL SCREEN - Shows when there's an active call */}
      {(call || incomingCall) && (
        <CallScreen
          user={call?.user || {
            email: incomingCall?.fromEmail,
            name: incomingCall?.fromName || incomingCall?.fromEmail
          }}
          type={call?.type || incomingCall?.type}
          onEnd={call ? endCall : rejectCall}
          onAccept={!call && incomingCall ? acceptCall : undefined}
          onReject={!call && incomingCall ? rejectCall : undefined}
          isInitiator={call?.isInitiator || false}
          callId={call?.callId || incomingCall?.callId}
          waitingForAccept={call?.waitingForAccept || (!!incomingCall && !call)}
          callState={callState}
          currentUserEmail={LOGGED_IN_EMAIL}
          onSignal={(signal) => {
            const toEmail = call?.user?.email || incomingCall?.fromEmail;
            if (!toEmail) {
              console.warn('Unable to send signal, missing recipient email', { signal, call, incomingCall });
              return;
            }
            console.log('📡 Sending WebRTC signal via WebSocket:', signal);
            sendCallSignal({
              ...signal,
              fromEmail: LOGGED_IN_EMAIL,
              toEmail
            });
          }}
        />
      )}

      {/* MAIN CHAT UI - Hidden during call */}
      {!call && (
        <>
          <ChatSidebar
            users={users}
            groups={groups}
            selectedChat={selectedChat}
            onSelectUser={setSelectedChat}
            onSelectGroup={setSelectedChat}
            onCreateGroup={() => setShowGroupModal(true)}
            onShowMeetings={() => setShowMeetings(true)}
          />

          <div className="wc-main">
            {selectedChat ? (
              <>
                <ChatHeader
                  chat={selectedChat}
                  user={selectedChat}
                  onCall={() => handleStartCall('voice')}
                  onVideoCall={() => handleStartCall('video')}
                  onShowMembers={() => setShowMembers(!showMembers)}
                  onSearch={setMsgSearch}
                  onStartVoiceCall={() => handleStartCall('voice')}
                  onStartVideoCall={() => handleStartCall('video')}
                  onOpenCalendar={() => setShowMeetings(true)}
                  onToggleMembers={() => setShowMembers(!showMembers)}
                  search={msgSearch}
                  callState={callState}
                />

                <ChatMessages messages={filteredMessages} loggedInEmail={LOGGED_IN_EMAIL} />

                <ChatComposer onSend={sendMessage} />

                {showMembers && selectedChat.type === "GROUP" && (
                  <GroupMembersPanel
                    group={selectedChat}
                    onClose={() => setShowMembers(false)}
                  />
                )}
              </>
            ) : (
              <div className="wc-empty">
                <p>Select a chat to start messaging</p>
              </div>
            )}
          </div>

      {showGroupModal && (
  <CreateGroupModal
    users={users}                 // ✅ REQUIRED
    token={TOKEN}                 // ✅ REQUIRED
    onCreated={(newGroup) => {    // ✅ MATCH PROP NAME
      setGroups((prev) => [...prev, newGroup]);
      setShowGroupModal(false);
    }}
    onClose={() => setShowGroupModal(false)}
  />
)}

          {showMeetings && (
            <MeetingsContainer onClose={() => setShowMeetings(false)} />
          )}
        </>
      )}
    </div>
  );
}