package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.Performance;
import com.omoikaneinnovation.hmrsbackend.repository.PerformanceRepository;
import org.springframework.stereotype.Service;

@Service
public class PerformanceService {

    private final PerformanceRepository repo;

    public PerformanceService(PerformanceRepository repo) {
        this.repo = repo;
    }

    public Performance getByEmployeeId(String empId) {
        return repo.findByEmployeeId(empId)
                .orElseThrow(() -> new RuntimeException("Performance not found"));
    }
}