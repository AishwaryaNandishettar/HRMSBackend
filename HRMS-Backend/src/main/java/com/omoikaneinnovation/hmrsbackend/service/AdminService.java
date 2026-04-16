package com.omoikaneinnovation.hmrsbackend.service;
import com.omoikaneinnovation.hmrsbackend.security.JwtUtil;  // ✅ Add this
import com.omoikaneinnovation.hmrsbackend.model.Admin;
import com.omoikaneinnovation.hmrsbackend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

@Autowired
private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Admin createAdmin(Admin admin) {
        // Hash password before saving
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepository.save(admin);
    }

    public Admin login(String email, String password) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        if (passwordEncoder.matches(password, admin.getPassword())) {
            return admin;
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    public String loginAndGetToken(String email, String password) {
    Admin admin = login(email, password); // your existing login method
    return jwtUtil.generateToken(admin.getEmail(), admin.getRole());
}
}