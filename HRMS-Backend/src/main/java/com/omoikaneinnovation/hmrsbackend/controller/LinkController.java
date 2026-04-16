package com.omoikaneinnovation.hmrsbackend.controller;
import com.omoikaneinnovation.hmrsbackend.service.LinkService;
import com.omoikaneinnovation.hmrsbackend.model.User;
import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
import com.omoikaneinnovation.hmrsbackend.security.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/link")
public class LinkController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
private LinkService linkService;

    // Endpoint frontend calls to validate link
    @GetMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestParam String token) {

        try {
            Claims claims = jwtUtil.getClaims(token); // ✅ use existing getClaims() method
            String email = claims.getSubject();

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!user.isActive()) {
                return ResponseEntity.status(403).body("User not active");
            }

            // Optional: check expiration
            if (claims.getExpiration().before(new java.util.Date())) {
                return ResponseEntity.status(403).body("Link expired");
            }

            return ResponseEntity.ok("Link valid. User can access the app.");

        } catch (Exception e) {
            return ResponseEntity.status(403).body("Invalid or expired link");
        }
    }
}