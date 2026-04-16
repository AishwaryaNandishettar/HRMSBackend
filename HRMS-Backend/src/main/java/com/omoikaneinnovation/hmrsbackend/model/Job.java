package com.omoikaneinnovation.hmrsbackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "jobs")
public class Job {

    @Id
    private String id;

    private String jobTitle;
    private String postedDate;
    private String department;
    private String experience;
    private double salary;
    private String description;
    private String status; // Open / Closed / Interview Stage
private int applicants;
private String location;
private String jobType;
private String designation;
private String ctc;
private String pf;
private String uan;
private String esic;

    // Constructors
    public Job() {}

    public Job(String jobTitle, String department, String experience, double salary, String description, String status) {
        this.jobTitle = jobTitle;
        this.department = department;
        this.experience = experience;
        this.salary = salary;
        this.description = description;
        this.status = status;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) {
    this.id = id;
}

public int getApplicants() {
    return applicants;
}

public void setApplicants(int applicants) {
    this.applicants = applicants;
}

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public double getSalary() { return salary; }
    public void setSalary(double salary) { this.salary = salary; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    // POSTED DATE
public String getPostedDate() {
    return postedDate;
}

public void setPostedDate(String postedDate) {
    this.postedDate = postedDate;
}

// DESIGNATION
public String getDesignation() {
    return designation;
}

public void setDesignation(String designation) {
    this.designation = designation;
}

// CTC
public String getCtc() {
    return ctc;
}

public void setCtc(String ctc) {
    this.ctc = ctc;
}

// PF - PROVIDENT FUND
public String getPf() {
    return pf;
}

public void setPf(String pf) {
    this.pf = pf;
}

// UAN - UNIVERSAL ACCOUNT NUMBER
public String getUan() {
    return uan;
}

public void setUan(String uan) {
    this.uan = uan;
}

// ESIC - EMPLOYEES' STATE INSURANCE CODE
public String getEsic() {
    return esic;
}

public void setEsic(String esic) {
    this.esic = esic;
}
}