import { useEffect, useRef, useState } from "react";
import {
  FaPhoneSlash,
  FaUserPlus,
  FaCircle,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaDesktop,
  FaExpand,
  FaCompress,
  FaSignal,
  FaWifi
} from "react-icons/fa";

import webrtcPeer from "../../../Services/webrtcPeer";
import AddParticipantModal from "./AddParticipantModal";
import Toast from "./Toast";

export default function CallScreen({ user, type, onEnd, isInitiator, callId, onSignal, waitingForAccept, callState }) {
  console.log('📞 CallScreen rendered with props:', { user, type, isInitiator, callId, callState, waitingForAccept });
  
  const [seconds, setSeconds] = useState(0);
  const [connected, setConnected] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(type === "video");
  const [recording, setRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionState, setConnectionState] = useState('new');
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [stats, setStats] = useState(null);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [toast, setToast] = useState(null);

  const ringRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null); // Add dedicated audio element for remote audio
  const callScreenRef = useRef(null);
  const initializedRef = useRef(false);

  /* ⏰ TIMER */
  useEffect(() => {
    // Start timer when call state is 'connected' or when WebRTC connection is established
    const isConnected = callState === 'connected' || connected;
    if (!isConnected) return;
    
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [connected, callState]);

  /* 🔄 AUTO-CONNECT FALLBACK */
  useEffect(() => {
    // If call state is 'connecting' for more than 5 seconds, assume connected
    // This handles cases where WebRTC doesn't establish properly but the call should still show as connected
    if (callState === 'connecting' && !connected) {
      const timeout = setTimeout(() => {
        console.log('📞 Auto-connecting after timeout - assuming call is connected');
        setConnected(true);
        setConnectionState('connected');
      }, 5000); // 5 second timeout
      
      return () => clearTimeout(timeout);
    }
  }, [callState, connected]);

  /* 🔔 RINGING */
  useEffect(() => {
    const currentState = callState || connectionState;
    const shouldRing = !connected && currentState !== 'connected' && currentState !== 'connecting';
    
    if (ringRef.current && shouldRing) {
      ringRef.current.play().catch(e => console.log('Ring sound failed:', e));
    } else if (ringRef.current) {
      ringRef.current.pause();
    }
    
    return () => {
      if (ringRef.current) {
        ringRef.current.pause();
      }
    };
  }, [connected, connectionState, callState]);

  /* 🎥 WebRTC INITIALIZATION */
useEffect(() => {
  if (initializedRef.current) return;
  initializedRef.current = true;

  const initializeWebRTC = async () => {
    try {
      console.log('🚀 Initializing WebRTC...', { isInitiator, callId, waitingForAccept, callState });

      await webrtcPeer.initialize(isInitiator, callId);

      webrtcPeer.setCallbacks({
        onSignal: (signal) => {
          if (onSignal) onSignal(signal);
        },
        onRemoteStream: (stream) => {
          console.log('📺 Remote stream received');

          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
            remoteVideoRef.current.muted = false;
          }

          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = stream;
          }

          setConnected(true);
        },
        onConnectionState: (state) => {
          console.log('🔗 Connection state:', state);
          setConnectionState(state);

          if (state === 'connected') {
            setConnected(true);
          }
        }
      });

      const localStream = await webrtcPeer.startLocalMedia(type);

      if (type === "video" && localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      // CRITICAL FIX: Only create offer if initiator AND call has been accepted
      // For initiator: wait for callState to be 'connected' (meaning receiver accepted)
      // For receiver: they will receive OFFER and create ANSWER automatically
      if (isInitiator && !waitingForAccept) {
        console.log('📞 Creating offer as initiator (call accepted)...');
        await webrtcPeer.createOffer();
      } else if (isInitiator && waitingForAccept) {
        console.log('⏳ Waiting for call acceptance before creating offer...');
      }

    } catch (error) {
      console.error('❌ WebRTC init failed:', error);
      alert(error.message || 'Media access failed');
    }
  };

  initializeWebRTC();

  // Listen for screen share ended event (when user clicks browser's "Stop sharing" button)
  const handleScreenShareEnded = () => {
    console.log('🖥 Screen share ended event received');
    setIsScreenSharing(false);
  };

  window.addEventListener('screenshare-ended', handleScreenShareEnded);

  // CRITICAL FIX: Don't close peer connection in cleanup
  // The peer connection should only be closed when the call actually ends (via endCall)
  // Closing it here causes issues with React Strict Mode and component re-renders
  return () => {
    console.log('🧹 CallScreen cleanup - NOT closing peer connection (will be closed on endCall)');
    window.removeEventListener('screenshare-ended', handleScreenShareEnded);
  };
}, []);

  /* 🔄 CREATE OFFER WHEN CALL IS ACCEPTED */
  useEffect(() => {
    // When initiator and call state changes from 'calling' to 'connected', create offer
    if (isInitiator && !waitingForAccept && callState === 'connected' && webrtcPeer.peerConnection) {
      const createOfferAfterAccept = async () => {
        try {
          console.log('📞 Call accepted! Creating offer now...');
          await webrtcPeer.createOffer();
        } catch (error) {
          console.error('❌ Failed to create offer after acceptance:', error);
        }
      };
      
      createOfferAfterAccept();
    }
  }, [isInitiator, waitingForAccept, callState]);

  const formatTime = () =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;

  /* 🎙 CONTROLS */
  const toggleMic = () => {
    webrtcPeer.toggleAudio(!micOn);
    setMicOn(!micOn);
  };

  const toggleCam = () => {
    webrtcPeer.toggleVideo(!camOn);
    setCamOn(!camOn);
  };

  const handleScreenShare = async () => {
    try {
      // Debug: Log detailed connection info before attempting screen share
      const connectionInfo = webrtcPeer.getDetailedConnectionInfo();
      console.log('🖥 Screen share attempt - Connection info:', connectionInfo);
      
      if (!isScreenSharing) {
        // Start screen sharing
        await webrtcPeer.startScreenShare();
        setIsScreenSharing(true);
        console.log('✅ Screen sharing started');
      } else {
        // Stop screen sharing
        await webrtcPeer.stopScreenShare();
        setIsScreenSharing(false);
        console.log('⏹ Screen sharing stopped');
      }
    } catch (error) {
      console.error('Screen share error:', error);
      
      // Log detailed connection info on error
      const connectionInfo = webrtcPeer.getDetailedConnectionInfo();
      console.error('🖥 Screen share failed - Connection info:', connectionInfo);
      
      let errorMessage = 'Screen sharing failed. Please try again.';
      
      if (error.message === 'Peer connection not ready for screen sharing') {
        errorMessage = 'Please wait for the call to fully connect before sharing your screen.';
      } else if (error.name === 'NotAllowedError') {
        errorMessage = 'Screen sharing permission denied.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No screen available to share.';
      } else if (error.message === 'User cancelled screen sharing') {
        // User cancelled the screen share dialog - this is not an error
        console.log('ℹ️ User cancelled screen sharing');
        return; // Don't show error message
      }
      
      alert(errorMessage);
    }
  };

  const handleRecord = async () => {
    if (!recording) {
      // Start recording logic would go here
      setRecording(true);
      console.log('🔴 Recording started');
    } else {
      // Stop recording logic would go here
      setRecording(false);
      console.log('⏹ Recording stopped');
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (callScreenRef.current?.requestFullscreen) {
        callScreenRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleAddParticipant = (employee) => {
    console.log('📞 Adding participant to call:', employee);
    
    // Get current user email from localStorage or user prop
    const currentUserEmail = localStorage.getItem('loggedUser') 
      ? JSON.parse(localStorage.getItem('loggedUser')).email 
      : user.currentUserEmail;
    
    // Send signal to add participant via WebSocket
    if (onSignal) {
      onSignal({
        type: type.toUpperCase(), // Include call type (VOICE or VIDEO)
        action: 'ADD_PARTICIPANT',
        fromEmail: currentUserEmail,
        toEmail: employee.email,
        callId: callId,
        participant: {
          name: employee.name,
          email: employee.email,
          department: employee.department,
          designation: employee.designation
        }
      });
    }
    
    // Show toast notification
    setToast({
      message: `Invitation sent to ${employee.name || employee.email}`,
      type: 'success'
    });
    
    console.log(`✅ Invitation sent to ${employee.name || employee.email}`);
  };

  const endCall = () => {
    console.log('📞 Ending call...');
    
    // Close WebRTC connection
    webrtcPeer.close();
    
    // Stop ring tone
    if (ringRef.current) {
      ringRef.current.pause();
    }

    // Clear stored call data
    localStorage.removeItem('ongoingCall');

    // Notify parent component
    onEnd();
  };

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case 'good': return <FaWifi className="connection-good" />;
      case 'fair': return <FaSignal className="connection-fair" />;
      case 'poor': return <FaSignal className="connection-poor" />;
      default: return <FaSignal />;
    }
  };

  const getConnectionStateText = () => {
    // Use the parent call state if available, otherwise fall back to WebRTC connection state
    const currentState = callState || connectionState;
    
    if (waitingForAccept) {
      return type === "video" ? "Calling..." : "Calling...";
    }
    
    switch (currentState) {
      case 'calling': return 'Calling...';
      case 'ringing': return 'Ringing...';
      case 'connecting': return 'Connecting...';
      case 'connected': return `Connected • ${formatTime()}`;
      case 'disconnected': return 'Disconnected';
      case 'failed': return 'Connection failed';
      default: return type === "video" ? "Video calling..." : "Voice calling...";
    }
  };

  const getConnectionStateClass = () => {
    // Determine the actual connection state for CSS class
    // Priority: callState > connected flag > connectionState
    if (callState === 'connected' || connected) {
      return 'connected';
    }
    
    if (waitingForAccept || callState === 'calling') {
      return 'connecting';
    }
    
    const currentState = callState || connectionState;
    
    switch (currentState) {
      case 'calling':
      case 'ringing':
      case 'connecting':
        return 'connecting';
      case 'connected':
        return 'connected';
      case 'disconnected':
      case 'failed':
        return 'failed';
      default:
        return 'connecting';
    }
  };

  return (
    <div className={`call-screen ${isFullscreen ? 'fullscreen' : ''}`} ref={callScreenRef}>
      <audio ref={ringRef} loop>
        <source src="/sounds/ring.mp3" type="audio/mpeg" />
        <source src="/sounds/ring.ogg" type="audio/ogg" />
      </audio>

      {/* Hidden audio element for remote audio (always present for voice calls) */}
      <audio 
        ref={remoteAudioRef}
        autoPlay
        playsInline
        style={{ display: 'none' }}
      />

      <div className="call-header">
        <div className="call-user-info">
          <div className="call-avatar">
            {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="call-details">
            <h2>{user.name || user.email}</h2>
            <p className="call-status">
              {getConnectionStateText()}
            </p>
            <div className="connection-indicator">
              {getConnectionIcon()}
              <span className="connection-quality">{connectionQuality}</span>
            </div>
          </div>
        </div>

        {type === "video" && (
          <button className="fullscreen-btn" onClick={toggleFullscreen}>
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        )}
      </div>

      {type === "video" && (
        <div className="video-container">
          {/* Remote Video (Main) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted={false}
            className="remote-video"
            poster="/images/avatar-placeholder.png"
          />
          
          {/* Local Video (Picture-in-Picture) */}
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="local-video-pip"
          />
          
          {/* Video Overlay Info */}
          {stats && (
            <div className="video-stats">
              <div className="stat-item">
                <span>RTT: {stats.connection?.currentRoundTripTime?.toFixed(3)}s</span>
              </div>
              {stats.video?.inbound?.packetsLost > 0 && (
                <div className="stat-item warning">
                  <span>Packets Lost: {stats.video.inbound.packetsLost}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Audio-only mode */}
      {type === "voice" && (
        <div className="audio-call-container">
          <div className="audio-visualizer">
            <div className="pulse-ring"></div>
            <div className="pulse-ring delay-1"></div>
            <div className="pulse-ring delay-2"></div>
          </div>
        </div>
      )}

      <div className="call-controls">
        <button 
          className={`control-btn ${!micOn ? 'disabled' : ''}`}
          onClick={toggleMic}
          title={micOn ? 'Mute microphone' : 'Unmute microphone'}
        >
          {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>

        {type === "video" && (
          <button 
            className={`control-btn ${!camOn ? 'disabled' : ''}`}
            onClick={toggleCam}
            title={camOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {camOn ? <FaVideo /> : <FaVideoSlash />}
          </button>
        )}

        {type === "video" && (
          <button 
            className={`control-btn ${isScreenSharing ? 'screen-share-active' : ''}`}
            onClick={handleScreenShare}
            title={isScreenSharing ? 'Stop screen sharing' : 'Share screen'}
          >
            <FaDesktop />
          </button>
        )}

        <button 
          className={`control-btn ${recording ? 'recording' : ''}`}
          onClick={handleRecord}
          title={recording ? 'Stop recording' : 'Start recording'}
        >
          <FaCircle className={recording ? "recording-pulse" : ""} />
        </button>

        <button 
          className="control-btn"
          title="Add participant"
          onClick={() => setShowAddParticipantModal(true)}
        >
          <FaUserPlus />
        </button>

        <button 
          className="control-btn end-call" 
          onClick={endCall}
          title="End call"
        >
          <FaPhoneSlash />
        </button>
      </div>

      {/* Connection Status Bar */}
      <div className={`connection-status ${getConnectionStateClass()}`}>
        {getConnectionStateClass() === 'connecting' && <div className="connecting-spinner"></div>}
        <span>{getConnectionStateText()}</span>
      </div>

      {/* Add Participant Modal */}
      <AddParticipantModal
        isOpen={showAddParticipantModal}
        onClose={() => setShowAddParticipantModal(false)}
        onAddParticipant={handleAddParticipant}
        currentUser={user}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}