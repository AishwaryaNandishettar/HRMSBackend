package com.omoikaneinnovation.hmrsbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seen")
@CrossOrigin(origins = "*")
public class SeenController {

    @PostMapping
    public ResponseEntity<Void> markSeen(
            @RequestParam String messageId,
            @RequestParam String userId
    ) {
        // Later we will store seen info in DB
        return ResponseEntity.ok().build();
    }
}
