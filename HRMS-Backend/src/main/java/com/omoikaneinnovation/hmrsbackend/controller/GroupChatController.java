package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.dto.CreateGroupRequest;
import com.omoikaneinnovation.hmrsbackend.dto.AddGroupMembersRequest;
import com.omoikaneinnovation.hmrsbackend.model.ChatGroup;
import com.omoikaneinnovation.hmrsbackend.model.GroupMessage;
import com.omoikaneinnovation.hmrsbackend.repository.GroupMessageRepository;
import com.omoikaneinnovation.hmrsbackend.service.GroupChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat/groups")
@RequiredArgsConstructor
public class GroupChatController {

    private final GroupChatService groupChatService;
    private final GroupMessageRepository groupMessageRepository;

    // 1️⃣ CREATE GROUP
    @PostMapping("/create")
    public ChatGroup createGroup(
            Authentication auth,
            @RequestBody CreateGroupRequest request
    ) {
        return groupChatService.createGroup(auth.getName(), request);
    }

    // 2️⃣ GET MY GROUPS
    @GetMapping("/my")
    public List<ChatGroup> myGroups(Authentication auth) {
        return groupChatService.getGroupsForUser(auth.getName());
    }

    // 3️⃣ GET GROUP CHAT HISTORY
    @GetMapping("/{groupId}/messages")
    public List<GroupMessage> getGroupMessages(
            @PathVariable String groupId
    ) {
        return groupMessageRepository
                .findByGroupIdOrderByCreatedAtAsc(groupId);
    }

    // 4️⃣ ADD MEMBERS (ADMIN ONLY)
    @PostMapping("/{groupId}/members")
    public ChatGroup addMembers(
            Authentication auth,
            @PathVariable String groupId,
            @RequestBody AddGroupMembersRequest request
    ) {
        return groupChatService.addMembers(
                auth.getName(),
                groupId,
                request.getMembers()
        );
    }

    // 5️⃣ REMOVE MEMBER (ADMIN ONLY)
    @DeleteMapping("/{groupId}/members/{email}")
    public ChatGroup removeMember(
            Authentication auth,
            @PathVariable String groupId,
            @PathVariable String email
    ) {
        return groupChatService.removeMember(
                auth.getName(),
                groupId,
                email
        );
    }
}
