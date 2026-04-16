package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.Job;
import com.omoikaneinnovation.hmrsbackend.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository repo;

    public JobService(JobRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public Job createJob(Job job) {
        return repo.save(job);
    }

    // GET ALL
    public List<Job> getAllJobs() {
        return repo.findAll();
    }

    // UPDATE STATUS
    public Job updateStatus(String id, String status) {
        Job job = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        job.setStatus(status);
        return repo.save(job);
    }
    public void deleteJob(String id) {
    repo.deleteById(id);
}
}