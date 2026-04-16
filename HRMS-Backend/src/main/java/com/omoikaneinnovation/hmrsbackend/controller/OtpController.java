package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/otp")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        
        otpService.generateAndSendOtp(email);

        return ResponseEntity.ok("OTP sent");
    }

    @PostMapping("/verify")
    public boolean verifyOtp(@RequestBody Map<String, String> req) {
        return otpService.verifyOtp(req.get("email"), req.get("otp"));
    }
}