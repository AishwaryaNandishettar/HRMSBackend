package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.Attendance;
import com.omoikaneinnovation.hmrsbackend.model.TimesheetSummary;
import com.omoikaneinnovation.hmrsbackend.repository.AttendanceRepository;
import org.springframework.stereotype.Service;
import com.omoikaneinnovation.hmrsbackend.repository.LeaveRepository;
import com.omoikaneinnovation.hmrsbackend.model.LeaveRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.*;

@Service
public class TimesheetService {   // ✅ FIXED NAME

    private final AttendanceRepository repo;
    private final LeaveRepository leaveRepo;

    public TimesheetService(AttendanceRepository repo, LeaveRepository leaveRepo) {  // ✅ MATCHING
        this.repo = repo;
        this.leaveRepo = leaveRepo;
    }

    public List<TimesheetSummary> getMonthlySummary(String month) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
       String userId = auth != null ? auth.getName() : "";

        List<Attendance> data;

        if (auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_EMPLOYEE"))) {

            data = repo.findByUserIdAndDateStartingWith(userId, month);
        } else {
            data = repo.findByDateStartingWith(month);
        }

        List<LeaveRequest> leaveList = leaveRepo.findAll();

        Map<String, TimesheetSummary> map = new HashMap<>();

        for (Attendance r : data) {

            String key = r.getUserId() + "_" + month;

            map.putIfAbsent(key, new TimesheetSummary());
            TimesheetSummary obj = map.get(key);

            obj.setEmpId(r.getUserId());
            obj.setMonth(month);

           boolean isLeave = leaveList.stream().anyMatch(l ->
        l.getUserId() != null &&
        r.getUserId() != null &&
        l.getUserId().equals(r.getUserId()) &&
        l.getStartDate() != null &&
        r.getDate() != null &&
        l.getStartDate().equals(r.getDate()) &&
        "APPROVED".equalsIgnoreCase(l.getStatus())
);

            if (isLeave) {
                obj.setLeave(obj.getLeave() + 1);
                continue;
            }

            int checkIn = toMin(r.getCheckIn());
            int checkOut = toMin(r.getCheckOut());
            int worked = checkOut - checkIn;

            if (worked <= 0) {
                obj.setLop(obj.getLop() + 1);
            } else {

                if (worked >= 360) obj.setPresent(obj.getPresent() + 1);
                else obj.setHalfDay(obj.getHalfDay() + 1);

                if (checkIn > 555) obj.setLate(obj.getLate() + 1);

                obj.setAvgHours(obj.getAvgHours() + worked);
            }
        }

        for (TimesheetSummary t : map.values()) {
            t.setAvgHours(t.getAvgHours() / 60.0);
            t.setApproval("Pending");
        }

        return new ArrayList<>(map.values());
    }

  private int toMin(String t) {
    if (t == null || !t.contains(":")) return 0;
    String[] parts = t.split(":");
    return Integer.parseInt(parts[0]) * 60 + Integer.parseInt(parts[1]);
}

    public String approve(String empId, String month) {
    // you can store in DB later
    return "Approved for " + empId;
}
}