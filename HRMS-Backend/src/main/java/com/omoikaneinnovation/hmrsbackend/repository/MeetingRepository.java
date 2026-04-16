package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.Meeting;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingRepository
        extends MongoRepository<Meeting, String> {

    // Find meetings where user is a participant
    List<Meeting> findByParticipantEmailsContaining(String email);
    
    // Find meetings created by user
    List<Meeting> findByCreatedByEmail(String email);
    
    // Find all meetings for a user (created by them OR they're a participant)
    @Query("{ $or: [ { 'createdByEmail': ?0 }, { 'participantEmails': { $in: [?0] } } ] }")
    List<Meeting> findAllMeetingsForUser(String email);
}