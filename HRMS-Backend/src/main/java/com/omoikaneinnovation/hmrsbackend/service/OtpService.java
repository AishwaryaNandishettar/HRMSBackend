package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.OtpToken;
import com.omoikaneinnovation.hmrsbackend.repository.OtpRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    private static final Duration OTP_TTL = Duration.ofMinutes(10);

    private Map<String, String> otpStorage = new HashMap<>();

    @Autowired
    private OtpRepository repo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JavaMailSender mailSender;

    // ✅ EXISTING METHOD (UNCHANGED)
    public void generateAndSendOtp(String email) {

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        OtpToken token = new OtpToken();
        token.setEmail(email);
        token.setOtp(otp);
        token.setCreatedAt(Instant.now());

        repo.save(token);

        emailService.sendOtp(email, otp);
    }

    // ✅ EXISTING METHOD (UNCHANGED)
    public boolean verifyOtp(String email, String otp) {

        return repo.findByEmailAndOtp(email, otp)
                .filter(t -> t.getCreatedAt()
                        .plus(OTP_TTL)
                        .isAfter(Instant.now()))
                .isPresent();
    }

    // ✅ NEW METHOD (SAFE + CORRECT)
    public String generateOtp(String email) {

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        OtpToken token = new OtpToken();
        token.setEmail(email);
        token.setOtp(otp);
        token.setCreatedAt(Instant.now());

        repo.save(token);

        return otp;
    }

    // ✅ NEW METHOD (SEND OTP + LINK IN ONE EMAIL)
    public void sendInviteEmail(String email, String link, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("HRMS Invite - Login Details");
       System.out.println("📩 Sending email to: " + email);
        message.setText(
                "Hello,\n\n" +
                "You are invited to HRMS.\n\n" +

                "Login Details:\n" +
                "Email: " + email + "\n" +
                "Temporary Password (OTP): " + otp + "\n\n" +

                "Click below link:\n" +
                link + "\n\n" +

                "👉 Use OTP as temporary password\n" +
                "👉 Set new password after login\n\n" +

                "Thanks,\nHR Team"
        );

        mailSender.send(message);
        System.out.println("✅ Email sent successfully");
    }
}