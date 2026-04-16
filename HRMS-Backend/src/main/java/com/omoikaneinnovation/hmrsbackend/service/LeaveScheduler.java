package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.repository.LeaveRepository;
import com.omoikaneinnovation.hmrsbackend.model.LeaveRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveScheduler {

    @Autowired
    private LeaveRepository leaveRepository;

    // 🔥 Runs every month on 1st day at 00:00 AM
    @Scheduled(cron = "0 0 0 1 * ?")
    public void monthlyLeaveJob() {

        System.out.println("🔥 Monthly Leave Scheduler Started");

        List<LeaveRequest> allLeaves = leaveRepository.findAll();

        long pendingCount = allLeaves.stream()
                .filter(l -> "PENDING".equalsIgnoreCase(l.getStatus()))
                .count();

        System.out.println("Pending leaves this month: " + pendingCount);

        // OPTIONAL: You can extend logic here later
        // e.g. auto reject old pending leaves, reset counters, etc.

        System.out.println("🔥 Monthly Leave Scheduler Completed");
    }
}