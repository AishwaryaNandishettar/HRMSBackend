package com.omoikaneinnovation.hmrsbackend.dto;
import lombok.Data;

@Data
public class ProfileResponse {

    private String employeeId;
    private String name;
    private String department;

    private String managerId;
    private String managerName;
}