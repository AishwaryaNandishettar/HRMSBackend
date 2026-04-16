package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.Increment;
import com.omoikaneinnovation.hmrsbackend.service.IncrementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/increment")
@CrossOrigin("*")
public class IncrementController {

    private final IncrementService service;

    public IncrementController(IncrementService service) {
        this.service = service;
    }

    @GetMapping("/{empId}")
    public List<Increment> get(@PathVariable String empId) {
        return service.getByEmp(empId);
    }

    @PostMapping("/add")
    public Increment add(@RequestBody Increment inc) {
        return service.save(inc);
    }
}