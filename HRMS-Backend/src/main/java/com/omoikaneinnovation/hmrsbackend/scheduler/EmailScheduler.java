package com.omoikaneinnovation.hmrsbackend.scheduler;

import com.omoikaneinnovation.hmrsbackend.repository.EmailQueueRepository;
import com.omoikaneinnovation.hmrsbackend.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "meeting.email.reminders.enabled", havingValue = "true", matchIfMissing = true)
public class EmailScheduler {

    private final EmailService emailService;
    private final EmailQueueRepository emailQueueRepository;

    @Value("${meeting.email.reminders.batch-size:50}")
    private int batchSize;

    /**
     * Process queued emails every minute
     */
    @Scheduled(fixedRate = 60000) // Every 1 minute
    public void processEmailQueue() {
        try {
            log.debug("Starting email queue processing...");
            emailService.processQueuedEmails();
        } catch (Exception e) {
            log.error("Error in email queue processing: {}", e.getMessage(), e);
        }
    }

    /**
     * Retry failed emails every 5 minutes
     */
    @Scheduled(fixedRate = 300000) // Every 5 minutes
    public void retryFailedEmails() {
        try {
            log.debug("Checking for failed emails to retry...");
            
            // Find failed emails that haven't been retried recently
            Instant retryAfter = Instant.now().minus(5, ChronoUnit.MINUTES);
            var failedEmails = emailQueueRepository.findFailedEmailsForRetry(3, retryAfter);
            
            if (!failedEmails.isEmpty()) {
                log.info("Found {} failed emails to retry", failedEmails.size());
                
                for (var email : failedEmails) {
                    // Reset to pending for retry
                    email.setStatus(com.omoikaneinnovation.hmrsbackend.model.EmailQueue.EmailStatus.PENDING);
                    email.setScheduledAt(Instant.now());
                    emailQueueRepository.save(email);
                }
            }
            
        } catch (Exception e) {
            log.error("Error in failed email retry process: {}", e.getMessage(), e);
        }
    }

    /**
     * Clean up old processed emails every hour
     */
    @Scheduled(fixedRate = 3600000) // Every 1 hour
    public void cleanupOldEmails() {
        try {
            log.debug("Cleaning up old processed emails...");
            
            // Delete emails older than 7 days that are sent or cancelled
            Instant cutoffTime = Instant.now().minus(7, ChronoUnit.DAYS);
            emailQueueRepository.deleteOldProcessedEmails(cutoffTime);
            
            log.debug("Completed cleanup of old processed emails");
            
        } catch (Exception e) {
            log.error("Error in email cleanup process: {}", e.getMessage(), e);
        }
    }

    /**
     * Log email queue statistics every 15 minutes
     */
    @Scheduled(fixedRate = 900000) // Every 15 minutes
    public void logEmailQueueStats() {
        try {
            var stats = emailService.getEmailQueueStats();
            
            long totalPending = stats.get("pending");
            long totalProcessing = stats.get("processing");
            long totalFailed = stats.get("failed");
            
            if (totalPending > 0 || totalProcessing > 0 || totalFailed > 0) {
                log.info("Email Queue Stats - Pending: {}, Processing: {}, Sent: {}, Failed: {}, Cancelled: {}", 
                        stats.get("pending"), stats.get("processing"), stats.get("sent"), 
                        stats.get("failed"), stats.get("cancelled"));
            }
            
            // Alert if queue is backing up
            if (totalPending > 100) {
                log.warn("Email queue is backing up! {} emails pending", totalPending);
            }
            
            if (totalFailed > 50) {
                log.warn("High number of failed emails: {}", totalFailed);
            }
            
        } catch (Exception e) {
            log.error("Error logging email queue stats: {}", e.getMessage(), e);
        }
    }

    /**
     * Health check for email system every 5 minutes
     */
    @Scheduled(fixedRate = 300000) // Every 5 minutes
    public void emailSystemHealthCheck() {
        try {
            var stats = emailService.getEmailQueueStats();
            
            long processingEmails = stats.get("processing");
            
            // Check if emails are stuck in processing state
            if (processingEmails > 20) {
                log.warn("Potential email processing bottleneck detected. {} emails stuck in processing state", 
                        processingEmails);
            }
            
        } catch (Exception e) {
            log.error("Error in email system health check: {}", e.getMessage(), e);
        }
    }
}