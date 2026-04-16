package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.Department;
import com.omoikaneinnovation.hmrsbackend.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository repo;

    // ✅ CREATE
    public Department saveDepartment(Department dept) {
        return repo.save(dept);
    }

    // ✅ GET ALL
    public List<Department> getAllDepartments() {
        return repo.findAll();
    }

    // ✅ DELETE
    public void deleteDepartment(String id) {   // 🔥 FIXED: Long → String
        repo.deleteById(id);
    }
}