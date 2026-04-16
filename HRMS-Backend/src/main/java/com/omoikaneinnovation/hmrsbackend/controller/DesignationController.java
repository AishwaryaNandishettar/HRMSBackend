package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.Designation;
import com.omoikaneinnovation.hmrsbackend.service.DesignationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/designations")
@CrossOrigin(origins = "*") // allow frontend
public class DesignationController {

    @Autowired
    private DesignationService service;

    // ✅ CREATE
    @PostMapping
    public Designation createDesignation(@RequestBody Designation designation) {
        return service.saveDesignation(designation);
    }

    // ✅ GET ALL
    @GetMapping
    public List<Designation> getDesignations() {
        return service.getAllDesignations();
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public void deleteDesignation(@PathVariable String id) {
        service.deleteDesignation(id);
    }
}