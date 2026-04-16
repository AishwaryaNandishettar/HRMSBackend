package com.omoikaneinnovation.hmrsbackend.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

// ✅ ADD THESE IMPORTS
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

import com.omoikaneinnovation.hmrsbackend.model.Task;
import com.omoikaneinnovation.hmrsbackend.repository.TaskRepository;

@Controller
public class TaskWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final TaskRepository repo; // ✅ ADD THIS

    public TaskWebSocketController(SimpMessagingTemplate messagingTemplate, TaskRepository repo) {
        this.messagingTemplate = messagingTemplate;
        this.repo = repo; // ✅ ADD THIS
    }

    // 🔥 SEND TASK UPDATE
    @MessageMapping("/task-update")
    public void sendTaskUpdate(Task task) {
        messagingTemplate.convertAndSend("/topic/tasks", task);
    }

    @PostMapping
    public Task create(@RequestBody Task task) {
        Task saved = repo.save(task);

        // 🔥 send real-time update
        messagingTemplate.convertAndSend("/topic/tasks", saved);

        return saved;
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable String id, @RequestBody Task task) {
        task.setId(id);
        Task updated = repo.save(task);

        // 🔥 send real-time update
        messagingTemplate.convertAndSend("/topic/tasks", updated);

        return updated;
    }
}