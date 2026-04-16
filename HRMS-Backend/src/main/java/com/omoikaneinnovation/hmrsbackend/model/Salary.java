package com.omoikaneinnovation.hmrsbackend.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

import java.util.*;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "salaries")
public class Salary {

    @Id
    private String id;
    private String userId;
    private List<Item> earnings;
    private List<Item> deductions;

    @Data
    public static class Item {
        private String name;
        private double amount;
    }
}
