package com.omoikaneinnovation.hmrsbackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "task")
public class Task {

    @Id
    private String id;

    private String project;
    private String priority;
    private String status;
    private int progress;
    private String deadline;

    private String remarks;
    private String feedback;
    private boolean withdrawn;

    private List<String> team;
    private List<String> feedbackHistory;

    private String assignedDate;

    private String taskId;
    private String sender;
    private String content;
    private String time;

    private String assignedBy;   // admin email/name
private String assignedTo;   // optional (if single user)
private String description;  // task details
private String acceptedStatus; // Not Accepted | Accepted
private String submissionStatus; // Not Submitted | Submitted
private String approvalStatus; // Pending | Approved | Rejected
private List<String> acceptedBy; // employees who accepted
private boolean accepted; // quick flag
private boolean submitted; // quick flag
    // ✅ GETTERS & SETTERS

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProject() { return project; }
    public void setProject(String project) { this.project = project; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public boolean isWithdrawn() { return withdrawn; }
    public void setWithdrawn(boolean withdrawn) { this.withdrawn = withdrawn; }

    public List<String> getTeam() { return team; }
    public void setTeam(List<String> team) { this.team = team; }

    public List<String> getFeedbackHistory() { return feedbackHistory; }
    public void setFeedbackHistory(List<String> feedbackHistory) { this.feedbackHistory = feedbackHistory; }

    public String getAssignedDate() { return assignedDate; }
    public void setAssignedDate(String assignedDate) { this.assignedDate = assignedDate; }

    public String getTaskId(){ return taskId;}
    public void setTaskId(String taskId) {this.taskId=taskId;}

 public String getSender(){ return sender;}
    public void setSender(String sender) {this.sender=sender;}

     public String getContent(){ return content;}
    public void setContent(String content) {this.content=content;}

     public String getTime(){ return time;}
    public void setTime(String time) {this.time=time;}

    public String getAcceptedStatus() { return acceptedStatus; }
    public void setAcceptedStatus(String acceptedStatus) { this.acceptedStatus = acceptedStatus; }

    public String getSubmissionStatus() { return submissionStatus; }
    public void setSubmissionStatus(String submissionStatus) { this.submissionStatus = submissionStatus; }

    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }

    public List<String> getAcceptedBy() { return acceptedBy; }
    public void setAcceptedBy(List<String> acceptedBy) { this.acceptedBy = acceptedBy; }

    public boolean isAccepted() { return accepted; }
    public void setAccepted(boolean accepted) { this.accepted = accepted; }

    public boolean isSubmitted() { return submitted; }
    public void setSubmitted(boolean submitted) { this.submitted = submitted; }

    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

}