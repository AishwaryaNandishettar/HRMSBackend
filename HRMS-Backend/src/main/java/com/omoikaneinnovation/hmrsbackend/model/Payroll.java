package com.omoikaneinnovation.hmrsbackend.model;
import lombok.Data;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Document(collection = "payroll")
public class Payroll {

    @Id
    private String id;


    private String employeeId;
    private String empCode;
private String department;
    private Double basic;
    private Double hra;
    private Double allowance;
    private Double incentive;
    private Double tax;
    private Double pf;
    private Double insurance;

private Double esi;
private Double deduction;
private Double bonus;
private Double gross;
private Double net;
    
private String month;      // 2026-04
private Long updatedAt;    // timestamp
private String birthDate;
private Boolean isActive;
private String recordStatus;   // ACTIVE / INACTIVE ✅ (for filtering)
private String payrollStatus;  // INITIATED / PROCESSING / SUCCESSFUL ✅
private String status; // INITIATED, PROCESSING, SUCCESSFUL
private String salaryStatus; // PENDING / CREDITED

private int workingDays;
private int paidDays;
private int lopDays;
public int getWorkingDays() { return workingDays; }
public void setWorkingDays(int workingDays) { this.workingDays = workingDays; }

public int getPaidDays() { return paidDays; }
public void setPaidDays(int paidDays) { this.paidDays = paidDays; }

public int getLopDays() { return lopDays; }
public void setLopDays(int lopDays) { this.lopDays = lopDays; }
}