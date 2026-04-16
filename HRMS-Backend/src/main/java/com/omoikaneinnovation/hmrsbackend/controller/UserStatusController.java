package com.omoikaneinnovation.hmrsbackend.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class UserStatusController {

    private final SimpMessagingTemplate messagingTemplate;

    public UserStatusController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/user-status")
    public void updateStatus(String username) {
        messagingTemplate.convertAndSend("/topic/status", username);
    }
}