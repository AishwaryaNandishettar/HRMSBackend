import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCall } from '../Context/CallContext';
import './GlobalCallNotification.css';

const GlobalCallNotification = () => {
  const { incomingCall, acceptCall, rejectCall } = useCall();
  const navigate = useNavigate();

  // Request notification permission on mount
  useEffect(() => {
    if (window.Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  if (!incomingCall) return null;

  const handleAccept = () => {
    acceptCall();
    // Navigate to WorkChat to show the call screen
    navigate('/workchat');
  };

  const handleReject = () => {
    rejectCall();
  };

  return (
    <div className="global-call-notification-overlay">
      <div className="global-call-notification">
        <div className="call-notification-header">
          <div className="call-icon-wrapper">
            {incomingCall.type === 'video' ? (
              <svg className="call-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="call-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            )}
          </div>
        </div>

        <div className="call-notification-body">
          <h3 className="caller-name">{incomingCall.fromName || incomingCall.fromEmail}</h3>
          <p className="call-type">
            Incoming {incomingCall.type === 'video' ? 'Video' : 'Voice'} Call
            {incomingCall.isParticipantInvite && ' (Join Conference)'}
          </p>
          <p className="caller-email">{incomingCall.fromEmail}</p>
        </div>

        <div className="call-notification-actions">
          <button 
            className="call-btn reject-btn" 
            onClick={handleReject}
            title="Reject Call"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
            </svg>
            Reject
          </button>
          
          <button 
            className="call-btn accept-btn" 
            onClick={handleAccept}
            title="Accept Call"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
            </svg>
            Accept
          </button>
        </div>

        <div className="call-notification-pulse"></div>
      </div>
    </div>
  );
};

export default GlobalCallNotification;