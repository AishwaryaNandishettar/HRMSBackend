package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.dto.LoginRequest;
import com.omoikaneinnovation.hmrsbackend.dto.LoginResponse;
import com.omoikaneinnovation.hmrsbackend.model.User;
import com.omoikaneinnovation.hmrsbackend.model.Employee;
import com.omoikaneinnovation.hmrsbackend.security.JwtUtil;
import com.omoikaneinnovation.hmrsbackend.service.AuthService;
import com.omoikaneinnovation.hmrsbackend.repository.EmployeeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = {"http://localhost:*", "https://*.ngrok-free.dev"})
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final EmployeeRepository employeeRepository; // ✅ ADD THIS

    public AuthController(AuthService authService, JwtUtil jwtUtil, EmployeeRepository employeeRepository) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
        this.employeeRepository = employeeRepository; // ✅ ADD THIS
    }

    // REGISTER USER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        User savedUser = authService.register(user);

        return ResponseEntity.ok(savedUser);
    }

    // LOGIN USER
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        // Debug log
        System.out.println("Login attempt for email: " + request.getEmail());

        User user = authService.authenticate(
                request.getEmail(),
                request.getPassword()
        );

        if (user == null) {
            System.out.println("Login failed for email: " + request.getEmail());
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        System.out.println("Login successful for: " + user.getEmail());

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole()
        );

        // ✅ FETCH EMPLOYEE DATA
        Employee emp = employeeRepository.findByEmail(user.getEmail()).orElse(null);

        LoginResponse res = new LoginResponse();
        res.name = user.getName();
        res.email = user.getEmail();
        res.role = user.getRole();
        res.token = token;
        // ✅ SET EMPLOYEE ID
        res.empId = emp != null ? emp.getEmployeeId() : null;
        res.employeeId = emp != null ? emp.getEmployeeId() : null;

        System.out.println("🔥 LOGIN RESPONSE: empId=" + res.empId);

        return ResponseEntity.ok(res);
    }

    // REFRESH TOKEN
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String authHeader) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Invalid authorization header");
        }

        String token = authHeader.substring(7);
        
        try {
            // Even if token is expired, we can still extract the email if it's not too old
            String email = jwtUtil.extractEmail(token);
            String role = jwtUtil.extractRole(token);
            
            // Generate a new token
            String newToken = jwtUtil.generateToken(email, role);
            
            LoginResponse res = new LoginResponse();
            res.email = email;
            res.role = role;
            res.token = newToken;
            
            return ResponseEntity.ok(res);
            
        } catch (Exception e) {
            System.out.println("Token refresh failed: " + e.getMessage());
            return ResponseEntity.status(401).body("Token refresh failed. Please login again.");
        }
    }
}