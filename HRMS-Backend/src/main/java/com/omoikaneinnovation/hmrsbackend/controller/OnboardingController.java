package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.security.JwtUtil;
import com.omoikaneinnovation.hmrsbackend.service.OnboardingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.omoikaneinnovation.hmrsbackend.model.OnboardingRecord;
import com.omoikaneinnovation.hmrsbackend.repository.OnboardingRepository;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/onboarding")
public class OnboardingController {

    @Autowired
    private OnboardingService onboardingService;

    @Autowired
    private JwtUtil jwtUtil;   // ✅ ADD THIS


@Autowired
private OnboardingRepository onboardingRepo;
    /**
     * HR creates & invites employee
     */
  @PostMapping("/invite")
public ResponseEntity<?> inviteEmployee(@RequestBody Map<String, Object> request) {

    try {
        onboardingService.onboard(request);
        return ResponseEntity.ok("Employee invited successfully");
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

@PostMapping("/accept-invite")
public ResponseEntity<?> acceptInvite(@RequestBody Map<String, Object> request) {

    String token = (String) request.get("token");
    String email = (String) request.get("email");
    String password = (String) request.get("password");

    // extract email from token (validation step)
    String extractedEmail = jwtUtil.extractUsername(token);

    if (!extractedEmail.equals(email)) {
        return ResponseEntity.status(401).body("Invalid token/email mismatch");
    }

    onboardingService.acceptInvite(email, password);

    return ResponseEntity.ok("User created successfully");
}
    /**
     * Validate onboarding token
     */
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestParam String token) {

        try {

            String email = jwtUtil.extractUsername(token);

            return ResponseEntity.ok(
                    Map.of(
                            "valid", true,
                            "email", email
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.status(401)
                    .body("Invalid or expired link");
        }
    }

    /**
     * Employee submits onboarding form
     */
  @PostMapping("/submit")
public ResponseEntity<?> submit(@RequestBody Map<String,Object> payload){

    String token = (String) payload.get("token");
    String email;

    if (token == null || token.isEmpty()) {

        // ✅ ADMIN DIRECT FLOW
        Map<String, Object> personal = (Map<String, Object>) payload.get("personal");

        if (personal == null || personal.get("email") == null) {
            return ResponseEntity.badRequest().body("Email is required for admin onboarding");
        }

        email = (String) personal.get("email");

        System.out.println("Admin onboarding for email: " + email);

    } else {

        // ✅ TOKEN FLOW
        email = jwtUtil.extractUsername(token);
        System.out.println("Token onboarding for email: " + email);
    }
    // ✅ FLATTEN DATA FOR EMPLOYEE DIRECTORY (DO NOT REMOVE EXISTING)

Map<String, Object> personal = (Map<String, Object>) payload.get("personal");
Map<String, Object> job = (Map<String, Object>) payload.get("job");

if (personal != null && job != null) {
    payload.put("fullName", personal.get("fullName"));
    payload.put("email", personal.get("email"));
    payload.put("phone", personal.get("phone"));

    payload.put("employeeId", job.get("employeeId"));
    payload.put("department", job.get("department"));
    payload.put("designation", job.get("designation"));
    payload.put("location", job.get("workLocation"));

    payload.put("manager", job.get("reportingTo"));
    payload.put("dob", personal.get("dob"));
    payload.put("doj", job.get("joiningDate"));

    payload.put("status", "Active");
}
    onboardingService.submitOnboarding(email, payload);

    return ResponseEntity.ok("Submitted successfully");
}
     @GetMapping("/all")
    public List<OnboardingRecord> getAllOnboardingRecords(){
        return onboardingRepo.findAll();
    }
    @PutMapping("/bgv-update")
public ResponseEntity<?> updateBGVStatus(@RequestBody Map<String,String> request){

    String employeeId = request.get("employeeId");
    String status = request.get("status");

    onboardingService.updateBGVStatus(employeeId,status);

    return ResponseEntity.ok("BGV Status Updated");
}
@PutMapping("/activate")
public ResponseEntity<?> activateEmployee(@RequestBody Map<String,String> request){

    String employeeId = request.get("employeeId");

    onboardingService.activateEmployee(employeeId);

    return ResponseEntity.ok("Employee Account Activated");
}
}