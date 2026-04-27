package com.omoikaneinnovation.hmrsbackend.service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.*;
import org.springframework.stereotype.Service;
import com.omoikaneinnovation.hmrsbackend.model.LeaveRequest;
import com.omoikaneinnovation.hmrsbackend.model.Attendance;
import com.omoikaneinnovation.hmrsbackend.repository.AttendanceRepository;
import com.omoikaneinnovation.hmrsbackend.repository.LeaveRepository;
import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
import com.omoikaneinnovation.hmrsbackend.dto.HomeResponse;
import com.omoikaneinnovation.hmrsbackend.model.Event;
import com.omoikaneinnovation.hmrsbackend.model.Salary;
import com.omoikaneinnovation.hmrsbackend.model.User;
import com.omoikaneinnovation.hmrsbackend.repository.EventRepository;
import com.omoikaneinnovation.hmrsbackend.repository.SalaryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HomeService {

    private final SalaryRepository salaryRepository;
    private final EventRepository eventRepository;
    private final LeaveRepository leaveRepository;
    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    /* =====================================================
       ENTRY METHOD CALLED FROM CONTROLLER (FIX)
    ===================================================== */
    public HomeResponse buildEmployeeHome(User user, String role) {
        return getHomeData(user.getId(), role);
    }

    /* =====================================================
       INTERNAL LOGIC
    ===================================================== */
    public HomeResponse getHomeData(String userId, String role) {
        
        System.out.println("🔍 HomeService: Processing userId: " + userId + ", role: " + role);

        Salary salary = salaryRepository.findByUserId(userId);
        if (salary == null) {
            System.out.println("🔍 HomeService: No salary found, creating empty salary");
            salary = new Salary();
            salary.setEarnings(List.of());
            salary.setDeductions(List.of());
        }

        /* ===== MAP SALARY ITEMS ===== */
        List<HomeResponse.Item> earnings =
                salary.getEarnings()
                      .stream()
                      .map(i -> new HomeResponse.Item(i.getName(), i.getAmount()))
                      .collect(Collectors.toList());

        List<HomeResponse.Item> deductions =
                salary.getDeductions()
                      .stream()
                      .map(i -> new HomeResponse.Item(i.getName(), i.getAmount()))
                      .collect(Collectors.toList());

        HomeResponse.Salary salaryDto = new HomeResponse.Salary();
        salaryDto.setEarnings(earnings);
        salaryDto.setDeductions(deductions);

        /* ===== MAP EVENTS ===== */
        List<HomeResponse.Event> events =
                eventRepository.findAll()
                        .stream()
                       .map(e -> new HomeResponse.Event(
                           e.getId(),
                           e.getTitle(),
                           e.getDate() != null ? e.getDate().split("T")[0] : null,
                           e.getType(),
                           e.getDescription()
                       ))
                        .collect(Collectors.toList());

        System.out.println("🔍 HomeService: Found " + events.size() + " events");

        /* ===== STATS WITH EMPLOYEE COUNT ===== */
        HomeResponse.Stats stats = new HomeResponse.Stats();
        stats.setTotalDays(21);
        stats.setAvgHours(8.4);
        stats.setLeaves(2);
        
        // Add employee counts for admin/HR roles
        if (role.equalsIgnoreCase("ADMIN") || role.equalsIgnoreCase("HR") || role.equalsIgnoreCase("MANAGER")) {
            System.out.println("🔍 HomeService: Admin/HR role detected, fetching employee counts");
            List<User> allUsers = userRepository.findAll();
            long totalEmployees = allUsers.size();
            long activeEmployees = allUsers.stream()
                .filter(u -> "ACTIVE".equalsIgnoreCase(u.getStatus()))
                .count();
            
            System.out.println("🔍 HomeService: Total users: " + totalEmployees + ", Active: " + activeEmployees);
            
            stats.setTotalEmployees((int) totalEmployees);
            stats.setActiveEmployees((int) activeEmployees);
            
            // ✅ Add leave pending count for admin
            List<LeaveRequest> allLeaves = leaveRepository.findAll();
            long leavePending = allLeaves.stream()
                .filter(l -> "Pending".equalsIgnoreCase(l.getStatus()))
                .count();
            stats.setLeavePending((int) leavePending);
            System.out.println("🔍 HomeService: Pending leaves: " + leavePending);
            
            // ✅ Add payroll total for admin
            List<Salary> allSalaries = salaryRepository.findAll();
            double payrollTotal = allSalaries.stream()
                .mapToDouble(s -> {
                    double totalEarnings = s.getEarnings() != null ? 
                        s.getEarnings().stream().mapToDouble(Salary.Item::getAmount).sum() : 0;
                    double totalDeductions = s.getDeductions() != null ? 
                        s.getDeductions().stream().mapToDouble(Salary.Item::getAmount).sum() : 0;
                    return totalEarnings - totalDeductions;
                })
                .sum();
            stats.setPayrollTotal(payrollTotal);
            System.out.println("🔍 HomeService: Payroll total: " + payrollTotal);
        } else {
            System.out.println("🔍 HomeService: Employee role, skipping employee counts");
        }

        List<Map<String, Object>> attendanceGraph = buildAttendanceGraph(userId);
        List<Map<String, Object>> leaveGraph = buildLeaveGraph(userId, role);

        System.out.println("🔍 HomeService: Built attendance graph with " + attendanceGraph.size() + " entries");
        System.out.println("🔍 HomeService: Built leave graph with " + leaveGraph.size() + " entries");

        HomeResponse response = new HomeResponse();
        response.setStats(stats);
        response.setSalary(salaryDto);
        response.setEvents(events);
        response.setAttendanceGraph(attendanceGraph);
        response.setLeaveGraph(leaveGraph);

        System.out.println("🔍 HomeService: Response created successfully");
        return response;
    }

    private List<Map<String, Object>> buildAttendanceGraph(String userId) {

        List<Attendance> list = attendanceRepository.findByUserId(userId);

        Map<String, Map<String, Integer>> monthly = new HashMap<>();

        for (Attendance a : list) {

           if (a.getDate() == null) continue;
           String month = a.getDate().substring(0, 7);

            monthly.putIfAbsent(month, new HashMap<>());

            Map<String, Integer> m = monthly.get(month);

            m.put("present", m.getOrDefault("present", 0));
            m.put("leave", m.getOrDefault("leave", 0));
            m.put("absent", m.getOrDefault("absent", 0));

            if (a.getCheckIn() != null && !a.getCheckIn().equals("-")) {
                m.put("present", m.get("present") + 1);
            } else {
                m.put("absent", m.get("absent") + 1);
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();

        for (String month : monthly.keySet()) {

            Map<String, Integer> m = monthly.get(month);

            Map<String, Object> obj = new HashMap<>();
            obj.put("month", month);
            obj.put("present", m.get("present"));
            obj.put("leave", m.get("leave"));
            obj.put("absent", m.get("absent"));

            result.add(obj);
        }

        return result;
    }
    
    private List<Map<String, Object>> buildLeaveGraph(String userId, String role) {

       List<LeaveRequest> leaves;

        if (role.equalsIgnoreCase("ADMIN") || role.equalsIgnoreCase("HR") || role.equalsIgnoreCase("MANAGER")) {
            leaves = leaveRepository.findAll();
        } 
        else {
            leaves = leaveRepository.findByUserId(userId);
        }

        Map<String, Map<String, Integer>> data = new LinkedHashMap<>();

        for (LeaveRequest l : leaves) {

            if (l.getStartDate() == null) continue;
            String month = l.getStartDate().substring(0, 7);

            data.putIfAbsent(month, new HashMap<>());

            Map<String, Integer> m = data.get(month);

            m.put("approved", m.getOrDefault("approved", 0));
            m.put("pending", m.getOrDefault("pending", 0));
            m.put("rejected", m.getOrDefault("rejected", 0));

           String status = l.getStatus();

            if (status.equalsIgnoreCase("Approved")) {
                m.put("approved", m.getOrDefault("approved", 0) + 1);
            } else if (status.equalsIgnoreCase("Pending")) {
                m.put("pending", m.getOrDefault("pending", 0) + 1);
            } else {
                m.put("rejected", m.getOrDefault("rejected", 0) + 1);
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();

        for (String month : data.keySet()) {
            Map<String, Object> obj = new HashMap<>();
            obj.put("month", month);
            obj.putAll(data.get(month));
            result.add(obj);
        }

        return result;
    }
}

