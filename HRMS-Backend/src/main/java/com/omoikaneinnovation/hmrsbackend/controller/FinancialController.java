package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.FinancialRecord;
import com.omoikaneinnovation.hmrsbackend.service.FinancialService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/financial")
@CrossOrigin
public class FinancialController {

    private final FinancialService service; // ✅ use service

    // ✅ constructor injection
    public FinancialController(FinancialService service) {
        this.service = service;
    }

    // GET
    @GetMapping("/trend")
    public List<FinancialRecord> getTrend() {
        return service.getAll();
    }

    // POST
    @PostMapping
    public FinancialRecord addData(@RequestBody FinancialRecord data) {
        return service.save(data);
    }
}