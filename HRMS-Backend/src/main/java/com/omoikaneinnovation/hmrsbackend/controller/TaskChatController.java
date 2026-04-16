package com.omoikaneinnovation.hmrsbackend.controller;
import com.omoikaneinnovation.hmrsbackend.model.TaskMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

// ✅ ADD THIS IMPORT
import com.omoikaneinnovation.hmrsbackend.model.TaskMessage;

@Controller
public class TaskChatController {

    private final SimpMessagingTemplate messagingTemplate;

    public TaskChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/task-chat")
    public void sendMessage(TaskMessage message) {
        messagingTemplate.convertAndSend(
                "/topic/task-chat/" + message.getTaskId(),
                message
        );
    }
}