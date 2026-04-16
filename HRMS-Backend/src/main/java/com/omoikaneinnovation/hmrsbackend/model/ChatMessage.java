package com.omoikaneinnovation.hmrsbackend.model;
import lombok.Data;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor

@AllArgsConstructor
@Document(collection = "chat_messages")
public class ChatMessage {

    @Id
    private String id;

    private String senderEmail;
    private String receiverEmail;
    private String content;

    private Instant timestamp;

    private boolean seen;
    private boolean delivered;
}
