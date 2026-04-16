package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.Task;
import com.omoikaneinnovation.hmrsbackend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository repo;

    // CREATE
    public Task createTask(Task task) {
        return repo.save(task);
    }

    // GET ALL
    public List<Task> getAllTasks() {
        return repo.findAll();
    }

    // UPDATE
    public Task updateTask(String id, Task updatedTask) {
        Task task = repo.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));

        task.setProgress(updatedTask.getProgress());
        task.setStatus(updatedTask.getStatus());
        task.setRemarks(updatedTask.getRemarks());
        task.setFeedback(updatedTask.getFeedback());
        task.setWithdrawn(updatedTask.isWithdrawn());
        task.setTeam(updatedTask.getTeam());
        task.setAcceptedStatus(updatedTask.getAcceptedStatus());
        task.setSubmissionStatus(updatedTask.getSubmissionStatus());
        task.setApprovalStatus(updatedTask.getApprovalStatus());
        task.setAcceptedBy(updatedTask.getAcceptedBy());
        task.setAccepted(updatedTask.isAccepted());
        task.setSubmitted(updatedTask.isSubmitted());

        return repo.save(task);
    }
}