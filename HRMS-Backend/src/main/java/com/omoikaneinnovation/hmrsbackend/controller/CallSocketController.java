package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.dto.CallSignalDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
@RequiredArgsConstructor
public class CallSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/call.signal")
    public void handleCallSignal(CallSignalDto dto) {

        log.info("ðŸ“ž Call signal received: {} -> {} | Action: {} | Type: {}",
                dto.getFromEmail(), dto.getToEmail(), dto.getAction(), dto.getType());

        if (dto.getToEmail() == null || dto.getFromEmail() == null) {
            log.warn("âŒ Call signal rejected: missing email addresses");
            return;
        }

        // Normalize email addresses (trim and lowercase)
        String fromEmail = dto.getFromEmail().trim().toLowerCase();
        String toEmail = dto.getToEmail().trim().toLowerCase();
        dto.setFromEmail(fromEmail);
        dto.setToEmail(toEmail);

        // Add timestamp for tracking
        dto.setTimestamp(System.currentTimeMillis());

        try {
            log.info("ðŸ“¤ Sending call signal to receiver: {}", toEmail);

            // Send to receiver - this is the critical path for notifications
            messagingTemplate.convertAndSendToUser(
                    toEmail,
                    "/queue/call",
                    dto);

            // For certain actions, also send confirmation to sender
            // ✅ Only send confirmation back to sender for call control signals
            // NOT for WebRTC media signals (OFFER, ANSWER, ICE_CANDIDATE)
            if ("ACCEPT".equals(dto.getAction()) ||
                    "REJECT".equals(dto.getAction()) ||
                    "END".equals(dto.getAction()) ||
                    "ADD_PARTICIPANT".equals(dto.getAction())) {

                log.info("📤 Sending call confirmation to sender: {}", fromEmail);
                messagingTemplate.convertAndSendToUser(fromEmail, "/queue/call", dto);
            }

            log.info("âœ… Call signal forwarded successfully");

        } catch (Exception e) {
            log.error("âŒ Error forwarding call signal: {}", e.getMessage(), e);
        }
    }
}