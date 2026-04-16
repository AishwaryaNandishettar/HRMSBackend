package com.omoikaneinnovation.hmrsbackend.model;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "chat_groups")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatGroup {

    @Id
    private String id;

    private String name;

    private String adminEmail;

    private List<String> memberEmails;

    private Instant createdAt;
}
