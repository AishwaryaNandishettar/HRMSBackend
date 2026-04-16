/**
 * Production-Grade WebRTC Peer Connection Service
 * Handles all WebRTC functionality for voice and video calls
 */

import { getWebRTCConfig, MEDIA_CONSTRAINTS, CONNECTION_QUALITY, CALL_TIMEOUTS } from '../config/webrtc';

class WebRTCPeer {
  constructor() {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.isInitiator = false;
    this.callId = null;
    this.onSignalCallback = null;
    this.onRemoteStreamCallback = null;
    this.onConnectionStateCallback = null;
    this.onStatsCallback = null;
    
    // Get configuration from config file
    this.pcConfig = getWebRTCConfig();
    
    // Statistics tracking
    this.statsInterval = null;
    this.connectionStartTime = null;
    this.reconnectionAttempts = 0;
    
    // ICE candidate queue
    this.queuedCandidates = [];
  }

  /**
   * Initialize WebRTC peer connection
   */
  async initialize(isInitiator = false, callId = null) {
    try {
      this.isInitiator = isInitiator;
      this.callId = callId || this.generateCallId();
      this.connectionStartTime = Date.now();
      
      // Create peer connection
      this.peerConnection = new RTCPeerConnection(this.pcConfig);
      
      // Set up event handlers
      this.setupPeerConnectionHandlers();
      
      console.log('✅ WebRTC peer connection initialized', {
        isInitiator: this.isInitiator,
        callId: this.callId
      });
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize WebRTC:', error);
      throw error;
    }
  }

