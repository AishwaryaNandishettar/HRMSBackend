package com.omoikaneinnovation.hmrsbackend.dto;

import lombok.Data;

@Data
public class GroupMessageDto {
    private String groupId;
    private String senderEmail;
    private String content;
}
