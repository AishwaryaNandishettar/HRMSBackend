package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.Performance;
import com.omoikaneinnovation.hmrsbackend.service.PerformanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/performance")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "https://*.vercel.app", "https://*.ngrok-free.dev"})
public class PerformanceController {

    private final PerformanceService service;

    public PerformanceController(PerformanceService service) {
        this.service = service;
    }

    /** GET all performance records (admin/manager view) */
    @GetMapping
    public ResponseEntity<List<Performance>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    /** GET performance for a specific employee */
    @GetMapping("/{employeeId}")
    public ResponseEntity<?> getPerformance(@PathVariable String employeeId) {
        Performance p = service.getByEmployeeId(employeeId);
        if (p == null) return ResponseEntity.ok(null);
        return ResponseEntity.ok(p);
    }

    /** POST / upsert a performance record */
    @PostMapping
    public ResponseEntity<Performance> save(@RequestBody Performance performance) {
        return ResponseEntity.ok(service.save(performance));
    }

    /** POST /seed - Create sample performance data for testing */
    @PostMapping("/seed")
    public ResponseEntity<String> seedSampleData() {
        String result = service.seedSampleData();
        return ResponseEntity.ok(result);
    }

    /** GET /debug - Debug employee data */
    @GetMapping("/debug")
    public ResponseEntity<String> debugEmployeeData() {
        String result = service.debugEmployeeData();
        return ResponseEntity.ok(result);
    }
}