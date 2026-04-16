package com.omoikaneinnovation.hmrsbackend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "hr_reports")
public class HRReport {

    @Id
    private String id;

    private String month;
    private int hires;
    private int exits;
    private int employees;
    private int payroll;
    private int benefits;
    private int training;
}