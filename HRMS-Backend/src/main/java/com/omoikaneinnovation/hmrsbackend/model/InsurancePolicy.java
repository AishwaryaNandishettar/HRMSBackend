package com.omoikaneinnovation.hmrsbackend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "insurance_policy")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InsurancePolicy {

    @Id
    private String id;

    private String companyId;

    private double maxClaimAmount;
    private double reimbursementPercentage;

    private boolean hospitalRequired;
    private boolean travelAllowed;

    private int maxAdmittedDays;

    private List<String> allowedClaimTypes;
}