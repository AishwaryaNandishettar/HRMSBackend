package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.GroupMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GroupMessageRepository
        extends MongoRepository<GroupMessage, String> {

    List<GroupMessage> findByGroupIdOrderByCreatedAtAsc(String groupId);
}
