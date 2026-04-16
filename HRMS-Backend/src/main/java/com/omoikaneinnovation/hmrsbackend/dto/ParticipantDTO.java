package com.omoikaneinnovation.hmrsbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for participant search and display
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantDTO {
    
    private String id;
    private String name;
    private String email;
    private String department;
    private String designation;
    private String avatar;
    private String type; // "USER" or "EMPLOYEE"
    private boolean active;
    
    /**
     * Get display name for the participant
     */
    public String getDisplayName() {
        return name + " (" + email + ")";
    }
}
