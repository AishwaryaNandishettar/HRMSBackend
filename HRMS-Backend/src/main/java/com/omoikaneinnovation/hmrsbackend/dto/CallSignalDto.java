package com.omoikaneinnovation.hmrsbackend.dto;

import lombok.Data;

@Data
public class CallSignalDto {

    private String fromEmail;
    private String toEmail;

    private String type; 
    // "VOICE" | "VIDEO"

    private String action; 
    // "CALL" | "ACCEPT" | "REJECT" | "END" | "OFFER" | "ANSWER" | "ICE_CANDIDATE"

    private String data; 
    // SDP / ICE candidate (for WebRTC)
    
    // Enhanced WebRTC fields
    private String callId; // Unique call identifier
    private String sdp; // Session Description Protocol
    private String candidate; // ICE candidate
    private String sdpMid; // Media stream identification
    private Integer sdpMLineIndex; // Media line index
    private Long timestamp; // For call tracking
    private String connectionState; // WebRTC connection state
    private Object participant; // Participant information for ADD_PARTICIPANT action
}