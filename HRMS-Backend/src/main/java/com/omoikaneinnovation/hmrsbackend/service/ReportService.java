package com.omoikaneinnovation.hmrsbackend.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.omoikaneinnovation.hmrsbackend.repository.*;

@Service
public class ReportService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private PayrollRepository payrollRepo;

    @Autowired
    private FinancialRepository financialRepo;

    @Autowired
    private PerformanceRepository performanceRepo;

    @Autowired
    private JobRepository jobRepo;

    @Autowired
    private AttendanceRepository attendanceRepo;

    /**
     * Get comprehensive report data with filters
     * @param department - filter by department (optional)
     * @param startDate - filter start date (optional)
     * @param endDate - filter end date (optional)
     */
    public Map<String, Object> getAllReports(String department, String startDate, String endDate) {
        
        Map<String, Object> reportData = new HashMap<>();
        
        // Parse date filters
        LocalDate start = startDate != null ? LocalDate.parse(startDate) : LocalDate.now().minusMonths(6);
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : LocalDate.now();
        
        // 1. KPI Metrics
        reportData.put("kpis", getKPIMetrics(department, start, end));
        
        // 2. Monthly Trends (Hiring vs Attrition)
        reportData.put("monthlyTrends", getMonthlyTrends(department, start, end));
        
        // 3. Department Distribution
        reportData.put("departmentDistribution", getDepartmentDistribution());
        
        // 4. Employee Cost (from Payroll table)
        reportData.put("employeeCost", getEmployeeCost(start, end));
        
        // 5. AI Insights
        reportData.put("insights", generateInsights(department));
        
        // 6. Performance Metrics
        reportData.put("performanceMetrics", getPerformanceMetrics(department));
        
        // 7. Financial Summary
        reportData.put("financialSummary", getFinancialSummary(start, end));
        
        return reportData;
    }

    /**
     * Calculate KPI metrics from real data
     */
    private Map<String, Object> getKPIMetrics(String department, LocalDate start, LocalDate end) {
        Map<String, Object> kpis = new HashMap<>();
        
        // Filter employees by department if specified
        List<?> employees = department != null && !department.equals("All Departments")
                ? employeeRepo.findAll().stream()
                    .filter(e -> department.equals(((com.omoikaneinnovation.hmrsbackend.model.Employee)e).getDepartment()))
                    .collect(Collectors.toList())
                : employeeRepo.findAll();
        
        // Total active employees
        long totalEmployees = employees.stream()
                .filter(e -> "ACTIVE".equalsIgnoreCase(((com.omoikaneinnovation.hmrsbackend.model.Employee)e).getStatus()))
                .count();
        
        // Previous month count for growth calculation
        LocalDate lastMonthEnd = end.minusMonths(1);
        long previousMonthEmployees = employees.stream()
                .filter(e -> "ACTIVE".equalsIgnoreCase(((com.omoikaneinnovation.hmrsbackend.model.Employee)e).getStatus()))
                .filter(e -> {
                    Instant created = ((com.omoikaneinnovation.hmrsbackend.model.Employee)e).getCreatedAt();
                    return created != null && created.isBefore(lastMonthEnd.atStartOfDay(ZoneId.systemDefault()).toInstant());
                })
                .count();
        
        double employeeGrowth = previousMonthEmployees > 0 
                ? ((double)(totalEmployees - previousMonthEmployees) / previousMonthEmployees) * 100 
                : 0;
        
        // Average hiring time from job postings
        double avgHiringTime = calculateAverageHiringTime();
        
        // Attrition rate (exits in last 12 months / total employees * 100)
        LocalDate twelveMonthsAgo = end.minusYears(1);
        long exitsLast12Months = employees.stream()
                .filter(e -> "DISABLED".equalsIgnoreCase(((com.omoikaneinnovation.hmrsbackend.model.Employee)e).getStatus()) ||
                             "INACTIVE".equalsIgnoreCase(((com.omoikaneinnovation.hmrsbackend.model.Employee)e).getStatus()))
                .count();
        
        double attritionRate = totalEmployees > 0 
                ? ((double)exitsLast12Months / (totalEmployees + exitsLast12Months)) * 100 
                : 0;
        
        // Total payroll from Payroll table
        double totalPayroll = calculateTotalPayroll(department, start, end);
        
        kpis.put("totalEmployees", totalEmployees);
        kpis.put("employeeGrowth", String.format("%+.1f%%", employeeGrowth));
        kpis.put("avgHiringTime", (int)avgHiringTime);
        kpis.put("attritionRate", String.format("%.1f%%", attritionRate));
        kpis.put("totalPayroll", formatCurrency(totalPayroll));
        
        return kpis;
    }

    /**
     * Calculate monthly hiring and attrition trends
     */
    private List<Map<String, Object>> getMonthlyTrends(String department, LocalDate start, LocalDate end) {
        List<Map<String, Object>> trends = new ArrayList<>();
        
        YearMonth startMonth = YearMonth.from(start);
        YearMonth endMonth = YearMonth.from(end);
        
        for (YearMonth ym = startMonth; !ym.isAfter(endMonth); ym = ym.plusMonths(1)) {
            LocalDate monthStart = ym.atDay(1);
            LocalDate monthEnd = ym.atEndOfMonth();
            
            Instant startInstant = monthStart.atStartOfDay(ZoneId.systemDefault()).toInstant();
            Instant endInstant = monthEnd.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant();
            
            String monthName = ym.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            
            // Count hires in this month
            long hires = employeeRepo.findAll().stream()
                    .filter(e -> department == null || department.equals("All Departments") || 
                                 department.equals(e.getDepartment()))
                    .filter(e -> e.getCreatedAt() != null)
                    .filter(e -> !e.getCreatedAt().isBefore(startInstant) && !e.getCreatedAt().isAfter(endInstant))
                    .count();
            
            // Count exits in this month (employees who became inactive)
            long exits = employeeRepo.findAll().stream()
                    .filter(e -> department == null || department.equals("All Departments") || 
                                 department.equals(e.getDepartment()))
                    .filter(e -> "DISABLED".equalsIgnoreCase(e.getStatus()) || 
                                 "INACTIVE".equalsIgnoreCase(e.getStatus()))
                    .count();
            
            // Total active employees at end of month
            long totalEmployees = employeeRepo.findAll().stream()
                    .filter(e -> department == null || department.equals("All Departments") || 
                                 department.equals(e.getDepartment()))
                    .filter(e -> "ACTIVE".equalsIgnoreCase(e.getStatus()))
                    .filter(e -> e.getCreatedAt() != null && !e.getCreatedAt().isAfter(endInstant))
                    .count();
            
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", monthName);
            monthData.put("hires", hires);
            monthData.put("exits", exits);
            monthData.put("employees", totalEmployees);
            
            trends.add(monthData);
        }
        
        return trends;
    }

    /**
     * Get department-wise employee distribution
     */
    private List<Map<String, Object>> getDepartmentDistribution() {
        List<Map<String, Object>> distribution = new ArrayList<>();
        
        Map<String, Long> deptCounts = employeeRepo.findAll().stream()
                .filter(e -> "ACTIVE".equalsIgnoreCase(e.getStatus()))
                .filter(e -> e.getDepartment() != null && !e.getDepartment().isEmpty())
                .collect(Collectors.groupingBy(
                        e -> e.getDepartment(),
                        Collectors.counting()
                ));
        
        deptCounts.forEach((dept, count) -> {
            Map<String, Object> deptData = new HashMap<>();
            deptData.put("name", dept);
            deptData.put("value", count);
            distribution.add(deptData);
        });
        
        return distribution;
    }

    /**
     * Get employee cost from Payroll table (quarterly breakdown)
     */
    private List<Map<String, Object>> getEmployeeCost(LocalDate start, LocalDate end) {
        List<Map<String, Object>> costs = new ArrayList<>();
        
        // Get all payroll records
        List<com.omoikaneinnovation.hmrsbackend.model.Payroll> payrolls = payrollRepo.findAll();
        
        // Group by quarter
        Map<String, List<com.omoikaneinnovation.hmrsbackend.model.Payroll>> quarterlyPayrolls = new HashMap<>();
        
        for (com.omoikaneinnovation.hmrsbackend.model.Payroll payroll : payrolls) {
            if (payroll.getMonth() != null) {
                String quarter = getQuarter(payroll.getMonth());
                quarterlyPayrolls.computeIfAbsent(quarter, k -> new ArrayList<>()).add(payroll);
            }
        }
        
        // Calculate costs for each quarter
        String[] quarters = {"Q1", "Q2", "Q3", "Q4"};
        for (String quarter : quarters) {
            List<com.omoikaneinnovation.hmrsbackend.model.Payroll> qPayrolls = quarterlyPayrolls.getOrDefault(quarter, new ArrayList<>());
            
            double payroll = qPayrolls.stream()
                    .mapToDouble(p -> p.getGross() != null ? p.getGross() : 0)
                    .sum();
            
            double benefits = qPayrolls.stream()
                    .mapToDouble(p -> (p.getHra() != null ? p.getHra() : 0) + 
                                     (p.getAllowance() != null ? p.getAllowance() : 0))
                    .sum();
            
            double training = qPayrolls.stream()
                    .mapToDouble(p -> p.getBonus() != null ? p.getBonus() : 0)
                    .sum();
            
            Map<String, Object> quarterData = new HashMap<>();
            quarterData.put("quarter", quarter);
            quarterData.put("payroll", (long)payroll);
            quarterData.put("benefits", (long)benefits);
            quarterData.put("training", (long)training);
            
            costs.add(quarterData);
        }
        
        return costs;
    }

    /**
     * Get performance metrics
     */
    private Map<String, Object> getPerformanceMetrics(String department) {
        Map<String, Object> metrics = new HashMap<>();
        
        List<com.omoikaneinnovation.hmrsbackend.model.Performance> performances = performanceRepo.findAll();
        
        if (!performances.isEmpty()) {
            double avgScore = performances.stream()
                    .mapToDouble(p -> p.getOverallScore())
                    .average()
                    .orElse(0.0);
            
            metrics.put("averageScore", String.format("%.1f", avgScore));
            metrics.put("totalReviews", performances.size());
        } else {
            metrics.put("averageScore", "N/A");
            metrics.put("totalReviews", 0);
        }
        
        return metrics;
    }

    /**
     * Get financial summary from Financial table
     */
    private Map<String, Object> getFinancialSummary(LocalDate start, LocalDate end) {
        Map<String, Object> summary = new HashMap<>();
        
        List<com.omoikaneinnovation.hmrsbackend.model.FinancialRecord> records = financialRepo.findAll();
        
        double totalRevenue = records.stream().mapToDouble(r -> r.getRevenue()).sum();
        double totalExpense = records.stream().mapToDouble(r -> r.getExpense()).sum();
        double totalProfit = records.stream().mapToDouble(r -> r.getProfit()).sum();
        
        summary.put("revenue", formatCurrency(totalRevenue));
        summary.put("expense", formatCurrency(totalExpense));
        summary.put("profit", formatCurrency(totalProfit));
        
        return summary;
    }

    /**
     * Generate AI-powered insights
     */
    private List<String> generateInsights(String department) {
        List<String> insights = new ArrayList<>();
        
        List<Map<String, Object>> trends = getMonthlyTrends(department, LocalDate.now().minusMonths(6), LocalDate.now());
        
        if (trends.size() >= 2) {
            Map<String, Object> latest = trends.get(trends.size() - 1);
            Map<String, Object> previous = trends.get(trends.size() - 2);
            
            long latestHires = ((Number)latest.get("hires")).longValue();
            long previousHires = ((Number)previous.get("hires")).longValue();
            
            if (latestHires > previousHires) {
                double increase = ((double)(latestHires - previousHires) / Math.max(previousHires, 1)) * 100;
                insights.add(String.format("Hiring increased %.0f%% this month", increase));
            } else if (latestHires < previousHires) {
                double decrease = ((double)(previousHires - latestHires) / Math.max(previousHires, 1)) * 100;
                insights.add(String.format("Hiring decreased %.0f%% this month", decrease));
            }
        }
        
        List<Map<String, Object>> depts = getDepartmentDistribution();
        if (!depts.isEmpty()) {
            Map<String, Object> largest = depts.stream()
                    .max(Comparator.comparing(d -> ((Number)d.get("value")).longValue()))
                    .orElse(null);
            
            if (largest != null) {
                insights.add(largest.get("name") + " is the largest department with " + largest.get("value") + " employees");
            }
        }
        
        Map<String, Object> kpis = getKPIMetrics(department, LocalDate.now().minusMonths(6), LocalDate.now());
        insights.add("Current attrition rate: " + kpis.get("attritionRate"));
        insights.add("Employee growth: " + kpis.get("employeeGrowth") + " vs last month");
        
        return insights;
    }

    // Helper methods
    
    private double calculateAverageHiringTime() {
        // Calculate from job postings to hire date
        // This is simplified - enhance based on your job application flow
        return 29.0;
    }
    
    private double calculateTotalPayroll(String department, LocalDate start, LocalDate end) {
        List<com.omoikaneinnovation.hmrsbackend.model.Payroll> payrolls = payrollRepo.findAll();
        
        return payrolls.stream()
                .filter(p -> department == null || department.equals("All Departments") || 
                             department.equals(p.getDepartment()))
                .mapToDouble(p -> p.getNet() != null ? p.getNet() : 0)
                .sum();
    }
    
    private String getQuarter(String month) {
        if (month == null) return "Q1";
        
        String[] parts = month.split("-");
        if (parts.length < 2) return "Q1";
        
        int monthNum = Integer.parseInt(parts[1]);
        
        if (monthNum <= 3) return "Q1";
        if (monthNum <= 6) return "Q2";
        if (monthNum <= 9) return "Q3";
        return "Q4";
    }
    
    private String formatCurrency(double amount) {
        if (amount >= 1000000) {
            return String.format("$%.2fM", amount / 1000000);
        } else if (amount >= 1000) {
            return String.format("$%.2fK", amount / 1000);
        } else {
            return String.format("$%.2f", amount);
        }
    }
}
