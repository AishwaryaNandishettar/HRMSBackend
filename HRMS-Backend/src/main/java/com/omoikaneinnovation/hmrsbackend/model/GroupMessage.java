package com.omoikaneinnovation.hmrsbackend.model;
import lombok.Data;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "group_messages")
@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor

public class GroupMessage {

    @Id
    private String id;

    private String groupId;
    private String senderEmail;
    private String content;
    private Instant createdAt;
}
