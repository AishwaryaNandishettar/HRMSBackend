package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.User;
import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository repo;
    private final BCryptPasswordEncoder encoder;

    public AuthService(UserRepository repo, BCryptPasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    // ✅ REGISTER USER
    public User register(User user) {

             // 👇 ADD THIS LINE (TEMPORARY)
    System.out.println("HASHED PASSWORD: " + encoder.encode("admin123"));

        // prevent duplicate email
        if (repo.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(encoder.encode(user.getPassword()));

        return repo.save(user);
    }

    // ✅ LOGIN
  public User authenticate(String email, String rawPassword) {

    return repo.findByEmail(email)
            .map(user -> {
                System.out.println("Entered Password: " + rawPassword);
                System.out.println("Stored Hash: " + user.getPassword());

                boolean match = encoder.matches(rawPassword, user.getPassword());
                System.out.println("Password Match: " + match);

                return match ? user : null;
            })
            .orElse(null);
}
}
