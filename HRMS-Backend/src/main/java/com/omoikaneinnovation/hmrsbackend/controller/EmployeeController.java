package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.dto.EmployeeDTO;
import com.omoikaneinnovation.hmrsbackend.dto.ParticipantDTO;
import com.omoikaneinnovation.hmrsbackend.model.User;
import com.omoikaneinnovation.hmrsbackend.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import com.omoikaneinnovation.hmrsbackend.model.Employee;
@RestController
@RequestMapping("/api/employee")
@CrossOrigin(originPatterns = {"http://localhost:*", "https://*.ngrok-free.dev"})
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/create")
    public ResponseEntity<User> createEmployee(@RequestBody EmployeeDTO dto) {
        User employee = employeeService.createEmployee(
                dto.getName(), dto.getEmail(), dto.getPassword()
        );
        return ResponseEntity.ok(employee);
    }

    @GetMapping("/all")
public ResponseEntity<?> getAllEmployees() {
    return ResponseEntity.ok(employeeService.getAllEmployees());
}

  @GetMapping("/birthdays/current-month")
public List<Employee> getBirthdays() {
    return employeeService.getCurrentMonthBirthdays();
}  

 /**
     * Get all employees formatted as User objects for frontend compatibility
     */
    @GetMapping("/as-users")
    public ResponseEntity<List<User>> getEmployeesAsUsers() {
        List<Employee> employees = employeeService.getAllEmployees();
        List<User> userList = new ArrayList<>();
        
        for (Employee emp : employees) {
            User user = new User();
            user.setId(emp.getId());
            user.setName(emp.getFullName());
            user.setEmail(emp.getEmail());
            user.setDepartment(emp.getDepartment());
            user.setDesignation(emp.getDesignation());
            user.setRole("EMPLOYEE");
            user.setActive("ACTIVE".equals(emp.getStatus()) || "INVITED".equals(emp.getStatus()));
            userList.add(user);
        }
        
        return ResponseEntity.ok(userList);
    }

    /**
     * Get all participants (users and employees) for meeting invitations
     */
    @GetMapping("/participants")
    public ResponseEntity<List<ParticipantDTO>> getAllParticipants() {
        List<ParticipantDTO> participants = new ArrayList<>();
        
        // Get all employees as participants
        List<Employee> employees = employeeService.getAllEmployees();
        for (Employee emp : employees) {
            ParticipantDTO participant = ParticipantDTO.builder()
                    .id(emp.getId())
                    .name(emp.getFullName())
                    .email(emp.getEmail())
                    .department(emp.getDepartment())
                    .designation(emp.getDesignation())
                    .type("EMPLOYEE")
                    .active("ACTIVE".equals(emp.getStatus()) || "INVITED".equals(emp.getStatus()))
                    .build();
            participants.add(participant);
        }
        
        return ResponseEntity.ok(participants);
    }

    /**
     * Search participants by name, email, or department
     */
    @GetMapping("/participants/search")
    public ResponseEntity<List<ParticipantDTO>> searchParticipants(
            @RequestParam(name = "query", defaultValue = "") String query) {
        
        List<ParticipantDTO> participants = new ArrayList<>();
        String queryLower = query.toLowerCase().trim();
        
        // Get all employees and filter
        List<Employee> employees = employeeService.getAllEmployees();
        
        for (Employee emp : employees) {
            // Check if employee matches search query
            if (emp.getFullName().toLowerCase().contains(queryLower) ||
                emp.getEmail().toLowerCase().contains(queryLower) ||
                (emp.getDepartment() != null && emp.getDepartment().toLowerCase().contains(queryLower))) {
                
                ParticipantDTO participant = ParticipantDTO.builder()
                        .id(emp.getId())
                        .name(emp.getFullName())
                        .email(emp.getEmail())
                        .department(emp.getDepartment())
                        .designation(emp.getDesignation())
                        .type("EMPLOYEE")
                        .active("ACTIVE".equals(emp.getStatus()) || "INVITED".equals(emp.getStatus()))
                        .build();
                participants.add(participant);
            }
        }
        
        return ResponseEntity.ok(participants);
    }
}