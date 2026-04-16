package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.dto.ChatMessageDto;
import com.omoikaneinnovation.hmrsbackend.model.ChatMessage;
import com.omoikaneinnovation.hmrsbackend.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.Instant;

@Controller
@RequiredArgsConstructor
public class ChatSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageRepository messageRepository;

    /* ================= SEND MESSAGE ================= */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageDto dto) {

        if (dto == null ||
                dto.getSenderEmail() == null ||
                dto.getReceiverEmail() == null ||
                dto.getContent() == null ||
                dto.getContent().isBlank()) {
            return;
        }

        ChatMessage message = ChatMessage.builder()
                .senderEmail(dto.getSenderEmail())
                .receiverEmail(dto.getReceiverEmail())
                .content(dto.getContent())
                .timestamp(Instant.now())
                .seen(false)
                .delivered(true)
                .build();

        // ✅ SAVE TO MONGODB
        ChatMessage savedMessage = messageRepository.save(message);

        // ✅ SEND TO RECEIVER (PRIVATE QUEUE)
        messagingTemplate.convertAndSendToUser(
                savedMessage.getReceiverEmail(),
                "/queue/messages",
                savedMessage
        );

        // ✅ SEND BACK TO SENDER (PRIVATE QUEUE)
        messagingTemplate.convertAndSendToUser(
                savedMessage.getSenderEmail(),
                "/queue/messages",
                savedMessage
        );
    }
}
