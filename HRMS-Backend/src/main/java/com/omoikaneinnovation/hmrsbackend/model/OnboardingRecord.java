package com.omoikaneinnovation.hmrsbackend.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Document(collection = "onboarding_records")
public class OnboardingRecord {

    @Id
    private String id;

    private String employeeId;

    private Map<String, Object> personal;
    private Map<String, Object> job;
    private List<Map<String, Object>> experience;
    private Map<String, Object> cibil;
    private Map<String, Object> police;
    private Map<String, Object> residence;
    private List<Map<String, Object>> references;
    private Map<String, Object> documents;
    private List<String> skills;
    private String bgvStatus;
    private Instant submittedAt = Instant.now();
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getEmployeeId() {
        return employeeId;
    }
    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }
    public Map<String, Object> getPersonal() {
        return personal;
    }
    public void setPersonal(Map<String, Object> personal) {
        this.personal = personal;
    }
    public Map<String, Object> getJob() {
        return job;
    }
    public void setJob(Map<String, Object> job) {
        this.job = job;
    }
    public List<Map<String, Object>> getExperience() {
        return experience;
    }
    public void setExperience(List<Map<String, Object>> experience) {
        this.experience = experience;
    }
    public Map<String, Object> getCibil() {
        return cibil;
    }
    public void setCibil(Map<String, Object> cibil) {
        this.cibil = cibil;
    }
    public Map<String, Object> getPolice() {
        return police;
    }
    public void setPolice(Map<String, Object> police) {
        this.police = police;
    }
    public Map<String, Object> getResidence() {
        return residence;
    }
    public void setResidence(Map<String, Object> residence) {
        this.residence = residence;
    }
    public List<Map<String, Object>> getReferences() {
        return references;
    }
    public void setReferences(List<Map<String, Object>> references) {
        this.references = references;
    }
    public Map<String, Object> getDocuments() {
        return documents;
    }
    public void setDocuments(Map<String, Object> documents) {
        this.documents = documents;
    }

    public List<String> getSkills() {
    return skills;
}
public void setSkills(List<String> skills) {
    this.skills = skills;
}
    public String getBgvStatus() {
        return bgvStatus;
    }
    public void setBgvStatus(String bgvStatus) {
        this.bgvStatus = bgvStatus;
    }
    public Instant getSubmittedAt() {
        return submittedAt;
    }
    public void setSubmittedAt(Instant submittedAt) {
        this.submittedAt = submittedAt;
    }

    // getters & setters

    
}

