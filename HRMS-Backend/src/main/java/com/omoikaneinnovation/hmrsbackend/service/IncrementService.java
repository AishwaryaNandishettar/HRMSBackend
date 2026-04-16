package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.Increment;
import com.omoikaneinnovation.hmrsbackend.repository.IncrementRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncrementService {

    private final IncrementRepository repo;

    public IncrementService(IncrementRepository repo) {
        this.repo = repo;
    }

    public List<Increment> getByEmp(String empId) {
        return repo.findByEmpId(empId);
    }

    public Increment save(Increment inc) {
        return repo.save(inc);
    }
}