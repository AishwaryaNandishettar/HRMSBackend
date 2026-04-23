package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.dto.HomeResponse;
import com.omoikaneinnovation.hmrsbackend.model.User;
import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
import com.omoikaneinnovation.hmrsbackend.service.HomeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
@RestController
@RequestMapping("/api/home")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "https://*.vercel.app", "https://*.ngrok-free.dev"})
public class HomeController {

    private final UserRepository userRepo;
    private final HomeService homeService;

    public HomeController(
            UserRepository userRepo,
            HomeService homeService
    ) {
        this.userRepo = userRepo;
        this.homeService = homeService;
    }

  @GetMapping("/me")
public ResponseEntity<HomeResponse> getMyHome(@RequestParam String email) {

    User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    String role = user.getRole(); // ✅ FIX HERE

    return ResponseEntity.ok(
            homeService.buildEmployeeHome(user, role)
    );
}
 @GetMapping
    public Map<String, Object> getHome(@RequestParam String role) {

        Map<String, Object> data = new HashMap<>();

        data.put("attendanceGraph", List.of()); // dummy for now
        data.put("events", List.of(
            Map.of("date", "10 Apr", "title", "Team Meeting"),
            Map.of("date", "15 Apr", "title", "Holiday")
        ));

        return data;
    }
}
