import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../../Context/Authcontext";
import { useCall } from "../../../../Context/CallContext";
import CallScreen from "../CallScreen";
import JoinMeeting from "./JoinMeeting";
import { fetchMeetingById } from "../../../../api/meetingApi";
import { sendCallSignal } from "../../../../api/socket";

export default function JoinMeetingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { call, incomingCall, callState, startCall, endCall, acceptCall, rejectCall } = useCall();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authRequired, setAuthRequired] = useState(false);

  const currentUserEmail = useMemo(() => {
    try {
      const storedUser = localStorage.getItem("loggedUser");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const email = parsed.email || parsed.userEmail;
        return email ? email.trim().toLowerCase() : null;
      }
    } catch (e) {
      console.error("[JoinMeetingPage] Failed to parse loggedUser", e);
    }
    return null;
  }, []);

  useEffect(() => {
    document.title = `Join Meeting ${id}`;
  }, [id]);

  useEffect(() => {
    if (!id) return;
    if (!token) {
      setAuthRequired(true);
      setLoading(false);
      return;
    }

    setAuthRequired(false);
    setLoading(true);
    setError(null);

    fetchMeetingById(id, token)
      .then((data) => {
        setMeeting(data);
      })
      .catch((err) => {
        console.error("[JoinMeetingPage] Failed to load meeting", err);
        setError(
          err.response?.status === 403
            ? "You are not authorized to join this meeting."
            : err.response?.status === 404
            ? "Meeting not found."
            : "Unable to load meeting details. Please try again."
        );
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  const isHost = !!meeting &&
    currentUserEmail === meeting.createdByEmail?.trim().toLowerCase();

  const isParticipant = !!meeting &&
    meeting.participantEmails?.some(
      (email) => email?.trim().toLowerCase() === currentUserEmail
    );

  const canJoin = !!meeting && (isHost || isParticipant);

  const meetingTargetEmail = useMemo(() => {
    if (!meeting) return null;
    if (isHost) {
      return meeting.participantEmails?.find(
        (email) => email?.trim().toLowerCase() !== currentUserEmail
      );
    }
    return meeting.createdByEmail;
  }, [meeting, isHost, currentUserEmail]);

  const getJoinLabel = () => {
    if (!meeting) return "Join meeting";
    if (isHost) {
      return meetingTargetEmail ? "Start meeting" : "Waiting for participants";
    }
    return "Join meeting";
  };

  const handleJoin = () => {
    if (!meetingTargetEmail) {
      alert("No participant found to connect with yet.");
      return;
    }

    startCall("video", {
      email: meetingTargetEmail,
      name: meetingTargetEmail,
    });
  };

  const handleLeave = () => {
    if (call || incomingCall) {
      endCall();
    }
    navigate("/workchat");
  };

  if (authRequired) {
    return (
      <div className="join-meeting-page">
        <div className="join-meeting auth-required">
          <h2>Login required</h2>
          <p>You need to sign in before joining this meeting.</p>
          <button className="join-meeting-btn" onClick={() => navigate('/')}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="join-meeting-page">
      {(call || incomingCall) && (
        <CallScreen
          user={call?.user || {
            email: incomingCall?.fromEmail,
            name: incomingCall?.fromName || incomingCall?.fromEmail,
          }}
          type={call?.type || incomingCall?.type}
          onEnd={call ? endCall : rejectCall}
          onAccept={!call && incomingCall ? acceptCall : undefined}
          onReject={!call && incomingCall ? rejectCall : undefined}
          isInitiator={call?.isInitiator || false}
          callId={call?.callId || incomingCall?.callId}
          waitingForAccept={call?.waitingForAccept || (!!incomingCall && !call)}
          callState={callState}
          onSignal={(signal) => {
            const toEmail = call?.user?.email || incomingCall?.fromEmail;
            if (!toEmail) {
              console.warn('[JoinMeetingPage] Missing recipient email for signal', signal);
              return;
            }
            sendCallSignal({
              ...signal,
              fromEmail: currentUserEmail,
              toEmail,
            });
          }}
        />
      )}

      {!call && !incomingCall && (
        <JoinMeeting
          meeting={meeting}
          loading={loading}
          error={error}
          canJoin={canJoin}
          isHost={isHost}
          meetingTargetEmail={meetingTargetEmail}
          onJoin={handleJoin}
          onLeave={handleLeave}
        />
      )}
    </div>
  );
}