package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.EmailQueue;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

/**
 * Repository for managing email queue documents
 */
@Repository
public interface EmailQueueRepository extends MongoRepository<EmailQueue, String> {

    /**
     * Find pending emails that are ready to be sent
     */
    @Query("{ 'status': 'PENDING', 'scheduledAt': { $lte: ?0 } }")
    List<EmailQueue> findPendingEmailsReadyToSend(Instant scheduledTime);

    /**
     * Find failed emails eligible for retry
     */
    @Query("{ 'status': 'FAILED', 'retryCount': { $lt: ?0 }, 'updatedAt': { $lte: ?1 } }")
    List<EmailQueue> findFailedEmailsForRetry(int maxRetries, Instant retryAfter);

    /**
     * Find emails by status
     */
    List<EmailQueue> findByStatus(EmailQueue.EmailStatus status);

    /**
     * Find emails by meeting id
     */
    List<EmailQueue> findByMeetingId(String meetingId);

    /**
     * Count emails by status
     */
    long countByStatus(EmailQueue.EmailStatus status);

    /**
     * Delete old processed emails
     */
    @Query("{ 'status': { $in: ['SENT', 'FAILED', 'CANCELLED'] }, 'updatedAt': { $lte: ?0 } }")
    void deleteOldProcessedEmails(Instant cutoffDate);
}
