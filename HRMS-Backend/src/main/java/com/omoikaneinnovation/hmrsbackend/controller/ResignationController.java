package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.Resignation;
import com.omoikaneinnovation.hmrsbackend.service.ResignationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resignation")
@CrossOrigin("*")
public class ResignationController {

    private final ResignationService service;

    public ResignationController(ResignationService service) {
        this.service = service;
    }

    @PostMapping("/submit")
    public Resignation submit(@RequestBody Resignation r) {
        return service.submit(r);
    }

    @GetMapping("/{empId}")
    public List<Resignation> getByEmp(@PathVariable String empId) {
        return service.getByEmp(empId);
    }

    @PutMapping("/status/{id}")
    public Resignation update(@PathVariable String id, @RequestParam String status) {
        return service.updateStatus(id, status);
    }
}