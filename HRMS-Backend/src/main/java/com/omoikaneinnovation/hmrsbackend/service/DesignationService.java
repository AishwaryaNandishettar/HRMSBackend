package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.Designation;
import com.omoikaneinnovation.hmrsbackend.repository.DesignationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DesignationService {

    @Autowired
    private DesignationRepository repo;

    // ✅ CREATE
    public Designation saveDesignation(Designation designation) {
        return repo.save(designation);
    }

    // ✅ GET ALL
    public List<Designation> getAllDesignations() {
        return repo.findAll();
    }

    // ✅ DELETE
    public void deleteDesignation(String id) {
        repo.deleteById(id);
    }
}