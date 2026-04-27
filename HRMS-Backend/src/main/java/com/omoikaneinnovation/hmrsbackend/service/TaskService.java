package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.Task;
import com.omoikaneinnovation.hmrsbackend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository repo;

    // ── CREATE ──
    public Task createTask(Task task) {
        task.setStatus("ASSIGNED");
        task.setProgress(0);
        task.setCreatedAt(new Date());
        task.setUpdatedAt(new Date());
        if (task.getHistory() == null) task.setHistory(new java.util.ArrayList<>());
        task.getHistory().add("Task created and assigned");
        return repo.save(task);
    }

    // ── GET ALL (admin / manager) ──
    public List<Task> getAllTasks() {
        return repo.findAll();
    }

    // ── GET BY ASSIGNEE (employee) ──
    public List<Task> getTasksByAssignee(String email) {
        return repo.findByAssignee(email);
    }

    // ── GENERIC UPDATE ──
    public Task updateTask(String id, Task updated) {
        Task existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found: " + id));

        if (updated.getStatus() != null && !updated.getStatus().equals(existing.getStatus())) {
            existing.setStatus(updated.getStatus());
            existing.getHistory().add("Status changed to: " + updated.getStatus());
        }
        if (updated.getProgress() > 0) {
            existing.setProgress(updated.getProgress());
        }
        if (updated.getRemarks() != null) {
            existing.setRemarks(updated.getRemarks());
            existing.getHistory().add("Remarks updated");
        }
        if (updated.getRejectReason() != null) {
            existing.setRejectReason(updated.getRejectReason());
        }
        if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if (updated.getPriority() != null) existing.setPriority(updated.getPriority());
        if (updated.getAssignee() != null) existing.setAssignee(updated.getAssignee());
        if (updated.getDueDate() != null) existing.setDueDate(updated.getDueDate());

        existing.setUpdatedAt(new Date());
        return repo.save(existing);
    }

    // ── CHANGE STATUS (accept, submit, approve) ──
    public Task changeStatus(String id, String newStatus, String historyNote) {
        Task task = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found: " + id));
        task.setStatus(newStatus);
        task.getHistory().add(historyNote);
        task.setUpdatedAt(new Date());
        return repo.save(task);
    }

    // ── REJECT ASSIGNMENT ──
    public Task rejectTask(String id, String reason) {
        Task task = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found: " + id));
        task.setStatus("REJECTED");
        task.setRejectReason(reason);
        task.getHistory().add("Task rejected by employee: " + reason);
        task.setUpdatedAt(new Date());
        return repo.save(task);
    }

    // ── UPDATE PROGRESS ──
    public Task updateProgress(String id, int progress) {
        Task task = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found: " + id));
        task.setProgress(progress);
        if (progress >= 100) {
            task.setStatus("IN_PROGRESS");
        } else if (progress > 0) {
            task.setStatus("IN_PROGRESS");
        }
        task.getHistory().add("Progress updated to " + progress + "%");
        task.setUpdatedAt(new Date());
        return repo.save(task);
    }

    // ── REJECT SUBMISSION (manager sends back) ──
    public Task rejectSubmission(String id, String reason) {
        Task task = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found: " + id));
        task.setStatus("IN_PROGRESS");
        task.setRejectReason(reason);
        task.getHistory().add("Submission rejected: " + reason);
        task.setUpdatedAt(new Date());
        return repo.save(task);
    }
}
