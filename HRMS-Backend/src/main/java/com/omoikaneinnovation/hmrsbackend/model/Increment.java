package com.omoikaneinnovation.hmrsbackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
  
    @Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "increments")
public class Increment {

     @Id
    private String id;

    private String empId;
    private String empName;
    private String department;
    private String managerName;

    private String joiningDate;
    private String tenure;

    private String incrementYear;
    private String letterUrl; // PDF path

    // getters + setters
}