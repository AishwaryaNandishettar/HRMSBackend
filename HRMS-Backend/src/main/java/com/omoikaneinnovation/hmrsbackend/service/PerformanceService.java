package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.*;
import com.omoikaneinnovation.hmrsbackend.repository.EmployeeRepository;
import com.omoikaneinnovation.hmrsbackend.repository.PerformanceRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PerformanceService {

    private final PerformanceRepository repo;
    private final EmployeeRepository employeeRepo;

    public PerformanceService(PerformanceRepository repo, EmployeeRepository employeeRepo) {
        this.repo = repo;
        this.employeeRepo = employeeRepo;
    }

    public Performance getByEmployeeId(String empId) {
        return repo.findByEmployeeId(empId).orElse(null);
    }

    public List<Performance> getAll() {
        return repo.findAll();
    }

    public Performance save(Performance performance) {
        // upsert: if record exists for this employeeId, update it
        repo.findByEmployeeId(performance.getEmployeeId())
            .ifPresent(existing -> performance.setId(existing.getId()));
        return repo.save(performance);
    }

    /**
     * Seed sample performance data for testing
     */
    public String seedSampleData() {
        try {
            List<Employee> employees = employeeRepo.findAll();
            System.out.println("Found " + employees.size() + " total employees");
            
            // Filter active employees
            List<Employee> activeEmployees = employees.stream()
                .filter(e -> "ACTIVE".equalsIgnoreCase(e.getStatus()))
                .limit(3) // Take first 3 active employees
                .collect(Collectors.toList());

            System.out.println("Found " + activeEmployees.size() + " active employees");

            if (activeEmployees.isEmpty()) {
                return "No active employees found to seed performance data. Total employees: " + employees.size();
            }

            int seeded = 0;
            for (Employee emp : activeEmployees) {
                String empId = emp.getEmployeeId();
                System.out.println("Processing employee: " + emp.getFullName() + " with ID: " + empId);
                
                if (empId == null || empId.isBlank()) {
                    System.out.println("Skipping employee " + emp.getFullName() + " - no employeeId");
                    continue;
                }

                // Check if performance record already exists
                if (repo.findByEmployeeId(empId).isPresent()) {
                    System.out.println("Performance record already exists for " + empId);
                    continue; // Skip if already exists
                }

                Performance perf = createSamplePerformance(empId, emp.getFullName());
                repo.save(perf);
                seeded++;
                System.out.println("Created performance record for " + emp.getFullName());
            }

            String result = "Seeded performance data for " + seeded + " employees: " + 
                           activeEmployees.stream().map(Employee::getFullName).collect(Collectors.toList());
            System.out.println("Seeding result: " + result);
            return result;
            
        } catch (Exception e) {
            System.err.println("Error during seeding: " + e.getMessage());
            e.printStackTrace();
            return "Error during seeding: " + e.getMessage();
        }
    }

    public String debugEmployeeData() {
        try {
            List<Employee> employees = employeeRepo.findAll();
            StringBuilder debug = new StringBuilder();
            debug.append("Total employees: ").append(employees.size()).append("\n");
            
            for (Employee emp : employees) {
                debug.append("Employee: ").append(emp.getFullName())
                     .append(", ID: ").append(emp.getEmployeeId())
                     .append(", Status: ").append(emp.getStatus())
                     .append("\n");
            }
            
            return debug.toString();
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    private Performance createSamplePerformance(String empId, String empName) {
        Performance perf = new Performance();
        perf.setEmployeeId(empId);
        
        // Generate realistic overall score (3.2 to 4.8)
        double overallScore = 3.2 + (Math.random() * 1.6);
        perf.setOverallScore(overallScore);

        // Monthly ratings (last 6 months)
        perf.setMonthlyRatings(Arrays.asList(
            new MonthlyRating("2024-07", 3.8 + (Math.random() * 0.8)),
            new MonthlyRating("2024-08", 3.9 + (Math.random() * 0.7)),
            new MonthlyRating("2024-09", 4.0 + (Math.random() * 0.6)),
            new MonthlyRating("2024-10", 3.7 + (Math.random() * 0.9)),
            new MonthlyRating("2024-11", 4.1 + (Math.random() * 0.5)),
            new MonthlyRating("2024-12", overallScore)
        ));

        // Performance parameters
        perf.setParameters(Arrays.asList(
            new Parameter("Technical Skills", 25, 3.5 + (Math.random() * 1.5)),
            new Parameter("Communication", 20, 3.8 + (Math.random() * 1.2)),
            new Parameter("Teamwork", 20, 4.0 + (Math.random() * 1.0)),
            new Parameter("Problem Solving", 15, 3.6 + (Math.random() * 1.4)),
            new Parameter("Leadership", 10, 3.2 + (Math.random() * 1.8)),
            new Parameter("Time Management", 10, 4.2 + (Math.random() * 0.8))
        ));

        // Manager reviews
        perf.setReviews(Arrays.asList(
            new Review("Manager", "Q3 2024", 4.0 + (Math.random() * 0.8), 
                      empName + " consistently delivers quality work and shows great potential for growth."),
            new Review("HR", "Q4 2024", 3.8 + (Math.random() * 0.9), 
                      "Strong team player with excellent communication skills. Areas for improvement: leadership initiatives."),
            new Review("Manager", "Q4 2024", overallScore, 
                      "Exceeded expectations in most areas. Recommended for advanced training programs.")
        ));

        return perf;
    }
}