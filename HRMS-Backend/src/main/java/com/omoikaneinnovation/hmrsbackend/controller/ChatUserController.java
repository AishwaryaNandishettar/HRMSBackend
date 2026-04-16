package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.User;
import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(originPatterns = {"http://localhost:*", "https://*.ngrok-free.dev"})
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

