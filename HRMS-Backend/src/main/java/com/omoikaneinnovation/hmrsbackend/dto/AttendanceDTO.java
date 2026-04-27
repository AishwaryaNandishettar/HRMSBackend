package com.omoikaneinnovation.hmrsbackend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceDTO {
    private String id;
    private String userId;
    private String empId;          // proper employee ID like EMP001
    private String name;
    private String department;
    private String reportingManager; // reporting manager name
    private String date;
    private String checkIn;
    private String checkOut;
    private int workedMinutes;
}
