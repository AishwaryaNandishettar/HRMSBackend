package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.dto.AdminDTO;
import com.omoikaneinnovation.hmrsbackend.model.Admin;
import com.omoikaneinnovation.hmrsbackend.service.AdminService;
import com.omoikaneinnovation.hmrsbackend.service.LinkService; // ✅ import LinkService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;      // ✅ Add this
import java.util.HashMap;  // ✅ Add this

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private LinkService linkService; // ✅ Add this

    @PostMapping("/register")
    public ResponseEntity<Admin> register(@RequestBody AdminDTO adminDTO) {
        Admin admin = new Admin(adminDTO.getName(), adminDTO.getEmail(), adminDTO.getPassword());
        return ResponseEntity.ok(adminService.createAdmin(admin));
    }

    @PostMapping("/login")
public ResponseEntity<Map<String, String>> login(@RequestBody AdminDTO adminDTO) {
    String token = adminService.loginAndGetToken(adminDTO.getEmail(), adminDTO.getPassword());
    Map<String, String> response = new HashMap<>();
    response.put("token", token);
    return ResponseEntity.ok(response);
}

    @PostMapping("/send-link/{email}")
    public ResponseEntity<String> sendLink(@PathVariable String email, @RequestParam long hours) {
        long expiryMillis = hours * 60 * 60 * 1000; // convert hours to milliseconds
        linkService.sendSecureLink(email, expiryMillis);
        return ResponseEntity.ok("Secure link sent to " + email);
    }
}