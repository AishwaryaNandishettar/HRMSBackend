package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.ChatGroup;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatGroupRepository extends MongoRepository<ChatGroup, String> {

    List<ChatGroup> findByMemberEmailsContaining(String email);
}
