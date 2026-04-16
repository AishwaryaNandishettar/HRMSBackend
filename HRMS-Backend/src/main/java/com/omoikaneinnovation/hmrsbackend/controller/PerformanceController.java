package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.Performance;
import com.omoikaneinnovation.hmrsbackend.service.PerformanceService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/performance")
@CrossOrigin(origins = "*")
public class PerformanceController {

    private final PerformanceService service;

    public PerformanceController(PerformanceService service) {
        this.service = service;
    }

    @GetMapping("/{employeeId}")
    public Performance getPerformance(@PathVariable String employeeId) {
        return service.getByEmployeeId(employeeId);
    }
}