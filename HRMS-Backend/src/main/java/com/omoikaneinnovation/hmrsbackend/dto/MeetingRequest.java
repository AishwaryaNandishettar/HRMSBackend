package com.omoikaneinnovation.hmrsbackend.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Data;
import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeetingRequest {

    private String title;
    private String description;
    private List<String> participantEmails;

    // 👇 frontend sends string
    private String startTime;
    private String endTime;
}