  /**
   * Set up peer connection event handlers*/
 setupPeerConnectionHandlers() {
  // ICE candidate sending with better logging
  this.peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log('📡 ICE candidate generated:', {
        type: event.candidate.type,
        protocol: event.candidate.protocol,
        address: event.candidate.address,
        port: event.candidate.port,
        priority: event.candidate.priority,
        foundation: event.candidate.foundation
      });

      if (this.onSignalCallback) {
        this.onSignalCallback({
          action: 'ICE_CANDIDATE',
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          callId: this.callId
        });
      }
    } else {
      console.log('📡 ICE candidate gathering complete');
    }
  };

  // ICE gathering state changes
  this.peerConnection.onicegatheringstatechange = () => {
    console.log('🧊 ICE gathering state:', this.peerConnection.iceGatheringState);
  };

  // Remote stream
  this.peerConnection.ontrack = (event) => {
    console.log('📺 Remote stream received');
    this.remoteStream = event.streams[0];

    if (this.onRemoteStreamCallback) {
      this.onRemoteStreamCallback(this.remoteStream);
    }
  };

  // Connection state (ONLY ONCE)
  this.peerConnection.onconnectionstatechange = () => {
    const state = this.peerConnection.connectionState;
    console.log('🔗 Connection state:', state);

    if (this.onConnectionStateCallback) {
      this.onConnectionStateCallback(state);
    }

    if (state === 'connected') {
      console.log('✅ FULLY CONNECTED');
      this.startStatsMonitoring();
    }

    if (state === 'failed') {
      console.log('❌ Connection failed');
      this.handleConnectionFailure();
    }
  };

  // ICE state with detailed logging
  this.peerConnection.oniceconnectionstatechange = () => {
    const state = this.peerConnection.iceConnectionState;
    console.log('🧊 ICE connection state:', state);

    if (state === 'checking') {
      console.log('🔍 ICE checking - trying to establish connection...');
    } else if (state === 'connected') {
      console.log('✅ ICE connected - peer-to-peer connection established');
    } else if (state === 'completed') {
      console.log('✅ ICE completed - all candidates processed');
    } else if (state === 'failed') {
      console.log('❌ ICE failed - attempting restart...');
      this.restartIce();
    } else if (state === 'disconnected') {
      console.log('⚠️ ICE disconnected - connection temporarily lost');
    } else if (state === 'closed') {
      console.log('🔚 ICE closed');
    }
  };
}

  /**
   * Start local media (camera/microphone)
   */
  async startLocalMedia(callType = 'video') {
    try {
      console.log(`🎥 Starting local media for ${callType} call`);
      
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }
      
      // Get appropriate constraints from config
      let constraints = MEDIA_CONSTRAINTS[callType] || MEDIA_CONSTRAINTS.video;
      
      // Try to get media with fallback constraints
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (primaryError) {
        console.warn('❌ Primary media constraints failed:', primaryError);
        
        // Try with fallback constraints for video calls
        if (callType === 'video') {
          console.log('🔄 Trying video fallback constraints...');
          try {
            this.localStream = await navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS.videoFallback);
            console.log('✅ Video fallback constraints worked');
          } catch (fallbackError) {
            console.warn('❌ Video fallback failed, trying minimal constraints...');
            try {
              this.localStream = await navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS.minimal);
              console.log('✅ Minimal constraints worked');
            } catch (minimalError) {
              console.warn('❌ Minimal constraints failed, trying audio-only...');
              this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
              console.log('✅ Audio-only stream obtained as last resort');
            }
          }
        } else {
          // For voice calls, try simpler audio constraints
          console.log('🔄 Trying simple audio constraints...');
          this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          console.log('✅ Simple audio constraints worked');
        }
      }
      
      // Add tracks to peer connection
      if (this.peerConnection) {
        this.localStream.getTracks().forEach(track => {
          console.log(`➕ Adding ${track.kind} track to peer connection`);
          this.peerConnection.addTrack(track, this.localStream);
        });
      }
      
      console.log('✅ Local media started successfully');
      console.log('📊 Stream info:', {
        audioTracks: this.localStream.getAudioTracks().length,
        videoTracks: this.localStream.getVideoTracks().length,
        tracks: this.localStream.getTracks().map(track => ({
          kind: track.kind,
          enabled: track.enabled,
          readyState: track.readyState
        }))
      });
      
      return this.localStream;
    } catch (error) {
      console.error('❌ Failed to start local media:', error);
      
      // Provide user-friendly error messages
      let userMessage = 'Failed to access camera/microphone. ';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        userMessage += 'Please allow camera and microphone permissions in your browser settings.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        userMessage += 'Camera/microphone is already in use by another application. Please close other applications and try again.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        userMessage += 'No camera or microphone found. Please connect a camera/microphone and try again.';
      } else if (error.name === 'NotSupportedError' || error.name === 'ConstraintNotSatisfiedError') {
        userMessage += 'Your camera/microphone does not support the required settings.';
      } else {
        userMessage += 'Please check your camera and microphone settings.';
      }
      
      // Create a custom error with user-friendly message
      const customError = new Error(userMessage);
      customError.originalError = error;
      customError.name = error.name;
      
      throw customError;
    }
  }

  /**
   * Create and send offer (caller side)
   */
  async createOffer() {
    try {
      console.log('📞 Creating offer...');
      
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      await this.peerConnection.setLocalDescription(offer);
      
      if (this.onSignalCallback) {
        this.onSignalCallback({
          action: 'OFFER',
          sdp: offer.sdp,
          callId: this.callId
        });
      }
      
      console.log('✅ Offer created and sent');
    } catch (error) {
      console.error('❌ Failed to create offer:', error);
      throw error;
    }
  }

  /**
   * Handle incoming offer and create answer (callee side)
   */
  async handleOffer(offerSdp) {
    try {
      console.log('📞 Handling incoming offer...');
      
      const offer = new RTCSessionDescription({
        type: 'offer',
        sdp: offerSdp
      });
      
      await this.peerConnection.setRemoteDescription(offer);
      console.log('✅ Remote description set from offer');
      
      // Process any queued ICE candidates now that we have remote description
      await this.processQueuedCandidates();
      
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      
      if (this.onSignalCallback) {
        this.onSignalCallback({
          action: 'ANSWER',
          sdp: answer.sdp,
          callId: this.callId
        });
      }
      
      console.log('✅ Answer created and sent');
    } catch (error) {
      console.error('❌ Failed to handle offer:', error);
      throw error;
    }
  }

  /**
   * Handle incoming answer (caller side)
   */
  async handleAnswer(answerSdp) {
    try {
      console.log('📞 Handling incoming answer...');
      
      const answer = new RTCSessionDescription({
        type: 'answer',
        sdp: answerSdp
      });
      
      await this.peerConnection.setRemoteDescription(answer);
      console.log('✅ Remote description set from answer');
      
      // Process any queued ICE candidates now that we have remote description
      await this.processQueuedCandidates();
      
      console.log('✅ Answer handled successfully');
    } catch (error) {
      console.error('❌ Failed to handle answer:', error);
      throw error;
    }
  }

  /**
   * Handle incoming ICE candidate
   */
  async handleIceCandidate(candidate, sdpMid, sdpMLineIndex) {
    try {
      console.log('🧊 Handling ICE candidate:', { candidate: candidate?.substring(0, 50) + '...', sdpMid, sdpMLineIndex });
      
      if (!this.peerConnection) {
        console.error('❌ No peer connection available for ICE candidate');
        return;
      }

      if (this.peerConnection.remoteDescription) {
        const iceCandidate = new RTCIceCandidate({
          candidate,
          sdpMid,
          sdpMLineIndex
        });
        
        await this.peerConnection.addIceCandidate(iceCandidate);
        console.log('✅ ICE candidate added successfully');
      } else {
        console.log('⏳ Queuing ICE candidate (no remote description yet)');
        // Queue candidates for later processing
        if (!this.queuedCandidates) {
          this.queuedCandidates = [];
        }
        this.queuedCandidates.push({ candidate, sdpMid, sdpMLineIndex });
        console.log(`📦 Queued candidate. Total queued: ${this.queuedCandidates.length}`);
      }
    } catch (error) {
      console.error('❌ Failed to handle ICE candidate:', error);
      // Don't throw - just log the error to prevent call failure
    }
  }


  // Process queued ICE candidates
 async processQueuedCandidates() {
  if (!this.peerConnection?.remoteDescription) return;

  console.log(`Processing ${this.queuedCandidates.length} queued ICE candidates`);

  for (const { candidate, sdpMid, sdpMLineIndex } of this.queuedCandidates) {
    try {
      await this.peerConnection.addIceCandidate(
        new RTCIceCandidate({ candidate, sdpMid, sdpMLineIndex })
      );
      console.log('✅ Queued ICE candidate added');
    } catch (error) {
      console.error('❌ Error adding queued ICE candidate:', error);
    }
  }

  this.queuedCandidates = [];
}

  /**
   * Toggle audio track
   */
  toggleAudio(enabled) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
      console.log(`🎙 Audio ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  /**
   * Toggle video track
   */
  toggleVideo(enabled) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
      console.log(`📹 Video ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  /**
   * Start screen sharing
   */
  async startScreenShare() {
    try {
      if (!this.isReadyForScreenShare()) {
        throw new Error('Peer connection not ready for screen sharing');
      }

      const constraints = MEDIA_CONSTRAINTS.screenShare;
      const screenStream = await navigator.mediaDevices.getDisplayMedia(constraints);
      
      // Replace video track
      const videoTrack = screenStream.getVideoTracks()[0];
      const sender = this.peerConnection.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender) {
        await sender.replaceTrack(videoTrack);
        
        // CRITICAL FIX: Renegotiate after track replacement
        console.log('🔄 Renegotiating connection for screen share...');
        
        // Create new offer with the screen share track
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        
        // Send the new offer to the remote peer
        if (this.onSignalCallback) {
          this.onSignalCallback({
            action: 'OFFER',
            sdp: offer.sdp,
            callId: this.callId,
            isScreenShare: true
          });
        }
        
        console.log('✅ Screen share renegotiation offer sent');
      }
      
      // Store screen stream reference
      this.screenStream = screenStream;
      
      // Handle screen share end (when user clicks browser's "Stop sharing" button)
      videoTrack.onended = () => {
        console.log('🖥 Screen share ended by user (browser button)');
        this.stopScreenShare();
        
        // Notify UI via custom event
        window.dispatchEvent(new CustomEvent('screenshare-ended'));
      };
      
      console.log('🖥 Screen sharing started');
      return screenStream;
    } catch (error) {
      console.error('❌ Failed to start screen sharing:', error);
      
      // Check if user cancelled
      if (error.name === 'NotAllowedError' && error.message.includes('Permission denied')) {
        throw new Error('User cancelled screen sharing');
      }
      
      throw error;
    }
  }

  /**
   * Stop screen sharing
   */
  async stopScreenShare() {
    try {
      if (!this.peerConnection) {
        console.warn('⚠️ Peer connection not available for stopping screen share');
        return;
      }

      // Stop all tracks in screen stream
      if (this.screenStream) {
        this.screenStream.getTracks().forEach(track => track.stop());
        this.screenStream = null;
      }

      // Get original video track
      const videoTrack = this.localStream.getVideoTracks()[0];
      const sender = this.peerConnection.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender && videoTrack) {
        await sender.replaceTrack(videoTrack);
        
        // CRITICAL FIX: Renegotiate after stopping screen share
        console.log('🔄 Renegotiating connection after stopping screen share...');
        
        // Create new offer with the camera track
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        
        // Send the new offer to the remote peer
        if (this.onSignalCallback) {
          this.onSignalCallback({
            action: 'OFFER',
            sdp: offer.sdp,
            callId: this.callId,
            isScreenShare: false
          });
        }
        
        console.log('✅ Stop screen share renegotiation offer sent');
      }
      
      console.log('🖥 Screen sharing stopped');
    } catch (error) {
      console.error('❌ Failed to stop screen sharing:', error);
    }
  }

  /**
   * Start connection statistics monitoring
   */
  startStatsMonitoring() {
    if (this.statsInterval) return;
    
    this.statsInterval = setInterval(async () => {
      try {
        const stats = await this.peerConnection.getStats();
        const report = this.parseStats(stats);
        
        if (this.onStatsCallback) {
          this.onStatsCallback(report);
        }
      } catch (error) {
        console.error('❌ Failed to get stats:', error);
      }
    }, 2000); // Every 2 seconds
  }

  /**
   * Stop statistics monitoring
   */
  stopStatsMonitoring() {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
    }
  }

  /**
   * Parse WebRTC statistics
   */
  parseStats(stats) {
    const report = {
      audio: { inbound: {}, outbound: {} },
      video: { inbound: {}, outbound: {} },
      connection: {}
    };
    
    stats.forEach(stat => {
      if (stat.type === 'inbound-rtp') {
        if (stat.kind === 'audio') {
          report.audio.inbound = {
            packetsReceived: stat.packetsReceived,
            packetsLost: stat.packetsLost,
            jitter: stat.jitter
          };
        } else if (stat.kind === 'video') {
          report.video.inbound = {
            packetsReceived: stat.packetsReceived,
            packetsLost: stat.packetsLost,
            framesReceived: stat.framesReceived,
            framesDropped: stat.framesDropped
          };
        }
      } else if (stat.type === 'outbound-rtp') {
        if (stat.kind === 'audio') {
          report.audio.outbound = {
            packetsSent: stat.packetsSent,
            bytesSent: stat.bytesSent
          };
        } else if (stat.kind === 'video') {
          report.video.outbound = {
            packetsSent: stat.packetsSent,
            bytesSent: stat.bytesSent,
            framesSent: stat.framesSent
          };
        }
      } else if (stat.type === 'candidate-pair' && stat.state === 'succeeded') {
        report.connection = {
          currentRoundTripTime: stat.currentRoundTripTime,
          availableOutgoingBitrate: stat.availableOutgoingBitrate,
          availableIncomingBitrate: stat.availableIncomingBitrate
        };
      }
    });
    
    return report;
  }

  /**
   * Restart ICE connection
   */
  async restartIce() {
    try {
      console.log('🔄 Restarting ICE connection...');
      await this.peerConnection.restartIce();
    } catch (error) {
      console.error('❌ Failed to restart ICE:', error);
    }
  }
  // Handle connection failures with retry logic
  handleConnectionFailure() {
    if (this.reconnectionAttempts >= 3) {
      console.log('❌ Max reconnection attempts reached');
      if (this.onConnectionStateCallback) {
        this.onConnectionStateCallback('failed');
      }
      return;
    }

    this.reconnectionAttempts++;
    console.log(`🔄 Connection failure - attempt ${this.reconnectionAttempts}/3`);

    setTimeout(() => {
      this.restartIce();
    }, 2000 * this.reconnectionAttempts); // Exponential backoff
  }


  /**
   * Close peer connection and cleanup
   */
  close() {
    console.log('🔚 Closing WebRTC peer connection...');
    
    // Stop stats monitoring
    this.stopStatsMonitoring();
    
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    // Reset state
    this.remoteStream = null;
    this.callId = null;
    this.connectionStartTime = null;
    this.queuedCandidates = []; // Clear ICE candidate queue
    
    console.log('✅ WebRTC peer connection closed');
  }

  /**
   * Generate unique call ID
   */
  generateCallId() {
    return `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Set callback functions
   */
  setCallbacks({
    onSignal,
    onRemoteStream,
    onConnectionState,
    onStats
  }) {
    this.onSignalCallback = onSignal;
    this.onRemoteStreamCallback = onRemoteStream;
    this.onConnectionStateCallback = onConnectionState;
    this.onStatsCallback = onStats;
  }

  /**
   * Get connection duration
   */
  getConnectionDuration() {
    if (!this.connectionStartTime) return 0;
    return Math.floor((Date.now() - this.connectionStartTime) / 1000);
  }

  /**
   * Get connection state
   */
  getConnectionState() {
    return this.peerConnection ? this.peerConnection.connectionState : 'closed';
  }

  // Debug function to check audio track states
  getAudioTrackStates() {
    const localAudio = this.localStream?.getAudioTracks() || [];
    const remoteAudio = this.remoteStream?.getAudioTracks() || [];
    
    return {
      local: localAudio.map(track => ({
        id: track.id,
        kind: track.kind,
        enabled: track.enabled,
        readyState: track.readyState,
        muted: track.muted
      })),
      remote: remoteAudio.map(track => ({
        id: track.id,
        kind: track.kind,
        enabled: track.enabled,
        readyState: track.readyState,
        muted: track.muted
      }))
    };
  }

  /**
   * Get detailed connection info for debugging
   */
  getDetailedConnectionInfo() {
    if (!this.peerConnection) {
      return {
        error: 'Peer connection not initialized',
        peerConnection: null
      };
    }

    return {
      connectionState: this.peerConnection.connectionState,
      iceConnectionState: this.peerConnection.iceConnectionState,
      iceGatheringState: this.peerConnection.iceGatheringState,
      signalingState: this.peerConnection.signalingState,
      localDescription: this.peerConnection.localDescription ? {
        type: this.peerConnection.localDescription.type,
        sdp: this.peerConnection.localDescription.sdp.substring(0, 100) + '...'
      } : null,
      remoteDescription: this.peerConnection.remoteDescription ? {
        type: this.peerConnection.remoteDescription.type,
        sdp: this.peerConnection.remoteDescription.sdp.substring(0, 100) + '...'
      } : null,
      senders: this.peerConnection.getSenders().map(s => ({
        track: s.track ? {
          kind: s.track.kind,
          id: s.track.id,
          enabled: s.track.enabled,
          readyState: s.track.readyState
        } : null
      })),
      receivers: this.peerConnection.getReceivers().map(r => ({
        track: r.track ? {
          kind: r.track.kind,
          id: r.track.id,
          enabled: r.track.enabled,
          readyState: r.track.readyState
        } : null
      })),
      localStream: this.localStream ? {
        id: this.localStream.id,
        active: this.localStream.active,
        tracks: this.localStream.getTracks().map(t => ({
          kind: t.kind,
          id: t.id,
          enabled: t.enabled,
          readyState: t.readyState
        }))
      } : null,
      remoteStream: this.remoteStream ? {
        id: this.remoteStream.id,
        active: this.remoteStream.active,
        tracks: this.remoteStream.getTracks().map(t => ({
          kind: t.kind,
          id: t.id,
          enabled: t.enabled,
          readyState: t.readyState
        }))
      } : null
    };
  }

  /**
   * Check if peer connection is ready for screen sharing
   */
  isReadyForScreenShare() {
    if (!this.peerConnection) {
      console.warn('⚠️ Peer connection not initialized');
      return false;
    }

    const state = this.peerConnection.connectionState;
    const iceState = this.peerConnection.iceConnectionState;
    const signalingState = this.peerConnection.signalingState;
    
    console.log('🔗 Screen share readiness check:', {
      connectionState: state,
      iceConnectionState: iceState,
      signalingState: signalingState,
      hasLocalDescription: !!this.peerConnection.localDescription,
      hasRemoteDescription: !!this.peerConnection.remoteDescription
    });

    // Check if we have both local and remote descriptions (SDP exchange completed)
    const hasSdpExchange = this.peerConnection.localDescription && this.peerConnection.remoteDescription;
    
    if (!hasSdpExchange) {
      console.warn('⚠️ SDP exchange not complete');
      return false;
    }

    // More lenient check - allow screen sharing if connection is established
    // Connection can be 'connected' or ICE can be 'connected'/'completed'
    const isConnected = state === 'connected' || 
                        iceState === 'connected' || 
                        iceState === 'completed';
    
    // Also check that we have a stable signaling state
    const isStable = signalingState === 'stable';
    
    const ready = isConnected && isStable && hasSdpExchange;
    
    if (!ready) {
      console.warn('⚠️ Not ready for screen share:', {
        isConnected,
        isStable,
        hasSdpExchange,
        connectionState: state,
        iceConnectionState: iceState,
        signalingState: signalingState
      });
    }
    
    return ready;
  }
  
}

// Export singleton instance
export default new WebRTCPeer();