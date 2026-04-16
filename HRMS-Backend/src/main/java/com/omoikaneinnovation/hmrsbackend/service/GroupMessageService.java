package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.GroupMessage;
import com.omoikaneinnovation.hmrsbackend.repository.GroupMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupMessageService {

    private final GroupMessageRepository repository;

    public GroupMessage save(
            String groupId,
            String senderEmail,
            String content
    ) {
        GroupMessage msg = GroupMessage.builder()
                .groupId(groupId)
                .senderEmail(senderEmail)
                .content(content)
                .createdAt(Instant.now())
                .build();

        return repository.save(msg);
    }

    public List<GroupMessage> getHistory(String groupId) {
        return repository.findByGroupIdOrderByCreatedAtAsc(groupId);
    }
}

