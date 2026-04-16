package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.Meeting;
import com.omoikaneinnovation.hmrsbackend.repository.MeetingRepository;
import com.omoikaneinnovation.hmrsbackend.service.MeetingEmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/meetings")
@CrossOrigin(originPatterns = {"http://localhost:*", "https://*.ngrok-free.dev"})
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingRepository meetingRepository;
    private final MeetingEmailService meetingEmailService;

    // ✅ CREATE MEETING (JWT PROTECTED)
    @PostMapping
    public ResponseEntity<Meeting> createMeeting(
            @RequestBody Meeting meeting,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String creatorEmail = authentication.getName();
        
        // ✅ VALIDATE MEETING TIMES - PREVENT PAST DATES
        if (meeting.getStartTime() != null && meeting.getStartTime().isBefore(Instant.now())) {
            return ResponseEntity.badRequest()
                    .header("Content-Type", "application/json")
                    .body(null); // Return error for past dates
        }
        
        if (meeting.getEndTime() != null && meeting.getStartTime() != null && 
            meeting.getEndTime().isBefore(meeting.getStartTime())) {
            return ResponseEntity.badRequest()
                    .header("Content-Type", "application/json")
                    .body(null); // Return error for invalid time range
        }
        
        meeting.setId(null); // ✅ prevent overwrite
        meeting.setCreatedByEmail(creatorEmail);
        meeting.setCreatedAt(Instant.now());
        
        // ✅ ENSURE CREATOR IS INCLUDED IN PARTICIPANTS
        if (meeting.getParticipantEmails() == null) {
            meeting.setParticipantEmails(new java.util.ArrayList<>());
        }
        
        // Add creator email if not already in participants
        if (!meeting.getParticipantEmails().contains(creatorEmail)) {
            meeting.getParticipantEmails().add(creatorEmail);
        }

        // Save meeting first
        Meeting savedMeeting = meetingRepository.save(meeting);
        
        // Send email notifications asynchronously
        try {
            if ("Scheduled".equals(savedMeeting.getStatus())) {
                log.info("Sending meeting invitation emails for meeting: {}", savedMeeting.getId());
                meetingEmailService.sendMeetingInvitation(savedMeeting);
                meetingEmailService.scheduleMeetingReminders(savedMeeting);
            }
        } catch (Exception e) {
            log.error("Failed to send meeting emails for meeting {}: {}", savedMeeting.getId(), e.getMessage(), e);
            // Don't fail the meeting creation if email fails
        }

        return ResponseEntity.ok(savedMeeting);
    }

    // ✅ GET ALL (ADMIN / DEBUG)
    @GetMapping
    public ResponseEntity<List<Meeting>> getAllMeetings() {
        return ResponseEntity.ok(meetingRepository.findAll());
    }

    // ✅ GET USER MEETINGS
    @GetMapping("/user")
    public ResponseEntity<List<Meeting>> getMeetingsByUser(
            @RequestParam String email
    ) {
        return ResponseEntity.ok(
                meetingRepository.findAllMeetingsForUser(email)
        );
    }
    // ✅ UPDATE MEETING
    @PutMapping("/{id}")
    public ResponseEntity<Meeting> updateMeeting(
            @PathVariable String id,
            @RequestBody Meeting meeting,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        // Find existing meeting
        var existingMeetingOpt = meetingRepository.findById(id);
        if (existingMeetingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Meeting existingMeeting = existingMeetingOpt.get();
        String previousStatus = existingMeeting.getStatus();
        
        // ✅ VALIDATE MEETING TIMES - PREVENT PAST DATES (only for rescheduling, not for status changes)
        if (meeting.getStartTime() != null && meeting.getStartTime().isBefore(Instant.now()) && 
            !"Cancelled".equals(meeting.getStatus())) {
            return ResponseEntity.badRequest()
                    .header("Content-Type", "application/json")
                    .body(null); // Return error for past dates
        }
        
        if (meeting.getEndTime() != null && meeting.getStartTime() != null && 
            meeting.getEndTime().isBefore(meeting.getStartTime())) {
            return ResponseEntity.badRequest()
                    .header("Content-Type", "application/json")
                    .body(null); // Return error for invalid time range
        }
        
        // Update the meeting
        Meeting updatedMeeting = existingMeeting;
        updatedMeeting.setTitle(meeting.getTitle());
        updatedMeeting.setStartTime(meeting.getStartTime());
        updatedMeeting.setEndTime(meeting.getEndTime());
        updatedMeeting.setParticipantEmails(meeting.getParticipantEmails());
        updatedMeeting.setRemarks(meeting.getRemarks()); // ✅ ADD REMARKS UPDATE

        // ✅ ADD STATUS AND REPEAT FIELD UPDATES
        if (meeting.getStatus() != null) {
            updatedMeeting.setStatus(meeting.getStatus());
        }
        if (meeting.getRepeat() != null) {
            updatedMeeting.setRepeat(meeting.getRepeat());
        }

        // Save updated meeting
        Meeting savedMeeting = meetingRepository.save(updatedMeeting);
        
        // Send appropriate email notifications
        try {
            String newStatus = savedMeeting.getStatus();
            
            if ("Cancelled".equals(newStatus) && !"Cancelled".equals(previousStatus)) {
                // Meeting was cancelled
                log.info("Sending meeting cancellation emails for meeting: {}", savedMeeting.getId());
                meetingEmailService.sendMeetingCancellation(savedMeeting, "Meeting has been cancelled by the organizer");
                
            } else if ("Scheduled".equals(newStatus) && !"Scheduled".equals(previousStatus)) {
                // Meeting was rescheduled or reactivated
                log.info("Sending meeting update emails for meeting: {}", savedMeeting.getId());
                meetingEmailService.sendMeetingUpdate(savedMeeting, "Meeting details have been updated");
                meetingEmailService.scheduleMeetingReminders(savedMeeting);
                
            } else if ("Scheduled".equals(newStatus) && "Scheduled".equals(previousStatus)) {
                // Meeting details were updated but still scheduled
                log.info("Sending meeting update emails for meeting: {}", savedMeeting.getId());
                meetingEmailService.sendMeetingUpdate(savedMeeting, "Meeting details have been updated");
            }
            
        } catch (Exception e) {
            log.error("Failed to send meeting update emails for meeting {}: {}", savedMeeting.getId(), e.getMessage(), e);
            // Don't fail the meeting update if email fails
        }

        return ResponseEntity.ok(savedMeeting);
    }

    // ✅ DELETE MEETING
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeeting(
            @PathVariable String id,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        if (meetingRepository.existsById(id)) {
            meetingRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}