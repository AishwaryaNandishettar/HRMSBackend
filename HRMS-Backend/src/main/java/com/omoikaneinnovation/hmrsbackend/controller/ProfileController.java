package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.User;
import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
import com.omoikaneinnovation.hmrsbackend.dto.ProfileResponse;
import com.omoikaneinnovation.hmrsbackend.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/employee")
@CrossOrigin("*")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired   // ✅ ADD THIS
    private ProfileService profileService;

    @GetMapping("/me")
    public User getMyProfile(Principal principal) {

        String email = principal.getName(); // comes from JWT

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

     @GetMapping("/profile")
    public ProfileResponse getProfile(@RequestParam String empId) {
        return profileService.getMyProfile(empId);
    }

    @PutMapping("/update-job")
public User updateJobDetails(@RequestBody User updatedUser, Principal principal) {

    String email = principal.getName();

    User existing = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // ✅ update only job fields
    existing.setDesignation(updatedUser.getDesignation());
    existing.setDepartment(updatedUser.getDepartment());
    existing.setJoiningDate(updatedUser.getJoiningDate());
    existing.setTotalExp(updatedUser.getTotalExp());
    existing.setCurrentExp(updatedUser.getCurrentExp());
    existing.setPf(updatedUser.getPf());
    existing.setUan(updatedUser.getUan());
    existing.setEsic(updatedUser.getEsic());

    existing.setManagerId(updatedUser.getManagerId()); // optional

    return userRepository.save(existing);
}
}