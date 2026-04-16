package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.User;
import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
import com.omoikaneinnovation.hmrsbackend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class LinkService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JavaMailSender mailSender;

    public void sendSecureLink(String userEmail, long expiryMillis) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isActive()) {
            throw new RuntimeException("User is not active");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), expiryMillis);
        String link = "http://your-frontend-app.com/app?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Your secure application link");
        message.setText("Hello " + user.getName() + ",\n\n" +
                "Click the link below to access the application:\n" +
                link + "\n\n" +
                "This link will expire in " + (expiryMillis / 1000 / 60) + " minutes.");

        mailSender.send(message);
    }
}