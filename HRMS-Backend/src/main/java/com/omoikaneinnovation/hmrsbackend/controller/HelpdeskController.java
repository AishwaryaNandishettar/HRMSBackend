package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.HelpdeskTicket;
import com.omoikaneinnovation.hmrsbackend.service.HelpdeskService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/helpdesk")
@CrossOrigin("*")
public class HelpdeskController {

    private final HelpdeskService service;

    public HelpdeskController(HelpdeskService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public HelpdeskTicket create(@RequestBody HelpdeskTicket t) {
        return service.create(t);
    }

    // GET ALL
    @GetMapping
    public List<HelpdeskTicket> getAll() {
        return service.getAll();
    }

    // UPDATE STATUS
    @PutMapping("/{id}")
    public HelpdeskTicket update(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam String resolvedBy
    ) {
        return service.updateStatus(id, status, resolvedBy);
    }
}