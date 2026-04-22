package com.omoikaneinnovations.hmrsbackend.controller;

import com.omoikaneinnovations.hmrsbackend.dto.GroupMessageDto;
import com.omoikaneinnovations.hmrsbackend.model.GroupMessage;
import com.omoikaneinnovations.hmrsbackend.repository.GroupMessageRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.Instant;

@Controller
@RequiredArgsConstructor
public class GroupSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final GroupMessageRepository groupMessageRepository;

    @MessageMapping("/group.send")
    public void sendGroupMessage(GroupMessageDto dto) {

        GroupMessage message = GroupMessage.builder()
                .groupId(dto.getGroupId())
                .senderEmail(dto.getSenderEmail())
                .senderName(dto.getSenderName())
                .content(dto.getContent())
                .createdAt(Instant.now())
                .build();

        // âœ… SAVE TO DB
        groupMessageRepository.save(message);

        // âœ… BROADCAST
        messagingTemplate.convertAndSend(
                "/topic/group." + dto.getGroupId(),
                message);
    }
}