package com.omoikaneinnovation.hmrsbackend.model;
import lombok.Data;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reimbursements")
public class Reimbursement {

    @Id
    private String id;

    private String empCode;
    private String empName;
private String claimType;

private List<String> files;
    // 🚗 Frontend fields
    private String vehicleType;
    private String incidentDate;
    private String hospitalName;
    private String billNumber;

    private String settlementDate;

    private String travelFromDate;
    private String travelToDate;

    private String fromLocation;
    private String toLocation;
private String state;
private String district;
private String pincode;
    private String policyNumber;

    private double amount;

    private String description;

    private String status = "Pending";
}