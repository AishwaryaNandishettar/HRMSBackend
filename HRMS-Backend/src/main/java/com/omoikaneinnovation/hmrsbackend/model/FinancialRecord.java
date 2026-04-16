package com.omoikaneinnovation.hmrsbackend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "financial") // ✅ Mongo
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancialRecord {

    @Id
    private String id; // ✅ String for Mongo

    private String month;

    private double revenue;
    private double expense;
    private double profit;
    private double loss;
}