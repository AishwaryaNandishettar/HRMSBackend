package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.Resignation;
import com.omoikaneinnovation.hmrsbackend.repository.ResignationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResignationService {

    private final ResignationRepository repo;

    public ResignationService(ResignationRepository repo) {
        this.repo = repo;
    }

    public Resignation submit(Resignation r) {
        r.setStatus("PENDING_MANAGER");
        return repo.save(r);
    }

    public List<Resignation> getByEmp(String empId) {
        return repo.findByEmpId(empId);
    }

    public Resignation updateStatus(String id, String status) {
        Resignation r = repo.findById(id).orElseThrow();
        r.setStatus(status);
        return repo.save(r);
    }
}