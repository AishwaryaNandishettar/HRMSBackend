package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.Task;
import com.omoikaneinnovation.hmrsbackend.service.TaskService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService service;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /* ================= CREATE ================= */
    @PostMapping
    public Task createTask(@RequestBody Task task) {

        Task saved = service.createTask(task);

        // 🔔 SEND NOTIFICATION TO EACH USER
        if (task.getTeam() != null) {
            for (String user : task.getTeam()) {
                messagingTemplate.convertAndSendToUser(
                        user,
                        "/queue/tasks",
                        saved
                );
            }
        }

        // 🔥 BROADCAST (for dashboard sync)
        messagingTemplate.convertAndSend("/topic/tasks", saved);

        return saved;
    }

    /* ================= GET ================= */
    @GetMapping
    public List<Task> getAllTasks() {
        return service.getAllTasks();
    }

    /* ================= UPDATE ================= */
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable String id, @RequestBody Task task) {

        Task updated = service.updateTask(id, task);

        // 🔥 BROADCAST UPDATE
        messagingTemplate.convertAndSend("/topic/tasks", updated);

        return updated;
    }
}