package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.User;
import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
import com.omoikaneinnovation.hmrsbackend.dto.ProfileResponse;
import com.omoikaneinnovation.hmrsbackend.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/employee")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        return userRepository.findByEmail(userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/profile")
    public ProfileResponse getProfile(@RequestParam String empId) {
        return profileService.getMyProfile(empId);
    }

    @PutMapping("/update-job")
    public ResponseEntity<?> updateJobDetails(
            @RequestBody User updatedUser,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized - please log in again");
        }

        String email = userDetails.getUsername();

        User existing = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        // update only non-null job fields
        if (updatedUser.getDesignation()    != null) existing.setDesignation(updatedUser.getDesignation());
        if (updatedUser.getDepartment()     != null) existing.setDepartment(updatedUser.getDepartment());
        if (updatedUser.getJoiningDate()    != null) existing.setJoiningDate(updatedUser.getJoiningDate());
        if (updatedUser.getTotalExp()       != null) existing.setTotalExp(updatedUser.getTotalExp());
        if (updatedUser.getCurrentExp()     != null) existing.setCurrentExp(updatedUser.getCurrentExp());
        if (updatedUser.getPf()             != null) existing.setPf(updatedUser.getPf());
        if (updatedUser.getUan()            != null) existing.setUan(updatedUser.getUan());
        if (updatedUser.getEsic()           != null) existing.setEsic(updatedUser.getEsic());
        if (updatedUser.getEmploymentType() != null) existing.setEmploymentType(updatedUser.getEmploymentType());
        if (updatedUser.getLocation()       != null) existing.setLocation(updatedUser.getLocation());
        if (updatedUser.getManagerName()    != null) existing.setManagerName(updatedUser.getManagerName());
        if (updatedUser.getHrName()         != null) existing.setHrName(updatedUser.getHrName());
        if (updatedUser.getManagerId()      != null) existing.setManagerId(updatedUser.getManagerId());

        User saved = userRepository.save(existing);
        return ResponseEntity.ok(saved);
    }
}