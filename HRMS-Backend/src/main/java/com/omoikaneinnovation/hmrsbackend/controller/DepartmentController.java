package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.Department;
import com.omoikaneinnovation.hmrsbackend.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*") // allow frontend
public class DepartmentController {

    @Autowired
    private DepartmentService service;

    @PostMapping
    public Department createDepartment(@RequestBody Department dept) {
          System.out.println("🔥 Department API HIT: " + dept.getName());
        return service.saveDepartment(dept);
    }

    @GetMapping
    public List<Department> getDepartments() {
        return service.getAllDepartments();
    }

    @DeleteMapping("/{id}")
    public void deleteDepartment(@PathVariable String id) {
        service.deleteDepartment(id);
    }
}