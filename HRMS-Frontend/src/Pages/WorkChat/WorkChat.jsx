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
  const { call, callState, startCall, endCall } = useCall();

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
    
    console.log('🔌 [WorkChat] Connecting WebSocket for chat messages');
    
    const connectForChat = async () => {
      try {
        await connectSocket(
          LOGGED_IN_EMAIL,
          TOKEN,
          
          (incomingMsg) => {
            // Handle incoming private messages
            const current = selectedChatRef.current;
            if (!current || current.type !== "USER") return;
            const isCurrentChat =
              (incomingMsg.senderEmail === LOGGED_IN_EMAIL &&
                incomingMsg.receiverEmail === current.email) ||
              (incomingMsg.senderEmail === current.email &&
                incomingMsg.receiverEmail === LOGGED_IN_EMAIL);
            if (!isCurrentChat) return;

             // ✅ ADD THIS BLOCK HERE (IMPORTANT POSITION)
  if (incomingMsg.senderEmail !== LOGGED_IN_EMAIL) {
    new Notification(
      `New message from ${incomingMsg.senderName || incomingMsg.senderEmail}`,
      {
        body: incomingMsg.content,
      }
    );
  }
            setMessages((prev) =>
              prev.some((m) => m.id === incomingMsg.id)
                ? prev
                : [...prev, incomingMsg]
            );
          },
          () => {}, // onTask
          () => {}, // onStatus
          () => {}  // onChat
        );
        socketConnectedForChat.current = true;
        console.log('✅ [WorkChat] WebSocket connected for chat');
      } catch (error) {
        console.error('❌ [WorkChat] Failed to connect WebSocket for chat:', error);
      }
    };
    
    connectForChat();
  }, [TOKEN, LOGGED_IN_EMAIL]);

  useEffect(() => {
    if (!TOKEN || !LOGGED_IN_EMAIL) return;
    fetchChatUsers(TOKEN)
      .then((data) => {
        // Filter out current user and remove duplicates by email
        const filtered = data.filter((u) => u.email !== LOGGED_IN_EMAIL);
        const uniqueUsers = filtered.reduce((acc, user) => {
          if (!acc.find(u => u.email === user.email)) {
            acc.push(user);
          }
          return acc;
        }, []);
        setUsers(uniqueUsers);
      })
      .catch(() => setUsers([]));
  }, [TOKEN, LOGGED_IN_EMAIL]);

  useEffect(() => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}, []);
  useEffect(() => {
    if (!TOKEN) return;
    fetchMyGroups(TOKEN)
      .then(setGroups)
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
    subscribeToGroup(selectedChat.id, (groupMsg) =>
      setMessages((prev) => [...prev, groupMsg])
    );
  }, [selectedChat, TOKEN]);

  const sendMessage = (text, file) => {
  if (!selectedChat) return;

  // ✅ If files exist → handle separately
  if (file && file.length > 0) {
    const formData = new FormData();
    formData.append("text", text);

    file.forEach((f) => {
      formData.append("files", f);
    });

    // 🔥 CALL YOUR API (NOT WebSocket)
    fetch("/chat", {
      method: "POST",
      body: formData,
    });

    return; // stop here
  }

  // ✅ TEXT MESSAGE (existing logic — unchanged)
  if (!text.trim()) return;

  if (selectedChat.type === "USER") {
    sendMessageWS({
      senderEmail: LOGGED_IN_EMAIL,
      receiverEmail: selectedChat.email,
      content: text,
    });
  } else {
    sendGroupMessageWS({
      groupId: selectedChat.id,
      senderEmail: LOGGED_IN_EMAIL,
      content: text,
    });
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
      {call && (
        <CallScreen
          user={call.user}
          type={call.type}
          onEnd={endCall}
          isInitiator={call.isInitiator}
          callId={call.callId}
          waitingForAccept={call.waitingForAccept}
          callState={callState}
          currentUserEmail={LOGGED_IN_EMAIL}
          onSignal={(signal) => {
            // Send WebRTC signals (OFFER/ANSWER/ICE_CANDIDATE) via WebSocket
            console.log('📡 Sending WebRTC signal via WebSocket:', signal);
            sendCallSignal({
              ...signal,
              fromEmail: LOGGED_IN_EMAIL,
              toEmail: call.user.email
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

                <ChatMessages messages={filteredMessages} currentUser={LOGGED_IN_EMAIL} />

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
              onClose={() => setShowGroupModal(false)}
              onGroupCreated={(newGroup) => {
                setGroups((prev) => [...prev, newGroup]);
                setShowGroupModal(false);
              }}
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