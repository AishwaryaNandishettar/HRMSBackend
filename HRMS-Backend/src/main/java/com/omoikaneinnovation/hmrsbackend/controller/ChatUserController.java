package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.User;
import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5176", "http://127.0.0.1:5173", "http://127.0.0.1:5176", "https://hrmsbackendfullrenderingapplication.vercel.app", "https://hrmsbackendfrontendapp.vercel.app", "https://hrmsbackendapplication.vercel.app"})
public class ChatUserController {

    private final UserRepository userRepository;

    public ChatUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public List<User> getChatUsers() {
        return userRepository.findAll();
    }
}

