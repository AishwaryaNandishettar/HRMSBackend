    package com.omoikaneinnovation.hmrsbackend.service;

    import com.omoikaneinnovation.hmrsbackend.model.User;
    import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.stereotype.Service;
    import java.util.List;
    import java.time.LocalDate;

    import com.omoikaneinnovation.hmrsbackend.model.Employee;

    @Service
    public class EmployeeService {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private BCryptPasswordEncoder passwordEncoder;


    @Autowired
    private com.omoikaneinnovation.hmrsbackend.repository.EmployeeRepository employeeRepo;

    public java.util.List<com.omoikaneinnovation.hmrsbackend.model.Employee> getAllEmployees() {
        return employeeRepo.findAll();
    }
        public User createEmployee(String name, String email, String password) {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole("EMPLOYEE");
            user.setActive(true); // mark employee active by default
            return userRepository.save(user);
        }
        public List<Employee> getCurrentMonthBirthdays() {
        int currentMonth = LocalDate.now().getMonthValue();

        return employeeRepo.findAll().stream()
            .filter(emp -> {
                if (emp.getDob() == null) return false;
                return LocalDate.parse(emp.getDob()).getMonthValue() == currentMonth;
            })
            .toList();
    }
    }