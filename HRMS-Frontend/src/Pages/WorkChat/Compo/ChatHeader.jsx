import {
  FaSearch,
  FaUsers,
  FaCalendarPlus,
  FaPhone,
  FaVideo,
  FaPhoneSlash,
  FaSpinner,
  FaWifi,
  FaExclamationTriangle
} from "react-icons/fa";

export default function ChatHeader({
  user,
  search,
  onSearch,
  onToggleMembers,
  onOpenCalendar,
  onStartVoiceCall,
  onStartVideoCall,
  callState = 'idle', // idle, calling, ringing, connected
  wsConnected = true // WebSocket connection status
}) {
  
  const getCallButtonState = () => {
    switch (callState) {
      case 'calling':
        return { disabled: true, icon: FaSpinner, title: 'Calling...', className: 'calling' };
      case 'ringing':
        return { disabled: true, icon: FaSpinner, title: 'Ringing...', className: 'ringing' };
      case 'connected':
        return { disabled: true, icon: FaPhoneSlash, title: 'In call', className: 'connected' };
      default:
        return { disabled: false, icon: null, title: '', className: '' };
    }
  };

  const callButtonState = getCallButtonState();
  const isCallActive = callState !== 'idle';

  return (
    <div className="wc-header">
      <div className="wc-header-left">
        <div className="wc-avatar">
          {user.name?.charAt(0).toUpperCase() || "#"}
        </div>
        <div>
          <div className="wc-header-title">
            {user.name}
            {/* WebSocket Status Indicator */}
            <span className={`ws-status ${wsConnected ? 'connected' : 'disconnected'}`} 
                  title={wsConnected ? 'Connected' : 'Connection lost - calls may not work'}>
              {wsConnected ? <FaWifi /> : <FaExclamationTriangle />}
            </span>
          </div>
          <div className="wc-header-sub">
            {user.type === "GROUP" ? "Group chat" : 
             callState === 'calling' ? 'Calling...' :
             callState === 'ringing' ? 'Ringing...' :
             callState === 'connected' ? 'In call' :
             "Direct message"}
          </div>
        </div>
      </div>

      <div className="wc-header-right">
        <div className="wc-msg-search">
          <FaSearch />
          <input
            placeholder="Search messages"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* 📞 VOICE CALL */}
        <button 
          title={callButtonState.title || "Voice Call"} 
          onClick={onStartVoiceCall}
          disabled={callButtonState.disabled}
          className={`call-btn voice-call ${callButtonState.className}`}
        >
          {callButtonState.icon ? <callButtonState.icon className="spinning" /> : <FaPhone />}
        </button>

        {/* 🎥 VIDEO CALL */}
        <button 
          title={callButtonState.title || "Video Call"} 
          onClick={onStartVideoCall}
          disabled={callButtonState.disabled}
          className={`call-btn video-call ${callButtonState.className}`}
        >
          {callButtonState.icon ? <callButtonState.icon className="spinning" /> : <FaVideo />}
        </button>

        {/* 🗓 CALENDAR */}
        <button 
          title="Meetings" 
          onClick={onOpenCalendar}
          disabled={isCallActive}
        >
          <FaCalendarPlus />
        </button>

        {/* 👥 GROUP MEMBERS */}
        {user.type === "GROUP" && (
          <button 
            title="Members" 
            onClick={onToggleMembers}
            disabled={isCallActive}
          >
            <FaUsers />
          </button>
        )}
      </div>
    </div>
  );
}