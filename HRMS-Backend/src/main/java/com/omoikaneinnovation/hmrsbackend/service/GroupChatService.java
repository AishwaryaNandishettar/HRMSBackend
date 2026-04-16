package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.dto.CreateGroupRequest;
import com.omoikaneinnovation.hmrsbackend.model.ChatGroup;
import com.omoikaneinnovation.hmrsbackend.repository.ChatGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.time.Instant;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupChatService {

    private final ChatGroupRepository groupRepository;

    /* ===============================
       CREATE GROUP
       =============================== */
    public ChatGroup createGroup(
            String adminEmail,
            CreateGroupRequest request
    ) {

        HashSet<String> members =
                new HashSet<>(request.getMembers());

        members.add(adminEmail);

        ChatGroup group = ChatGroup.builder()
                .name(request.getGroupName())
                .adminEmail(adminEmail)
                .memberEmails(members.stream().toList())
                .createdAt(Instant.now())
                .build();

        return groupRepository.save(group);
    }

    /* ===============================
       GET MY GROUPS
       =============================== */
    public List<ChatGroup> getGroupsForUser(String email) {
        return groupRepository
                .findByMemberEmailsContaining(email);
    }

    /* ===============================
       ADD MEMBERS (ADMIN ONLY)
       =============================== */
    public ChatGroup addMembers(
            String adminEmail,
            String groupId,
            List<String> newMembers
    ) {

        ChatGroup group = groupRepository.findById(groupId)
                .orElseThrow(() ->
                        new RuntimeException("Group not found")
                );

        if (!group.getAdminEmail().equals(adminEmail)) {
            throw new RuntimeException("Only admin can add members");
        }

        HashSet<String> updatedMembers =
                new HashSet<>(group.getMemberEmails());

        updatedMembers.addAll(newMembers);
        updatedMembers.add(adminEmail); // safety

        group.setMemberEmails(updatedMembers.stream().toList());
        return groupRepository.save(group);
    }

    /* ===============================
       REMOVE MEMBER (ADMIN ONLY)
       =============================== */
    public ChatGroup removeMember(
            String adminEmail,
            String groupId,
            String memberEmail
    ) {

        ChatGroup group = groupRepository.findById(groupId)
                .orElseThrow(() ->
                        new RuntimeException("Group not found")
                );

        if (!group.getAdminEmail().equals(adminEmail)) {
            throw new RuntimeException("Only admin can remove members");
        }

        if (adminEmail.equals(memberEmail)) {
            throw new RuntimeException("Admin cannot remove self");
        }

        List<String> updatedMembers =
                group.getMemberEmails()
                        .stream()
                        .filter(e -> !e.equals(memberEmail))
                        .toList();

        group.setMemberEmails(updatedMembers);
        return groupRepository.save(group);
    }
}
