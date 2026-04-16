package com.omoikaneinnovation.hmrsbackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reports")
public class Report {

    @Id
    private String id;

    private String month;
    private int hires;
    private int exits;
    private int employees;



    // getters & setters
    public String getMonth() { return month; }
public void setMonth(String month) { this.month = month; }

public int getHires() { return hires; }
public void setHires(int hires) { this.hires = hires; }

public int getExits() { return exits; }
public void setExits(int exits) { this.exits = exits; }

public int getEmployees() { return employees; }
public void setEmployees(int employees) { this.employees = employees; }
}