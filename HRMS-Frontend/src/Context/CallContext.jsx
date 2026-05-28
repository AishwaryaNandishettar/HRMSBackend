import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { AuthContext } from './Authcontext';
import { connectSocket, sendCallSignal, subscribeToCallInfo } from '../api/socket';
import TokenManager from '../Utils/tokenManager';
import webrtcPeer from '../Services/webrtcPeer';
import activeSpeaker from '../Services/activeSpeaker';
import ringtoneManager from '../Utils/ringtone';

const CallContext = createContext();

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within CallProvider');
  }
  return context;
};

export const CallProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);

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
    } catch (e) {}
    return null;
  })();

  // ─── Core call state ───────────────────────────────────────────────────────
  const [call, setCall] = useState(() => {
    try {
      const stored = localStorage.getItem('ongoingCall');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('🔄 [CallContext] Recovering ongoing call:', parsed.callId);
        return parsed;
      }
    } catch (e) {
      localStorage.removeItem('ongoingCall');
    }
    return null;
  });

  const [incomingCall, setIncomingCall] = useState(null);
  const [callState, setCallState] = useState(() => {
    const stored = localStorage.getItem('ongoingCall');
    return stored ? 'connected' : 'idle';
  });
  const [wsConnected, setWsConnected] = useState(false);

  // ─── Multi-participant state ────────────────────────────────────────────────
  // participants: Map<email, { email, name, stream, audioEnabled, videoEnabled, connectionState, handRaised }>
  const [participants, setParticipants] = useState(new Map());
  const [activeSpeakerEmail, setActiveSpeakerEmail] = useState(null);

  // ─── Phase 2 state ─────────────────────────────────────────────────────────
  const [waitingRoom, setWaitingRoom]   = useState([]); // [{email, name}] waiting to join
  const [isRecording, setIsRecording]   = useState(false);
  const [recordingUrl, setRecordingUrl] = useState(null);

  // ─── Refs ──────────────────────────────────────────────────────────────────
  const socketConnected = useRef(false);
  const sessionRecoveryAttemptedRef = useRef(false);
  const activeSpeakerTimers = useRef(new Map());
  const pendingOffers = useRef(new Map()); // Store offers received before CallScreen is ready

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const stopRingTone = () => ringtoneManager.stop();

  const getMyEmail = useCallback(() => {
    return LOGGED_IN_EMAIL || user?.email?.trim().toLowerCase();
  }, [LOGGED_IN_EMAIL, user]);

  // Get my display name from multiple sources
  const getMyName = useCallback(() => {
    if (user?.name) return user.name;
    if (user?.firstName) return `${user.firstName} ${user.lastName || ''}`.trim();
    try {
      const stored = JSON.parse(localStorage.getItem('loggedUser') || '{}');
      if (stored.name) return stored.name;
      if (stored.firstName) return `${stored.firstName} ${stored.lastName || ''}`.trim();
    } catch (e) {}
    return getMyEmail() || 'Unknown';
  }, [user, getMyEmail]);

  // ─── Add / update participant ───────────────────────────────────────────────
  const addOrUpdateParticipant = useCallback((email, updates) => {
    if (!email) return;
    const normalizedEmail = email.trim().toLowerCase();
    // Derive a display name: prefer provided name, then email prefix, never raw email
    const displayName = updates.name && !updates.name.includes('@')
      ? updates.name
      : normalizedEmail.split('@')[0];

    setParticipants(prev => {
      const next = new Map(prev);
      const existing = next.get(normalizedEmail) || {
        email: normalizedEmail,
        name: displayName,
        audioEnabled: true,
        videoEnabled: true,
        connectionState: 'connecting',
        handRaised: false
      };
      // Only update name if the new name is better (not an email)
      const updatedName = (updates.name && !updates.name.includes('@'))
        ? updates.name
        : existing.name;
      next.set(normalizedEmail, {
        ...existing,
        ...updates,
        email: normalizedEmail,
        name: updatedName,
      });
      return next;
    });
  }, []);

  const removeParticipant = useCallback((email) => {
    if (!email) return;
    const normalizedEmail = email.trim().toLowerCase();
    setParticipants(prev => {
      const next = new Map(prev);
      next.delete(normalizedEmail);
      return next;
    });
    webrtcPeer.closePeerConnection(normalizedEmail);
  }, []);

  // ─── Setup WebRTC callbacks ─────────────────────────────────────────────────
  const setupWebRTCCallbacks = useCallback((callId) => {
    const myName = getMyName();
    webrtcPeer.setCallbacks({
      onSignal: (signal) => {
        sendCallSignal({
          ...signal,
          fromEmail: getMyEmail(),
          fromName: myName,
          callId: callId,
          type: call?.type?.toUpperCase() || 'VOICE',
        });
      },
      onRemoteStream: (participantEmail, stream) => {
        console.log(`📺 [CallContext] Remote stream received from ${participantEmail}`);
        addOrUpdateParticipant(participantEmail, { stream });

        // Start active speaker detection for this participant
        activeSpeaker.addStream(participantEmail, stream);

        window.dispatchEvent(new CustomEvent('remote_stream_added', {
          detail: { participantEmail, stream }
        }));
      },
      onRemoteStreamRemoved: (participantEmail) => {
        console.log(`📤 [CallContext] Remote stream removed for ${participantEmail}`);
        activeSpeaker.removeStream(participantEmail);
        removeParticipant(participantEmail);
        window.dispatchEvent(new CustomEvent('remote_stream_removed', {
          detail: { participantEmail }
        }));
      },
      onConnectionState: (participantEmail, state) => {
        console.log(`🔗 [CallContext] Connection state for ${participantEmail}: ${state}`);
        addOrUpdateParticipant(participantEmail, { connectionState: state });
        window.dispatchEvent(new CustomEvent('participant_connection_state', {
          detail: { participantEmail, state }
        }));
      },
      onParticipantJoined: (participantEmail) => {
        console.log(`👤 [CallContext] Participant joined: ${participantEmail}`);
        addOrUpdateParticipant(participantEmail, {});
      },
      onParticipantLeft: (participantEmail) => {
        console.log(`👤 [CallContext] Participant left: ${participantEmail}`);
        activeSpeaker.removeStream(participantEmail);
        removeParticipant(participantEmail);
      },
    });

    // Wire active speaker detection
    activeSpeaker.onSpeakerChange = (email) => {
      setActiveSpeakerEmail(email);
    };

    // Add local stream to active speaker detection
    if (webrtcPeer.localStream) {
      const myEmail = getMyEmail();
      if (myEmail) activeSpeaker.addStream(myEmail, webrtcPeer.localStream);
    }
  }, [call, getMyEmail, getMyName, addOrUpdateParticipant, removeParticipant]);

  // ─── Session Recovery ───────────────────────────────────────────────────────
  useEffect(() => {
    if (sessionRecoveryAttemptedRef.current) return;
    if (!token || !LOGGED_IN_EMAIL) return;
    sessionRecoveryAttemptedRef.current = true;

    const attemptRecovery = async () => {
      try {
        const storedCall = localStorage.getItem('ongoingCall');
        if (!storedCall) return;
        const parsed = JSON.parse(storedCall);
        console.log('🔄 [CallContext] Attempting session recovery for call:', parsed.callId);

        let attempts = 0;
        while (!window.stompClient?.connected && attempts < 20) {
          await new Promise(r => setTimeout(r, 500));
          attempts++;
        }

        if (!window.stompClient?.connected) {
          localStorage.setItem('callRecoveryPending', 'true');
          return;
        }

        setCall(parsed);
        setCallState('connected');
        localStorage.removeItem('callRecoveryPending');
      } catch (error) {
        console.error('❌ Session recovery failed:', error);
        localStorage.removeItem('ongoingCall');
        setCallState('idle');
      }
    };

    attemptRecovery();
  }, [token, LOGGED_IN_EMAIL]);

  // ─── WebSocket connection ───────────────────────────────────────────────────
  useEffect(() => {
    if (!token || !LOGGED_IN_EMAIL || socketConnected.current) return;

    const connectWithRetry = async () => {
      try {
        const activeToken = await TokenManager.getValidToken();
        if (!activeToken) return;

        await connectSocket(LOGGED_IN_EMAIL, activeToken, () => {}, () => {}, () => {});
        socketConnected.current = true;
        setWsConnected(true);
        console.log('✅ [CallContext] WebSocket connected globally');
      } catch (error) {
        console.error('❌ [CallContext] Failed to connect WebSocket:', error);
      }
    };

    connectWithRetry();
  }, [token, LOGGED_IN_EMAIL]);

  // ─── Monitor WebSocket status ───────────────────────────────────────────────
  useEffect(() => {
    const check = () => setWsConnected(window.stompClient?.connected || false);
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  // ─── Handle call signals ────────────────────────────────────────────────────
  useEffect(() => {
    const handleCallSignal = async (e) => {
      const data = e.detail;
      const myEmail = getMyEmail();
      const normalizedToEmail = data.toEmail?.trim().toLowerCase();
      const normalizedFromEmail = data.fromEmail?.trim().toLowerCase();

      console.log('📞 [CallContext] Signal:', data.action, 'from:', normalizedFromEmail, 'to:', normalizedToEmail);

      try {
        switch (data.action) {

          // ── Incoming call ──────────────────────────────────────────────────
          case 'CALL':
            if (normalizedToEmail === myEmail) {
              setIncomingCall({
                type: data.type?.toLowerCase() || 'voice',
                fromEmail: data.fromEmail,
                callId: data.callId || `call_${Date.now()}`,
                fromName: data.fromName || data.fromEmail,
                isParticipantInvite: false
              });
              setCallState('ringing');

              if (window.Notification?.permission === 'granted') {
                new Notification(`Incoming ${data.type} call`, {
                  body: `From: ${data.fromName || data.fromEmail}`,
                  icon: '/call-icon.png'
                });
              }
              ringtoneManager.play();
            }
            break;

          // ── Call accepted ──────────────────────────────────────────────────
          case 'ACCEPT': {
            let targetCall = call;
            if (!targetCall || targetCall.callId !== data.callId) {
              try {
                const stored = localStorage.getItem('ongoingCall');
                if (stored) {
                  const parsed = JSON.parse(stored);
                  if (parsed.callId === data.callId) targetCall = parsed;
                }
              } catch (e) {}
            }

            if (targetCall?.callId === data.callId && targetCall?.isInitiator) {
              if (targetCall.timeoutId) clearTimeout(targetCall.timeoutId);

              const updatedCall = { ...targetCall, waitingForAccept: false, timeoutId: undefined };
              setCall(updatedCall);
              setCallState('connected');
              localStorage.setItem('ongoingCall', JSON.stringify(updatedCall));

              // Add the accepting participant with their display name
              addOrUpdateParticipant(normalizedFromEmail, {
                name: data.fromName || normalizedFromEmail,
                connectionState: 'connecting'
              });

              // Create offer to the accepting participant
              if (webrtcPeer.localStream) {
                await webrtcPeer.createOffer(normalizedFromEmail);
              } else {
                window.dispatchEvent(new CustomEvent('create_offer_for', {
                  detail: { participantEmail: normalizedFromEmail }
                }));
              }

              // ── Group call: auto-invite remaining members ──────────────────
              // After the first member accepts, invite all additional group members
              if (targetCall.isGroupCall && targetCall.additionalMembers?.length > 0) {
                const myEmail = getMyEmail();
                const myName  = getMyName();
                const existingParticipants = [myEmail, normalizedFromEmail];

                console.log(`📞 [CallContext] Group call: inviting ${targetCall.additionalMembers.length} additional members`);

                targetCall.additionalMembers.forEach(member => {
                  const memberEmail = member.email.trim().toLowerCase();
                  sendCallSignal({
                    fromEmail: myEmail,
                    fromName: myName,
                    toEmail: memberEmail,
                    type: targetCall.type.toUpperCase(),
                    action: 'ADD_PARTICIPANT',
                    callId: targetCall.callId,
                    participant: { name: member.name, email: memberEmail },
                    existingParticipants,
                  });
                });
              }
            }
            break;
          }

          // ── Call rejected ──────────────────────────────────────────────────
          case 'REJECT': {
            const isMyOutgoingCall = call?.callId === data.callId && call?.isInitiator && normalizedFromEmail !== myEmail;
            const isMyIncomingCall = incomingCall?.callId === data.callId && normalizedFromEmail === myEmail;

            if (isMyOutgoingCall || isMyIncomingCall) {
              if (call?.timeoutId) clearTimeout(call.timeoutId);
              stopRingTone();
              setCall(null);
              setIncomingCall(null);
              setCallState('idle');
              setParticipants(new Map());
              localStorage.removeItem('ongoingCall');
              webrtcPeer.close();
            }
            break;
          }

          // ── Call ended ─────────────────────────────────────────────────────
          case 'END': {
            const isActiveCall = call?.callId === data.callId;
            const isRingingCall = incomingCall?.callId === data.callId;

            if (isActiveCall || isRingingCall) {
              if (call?.timeoutId) clearTimeout(call.timeoutId);
              stopRingTone();
              setCall(null);
              setIncomingCall(null);
              setCallState('idle');
              setParticipants(new Map());
              localStorage.removeItem('ongoingCall');
              webrtcPeer.close();
            }
            break;
          }

          // ── WebRTC OFFER ───────────────────────────────────────────────────
          case 'OFFER': {
            if (!data.sdp) break;
            console.log(`📞 [CallContext] OFFER from ${normalizedFromEmail}`);

            if (webrtcPeer.localStream) {
              // Media is ready — handle immediately
              await webrtcPeer.handleOffer(normalizedFromEmail, data.sdp);
            } else {
              // Queue the offer — CallScreen will process it once media starts
              console.log(`⏳ [CallContext] Queuing OFFER from ${normalizedFromEmail} (media not ready)`);
              pendingOffers.current.set(normalizedFromEmail, data.sdp);
              window.dispatchEvent(new CustomEvent('pending_offer', {
                detail: { fromEmail: normalizedFromEmail, sdp: data.sdp }
              }));
            }
            break;
          }

          // ── WebRTC ANSWER ──────────────────────────────────────────────────
          case 'ANSWER': {
            if (!data.sdp) break;
            console.log(`📞 [CallContext] ANSWER from ${normalizedFromEmail}`);
            await webrtcPeer.handleAnswer(normalizedFromEmail, data.sdp);
            break;
          }

          // ── ICE CANDIDATE ──────────────────────────────────────────────────
          case 'ICE_CANDIDATE': {
            if (!data.candidate) break;
            await webrtcPeer.handleIceCandidate(
              normalizedFromEmail,
              data.candidate,
              data.sdpMid,
              data.sdpMLineIndex
            );
            break;
          }

          // ── Add participant (invite to ongoing call) ────────────────────────
          case 'ADD_PARTICIPANT': {
            if (normalizedToEmail === myEmail) {
              const callType = data.type || 'VOICE';
              // fromName is the INVITER's name, participant is the INVITEE info
              // Show the inviter's name in the notification, not the invitee's
              const inviterName = data.fromName || data.fromEmail;
              setIncomingCall({
                type: callType.toLowerCase(),
                fromEmail: data.fromEmail,
                fromName: inviterName,
                callId: data.callId,
                isParticipantInvite: true,
                // Store all existing participants so new joiner can connect to everyone
                existingParticipants: data.existingParticipants || []
              });
              setCallState('ringing');
              ringtoneManager.play();
            }
            break;
          }

          // ── Participant joined the call ─────────────────────────────────────
          case 'PARTICIPANT_JOINED': {
            // Guard: don't process our own join signal
            if (normalizedFromEmail === myEmail) break;

            console.log(`👤 [CallContext] ${normalizedFromEmail} joined the call`);
            addOrUpdateParticipant(normalizedFromEmail, {
              name: data.fromName || normalizedFromEmail,
              connectionState: 'connecting'
            });

            // Create a peer connection offer to the new participant ONLY if we don't
            // already have one (prevents duplicate offers when both ACCEPT and
            // PARTICIPANT_JOINED arrive for the same person)
            const alreadyConnected = webrtcPeer.peerConnections?.has(normalizedFromEmail);
            if (!alreadyConnected) {
              if (webrtcPeer.localStream) {
                webrtcPeer.createOffer(normalizedFromEmail).catch(err =>
                  console.error(`❌ Failed to create offer for ${normalizedFromEmail}:`, err)
                );
              } else {
                window.dispatchEvent(new CustomEvent('create_offer_for', {
                  detail: { participantEmail: normalizedFromEmail }
                }));
              }
            } else {
              console.log(`ℹ️ Already have peer connection for ${normalizedFromEmail}, skipping offer`);
            }

            window.dispatchEvent(new CustomEvent('participant_joined_call', {
              detail: { email: normalizedFromEmail, name: data.fromName }
            }));
            break;
          }

          // ── Participant left the call ───────────────────────────────────────
          case 'PARTICIPANT_LEFT': {
            if (normalizedFromEmail !== myEmail) {
              console.log(`👤 [CallContext] ${normalizedFromEmail} left the call`);
              removeParticipant(normalizedFromEmail);
              window.dispatchEvent(new CustomEvent('participant_left_call', {
                detail: { email: normalizedFromEmail }
              }));
            }
            break;
          }

          // ── Raise hand ─────────────────────────────────────────────────────
          case 'RAISE_HAND': {
            if (normalizedToEmail === myEmail || !data.toEmail) {
              addOrUpdateParticipant(normalizedFromEmail, { handRaised: data.handRaised });
              window.dispatchEvent(new CustomEvent('raise_hand_signal', {
                detail: { fromEmail: data.fromEmail, handRaised: data.handRaised, callId: data.callId }
              }));
            }
            break;
          }

          // ── Mute state ─────────────────────────────────────────────────────
          case 'MUTE_STATE': {
            if (normalizedToEmail === myEmail || !data.toEmail) {
              addOrUpdateParticipant(normalizedFromEmail, { audioEnabled: data.audioEnabled });
              window.dispatchEvent(new CustomEvent('mute_state_signal', {
                detail: { fromEmail: data.fromEmail, audioEnabled: data.audioEnabled, callId: data.callId }
              }));
            }
            break;
          }

          // ── Video state ────────────────────────────────────────────────────
          case 'VIDEO_STATE': {
            if (normalizedToEmail === myEmail || !data.toEmail) {
              addOrUpdateParticipant(normalizedFromEmail, { videoEnabled: data.videoEnabled });
              window.dispatchEvent(new CustomEvent('video_state_signal', {
                detail: { fromEmail: data.fromEmail, videoEnabled: data.videoEnabled, callId: data.callId }
              }));
            }
            break;
          }

          // ── Active speaker ─────────────────────────────────────────────────
          case 'SPEAKING': {
            if (normalizedFromEmail !== myEmail) {
              setActiveSpeakerEmail(normalizedFromEmail);
              const existing = activeSpeakerTimers.current.get(normalizedFromEmail);
              if (existing) clearTimeout(existing);
              const timer = setTimeout(() => {
                setActiveSpeakerEmail(prev => prev === normalizedFromEmail ? null : prev);
              }, 2000);
              activeSpeakerTimers.current.set(normalizedFromEmail, timer);
            }
            break;
          }

          // ── Reactions (Phase 2) ────────────────────────────────────────────
          case 'REACTION': {
            window.dispatchEvent(new CustomEvent('call_reaction', {
              detail: {
                fromEmail: data.fromEmail,
                fromName: data.fromName || data.fromEmail?.split('@')[0],
                emoji: data.data,
                callId: data.callId
              }
            }));
            break;
          }

          // ── Waiting room (Phase 2) ─────────────────────────────────────────
          case 'WAITING_ROOM_JOIN': {
            if (normalizedToEmail === myEmail) {
              setWaitingRoom(prev => {
                const exists = prev.find(p => p.email === normalizedFromEmail);
                if (exists) return prev;
                return [...prev, { email: data.fromEmail, name: data.fromName || data.fromEmail }];
              });
              window.dispatchEvent(new CustomEvent('waiting_room_join', {
                detail: { email: data.fromEmail, name: data.fromName }
              }));
            }
            break;
          }

          case 'WAITING_ROOM_ADMIT': {
            if (normalizedToEmail === myEmail) {
              window.dispatchEvent(new CustomEvent('waiting_room_admitted', {
                detail: { callId: data.callId }
              }));
            }
            setWaitingRoom(prev => prev.filter(p => p.email !== normalizedToEmail));
            break;
          }

          case 'WAITING_ROOM_DENY': {
            if (normalizedToEmail === myEmail) {
              window.dispatchEvent(new CustomEvent('waiting_room_denied', {}));
            }
            setWaitingRoom(prev => prev.filter(p => p.email !== normalizedToEmail));
            break;
          }

          // ── Recording (Phase 2) ────────────────────────────────────────────
          case 'RECORDING_STARTED': {
            setIsRecording(true);
            window.dispatchEvent(new CustomEvent('recording_state_changed', {
              detail: { isRecording: true, startedBy: data.fromEmail }
            }));
            break;
          }

          case 'RECORDING_STOPPED': {
            setIsRecording(false);
            if (data.data) setRecordingUrl(data.data);
            window.dispatchEvent(new CustomEvent('recording_state_changed', {
              detail: { isRecording: false, url: data.data }
            }));
            break;
          }

          // ── Host muted participant ─────────────────────────────────────────
          case 'HOST_MUTE': {
            if (normalizedToEmail === myEmail) {
              webrtcPeer.toggleAudio(false);
              window.dispatchEvent(new CustomEvent('host_muted_me', {
                detail: { fromEmail: data.fromEmail }
              }));
            }
            break;
          }

          // ── Host removed participant ───────────────────────────────────────
          case 'REMOVE_PARTICIPANT': {
            if (normalizedToEmail === myEmail) {
              stopRingTone();
              setCall(null);
              setIncomingCall(null);
              setCallState('idle');
              setParticipants(new Map());
              localStorage.removeItem('ongoingCall');
              webrtcPeer.close();
              window.dispatchEvent(new CustomEvent('removed_from_call', {
                detail: { fromEmail: data.fromEmail }
              }));
            }
            break;
          }

          default:
            console.log('❓ [CallContext] Unknown signal action:', data.action);
        }
      } catch (error) {
        console.error('❌ [CallContext] Error handling call signal:', error);
      }
    };

    window.addEventListener('call_signal', handleCallSignal);
    return () => window.removeEventListener('call_signal', handleCallSignal);
  }, [call, incomingCall, LOGGED_IN_EMAIL, addOrUpdateParticipant, removeParticipant, getMyEmail]);

  // ─── Expose pending offers for CallScreen ──────────────────────────────────
  const getPendingOffers = useCallback(() => {
    const offers = new Map(pendingOffers.current);
    pendingOffers.current.clear();
    return offers;
  }, []);

  // ─── Start a new call ───────────────────────────────────────────────────────
  const startCall = useCallback((type, targetUser) => {
    if (!targetUser?.email) {
      alert('Please select a user to call');
      return;
    }

    const callId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const myEmail = getMyEmail();
    const myName  = getMyName();
    const toEmail = targetUser.email.trim().toLowerCase();

    console.log(`📞 [CallContext] Starting ${type} call to:`, toEmail, targetUser.isGroupCall ? '(group call)' : '');

    sendCallSignal({
      fromEmail: myEmail,
      fromName: myName,
      toEmail,
      type: type.toUpperCase(),
      action: 'CALL',
      callId,
    });

    const timeoutId = setTimeout(() => {
      setCall(currentCall => {
        if (currentCall?.callId === callId && currentCall?.waitingForAccept) {
          sendCallSignal({ fromEmail: myEmail, toEmail, type: type.toUpperCase(), action: 'END', callId });
          setCallState('idle');
          localStorage.removeItem('ongoingCall');
          return null;
        }
        return currentCall;
      });
    }, 30000);

    const callData = {
      type: type.toLowerCase(),
      user: { email: targetUser.email, name: targetUser.name || targetUser.email, currentUserEmail: myEmail },
      callId,
      isInitiator: true,
      waitingForAccept: true,
      timeoutId,
      // Group call metadata — used to invite remaining members after first accepts
      isGroupCall: targetUser.isGroupCall || false,
      groupId: targetUser.groupId || null,
      groupName: targetUser.groupName || null,
      additionalMembers: targetUser.additionalMembers || [],
    };

    setCall(callData);
    setCallState('calling');
    localStorage.setItem('ongoingCall', JSON.stringify({ ...callData, timeoutId: undefined }));
  }, [getMyEmail, getMyName]);

  // ─── Accept incoming call ───────────────────────────────────────────────────
  const acceptCall = useCallback(() => {
    if (!incomingCall) return;

    stopRingTone();
    const myEmail = getMyEmail();
    const myName = getMyName();
    const toEmail = incomingCall.fromEmail.trim().toLowerCase();

    // Send ACCEPT back to the person who invited us
    sendCallSignal({
      fromEmail: myEmail,
      fromName: myName,
      toEmail,
      type: incomingCall.type.toUpperCase(),
      action: 'ACCEPT',
      callId: incomingCall.callId,
    });

    const callData = {
      type: incomingCall.type,
      user: { email: incomingCall.fromEmail, name: incomingCall.fromName || incomingCall.fromEmail, currentUserEmail: myEmail },
      callId: incomingCall.callId,
      isInitiator: false
    };

    // Add the inviter as a participant (not ourselves)
    addOrUpdateParticipant(toEmail, {
      name: incomingCall.fromName || toEmail,
      connectionState: 'connecting'
    });

    // If this is a conference invite, notify existing participants we joined.
    // We send ONE PARTICIPANT_JOINED signal to the inviter (toEmail).
    // The backend's broadcastToCall will fan it out to all other existing members.
    // We also add existing participants to our local state so we can connect to them.
    if (incomingCall.isParticipantInvite && incomingCall.existingParticipants?.length > 0) {
      // Send a single PARTICIPANT_JOINED — backend broadcasts to everyone in the call
      sendCallSignal({
        fromEmail: myEmail,
        fromName: myName,
        toEmail,                              // inviter receives it; backend broadcasts to rest
        type: incomingCall.type.toUpperCase(),
        action: 'PARTICIPANT_JOINED',
        callId: incomingCall.callId,
      });

      // Add all existing participants to our local state so we can create peer connections
      incomingCall.existingParticipants.forEach(participantEmail => {
        const normalizedParticipant = participantEmail.trim().toLowerCase();
        if (normalizedParticipant !== myEmail && normalizedParticipant !== toEmail) {
          addOrUpdateParticipant(normalizedParticipant, {
            connectionState: 'connecting'
          });
        }
      });
    }

    setCall(callData);
    setIncomingCall(null);
    setCallState('connected');
    localStorage.setItem('ongoingCall', JSON.stringify(callData));
  }, [incomingCall, getMyEmail, getMyName, addOrUpdateParticipant]);

  // ─── Reject incoming call ───────────────────────────────────────────────────
  const rejectCall = useCallback(() => {
    if (!incomingCall) return;

    stopRingTone();
    const myEmail = getMyEmail();

    sendCallSignal({
      fromEmail: myEmail,
      toEmail: incomingCall.fromEmail.trim().toLowerCase(),
      type: incomingCall.type.toUpperCase(),
      action: 'REJECT',
      callId: incomingCall.callId
    });

    setIncomingCall(null);
    setCallState('idle');
  }, [incomingCall, getMyEmail]);

  // ─── End active call ────────────────────────────────────────────────────────
  // ─── End active call (leave call) ─────────────────────────────────────────
  // In a group call: sends PARTICIPANT_LEFT to all others, only closes own connections.
  // In a 1-on-1 call: sends END to the other person, fully tears down.
  const endCall = useCallback(() => {
    if (!call) return;

    stopRingTone();
    if (call.timeoutId) clearTimeout(call.timeoutId);

    const myEmail = getMyEmail();
    const myName  = getMyName();
    const isGroupCall = participants.size > 0;

    if (isGroupCall) {
      // ── Group call: I'm leaving, others stay ──────────────────────────────
      // Notify all participants that I left (they remove my tile, keep the call)
      participants.forEach((_, participantEmail) => {
        sendCallSignal({
          fromEmail: myEmail,
          fromName: myName,
          toEmail: participantEmail,
          type: call.type.toUpperCase(),
          action: 'PARTICIPANT_LEFT',
          callId: call.callId
        });
      });

      // Also notify the primary call user if not already in participants
      const primaryEmail = call.user?.email?.trim().toLowerCase();
      if (primaryEmail && !participants.has(primaryEmail)) {
        sendCallSignal({
          fromEmail: myEmail,
          fromName: myName,
          toEmail: primaryEmail,
          type: call.type.toUpperCase(),
          action: 'PARTICIPANT_LEFT',
          callId: call.callId
        });
      }
    } else {
      // ── 1-on-1 call: send END to the other person ─────────────────────────
      if (call.user?.email) {
        sendCallSignal({
          fromEmail: myEmail,
          toEmail: call.user.email.trim().toLowerCase(),
          type: call.type.toUpperCase(),
          action: 'END',
          callId: call.callId
        });
      }
    }

    // Clean up my own state
    setCall(null);
    setCallState('idle');
    setParticipants(new Map());
    localStorage.removeItem('ongoingCall');
    webrtcPeer.close();
  }, [call, participants, getMyEmail, getMyName]);

  // ─── Add participant to ongoing call ───────────────────────────────────────
  const addParticipantToCall = useCallback((employee) => {
    if (!call) return;

    const myEmail = getMyEmail();
    const myName = getMyName();

    // Collect all current participant emails so the new joiner can connect to everyone
    const existingParticipantEmails = Array.from(participants.keys());
    if (!existingParticipantEmails.includes(myEmail)) {
      existingParticipantEmails.push(myEmail);
    }

    sendCallSignal({
      fromEmail: myEmail,
      fromName: myName,           // inviter's name shown in notification
      toEmail: employee.email.trim().toLowerCase(),
      type: call.type.toUpperCase(),
      action: 'ADD_PARTICIPANT',
      callId: call.callId,
      participant: { name: employee.name, email: employee.email },
      existingParticipants: existingParticipantEmails,
    });

    console.log(`📞 [CallContext] Invited ${employee.email}. Existing: ${existingParticipantEmails}`);
  }, [call, participants, getMyEmail, getMyName]);

  // ─── Host mute a participant ────────────────────────────────────────────────
  const muteParticipant = useCallback((participantEmail) => {
    if (!call) return;
    const myEmail = getMyEmail();
    sendCallSignal({
      fromEmail: myEmail,
      toEmail: participantEmail,
      type: call.type.toUpperCase(),
      action: 'HOST_MUTE',
      callId: call.callId
    });
  }, [call, getMyEmail]);

  // ─── Remove participant from call ──────────────────────────────────────────
  const removeParticipantFromCall = useCallback((participantEmail) => {
    if (!call) return;
    const myEmail = getMyEmail();
    sendCallSignal({
      fromEmail: myEmail,
      toEmail: participantEmail,
      type: call.type.toUpperCase(),
      action: 'REMOVE_PARTICIPANT',
      callId: call.callId
    });
    removeParticipant(participantEmail);
  }, [call, getMyEmail, removeParticipant]);

  // ─── Broadcast media state to all participants ─────────────────────────────
  const broadcastMediaState = useCallback((audioEnabled, videoEnabled) => {
    if (!call) return;
    const myEmail = getMyEmail();
    participants.forEach((_, participantEmail) => {
      if (audioEnabled !== undefined) {
        sendCallSignal({
          fromEmail: myEmail,
          toEmail: participantEmail,
          type: call.type.toUpperCase(),
          action: 'MUTE_STATE',
          callId: call.callId,
          audioEnabled
        });
      }
      if (videoEnabled !== undefined) {
        sendCallSignal({
          fromEmail: myEmail,
          toEmail: participantEmail,
          type: call.type.toUpperCase(),
          action: 'VIDEO_STATE',
          callId: call.callId,
          videoEnabled
        });
      }
    });
  }, [call, participants, getMyEmail]);

  // ─── Broadcast raise hand to all participants ──────────────────────────────
  const broadcastRaiseHand = useCallback((handRaised) => {
    if (!call) return;
    const myEmail = getMyEmail();
    participants.forEach((_, participantEmail) => {
      sendCallSignal({
        fromEmail: myEmail,
        toEmail: participantEmail,
        type: call.type.toUpperCase(),
        action: 'RAISE_HAND',
        callId: call.callId,
        handRaised
      });
    });
  }, [call, participants, getMyEmail]);

  // ─── Broadcast reaction to all participants ───────────────────────────────
  const broadcastReaction = useCallback((emoji) => {
    if (!call) return;
    const myEmail = getMyEmail();
    const myName = (() => {
      try { return JSON.parse(localStorage.getItem('loggedUser') || '{}').name || myEmail; }
      catch { return myEmail; }
    })();
    participants.forEach((_, participantEmail) => {
      sendCallSignal({
        fromEmail: myEmail,
        fromName: myName,
        toEmail: participantEmail,
        type: call.type.toUpperCase(),
        action: 'REACTION',
        callId: call.callId,
        data: emoji
      });
    });
  }, [call, participants, getMyEmail]);

  // ─── Waiting room: admit a participant ────────────────────────────────────
  const admitFromWaitingRoom = useCallback((participantEmail) => {
    if (!call) return;
    const myEmail = getMyEmail();
    sendCallSignal({
      fromEmail: myEmail,
      toEmail: participantEmail,
      type: call.type.toUpperCase(),
      action: 'WAITING_ROOM_ADMIT',
      callId: call.callId
    });
  }, [call, getMyEmail]);

  // ─── Waiting room: deny a participant ─────────────────────────────────────
  const denyFromWaitingRoom = useCallback((participantEmail) => {
    if (!call) return;
    const myEmail = getMyEmail();
    sendCallSignal({
      fromEmail: myEmail,
      toEmail: participantEmail,
      type: call.type.toUpperCase(),
      action: 'WAITING_ROOM_DENY',
      callId: call.callId
    });
  }, [call, getMyEmail]);

  const value = {
    call,
    incomingCall,
    callState,
    wsConnected,
    participants,
    activeSpeaker: activeSpeakerEmail,
    // Expose logged-in user identity — always from AuthContext, never from remote user prop
    myEmail: getMyEmail(),
    myName: getMyName(),
    // Phase 2
    waitingRoom,
    isRecording,
    recordingUrl,
    // Actions
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    addParticipantToCall,
    muteParticipant,
    removeParticipantFromCall,
    broadcastMediaState,
    broadcastRaiseHand,
    broadcastReaction,
    admitFromWaitingRoom,
    denyFromWaitingRoom,
    setupWebRTCCallbacks,
    getPendingOffers,
    setCall,
    setCallState,
    addOrUpdateParticipant,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

export default CallContext;