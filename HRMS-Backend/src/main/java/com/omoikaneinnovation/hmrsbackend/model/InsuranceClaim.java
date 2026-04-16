package com.omoikaneinnovation.hmrsbackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;


@Data
@Document(collection = "insurance_claims")
public class InsuranceClaim {

    @Id
    private String id;

    private String employeeName;
    private String employeeCode;
    private String department;

    private String claimType;
    private String incidentDate;

    private int admittedDays;
    private double amount;

    private String description;
    private String companyId;

    private String hospitalName;
    private java.util.Date travelFromDate;

    private double approvedAmount;

   public enum Status {
    SUBMITTED,
    MANAGER_APPROVED,
    HR_APPROVED,
    INSURANCE_APPROVED,
    REJECTED,
    SETTLED
}

    private Status status;
}