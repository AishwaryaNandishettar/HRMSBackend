    package com.omoikaneinnovation.hmrsbackend.service;

    import com.omoikaneinnovation.hmrsbackend.dto.AttendanceDTO;
    import com.omoikaneinnovation.hmrsbackend.model.Attendance;
    import com.omoikaneinnovation.hmrsbackend.model.Employee;
    import com.omoikaneinnovation.hmrsbackend.model.User;
    import com.omoikaneinnovation.hmrsbackend.repository.AttendanceRepository;
    import com.omoikaneinnovation.hmrsbackend.repository.EmployeeRepository;
    import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;

    import java.time.Duration;
    import java.time.LocalDate;
    import java.time.LocalTime;
    import java.util.List;
    import java.util.Optional;
    import java.util.stream.Collectors;

    @Service
    public class AttendanceService {

        @Autowired
        private AttendanceRepository attendanceRepo;

        @Autowired
        private UserRepository userRepo;

        @Autowired
        private EmployeeRepository employeeRepo;

        public String checkIn(String userId) {

            String today = LocalDate.now().toString();

            Attendance existing =
                    attendanceRepo.findByUserIdAndDate(userId, today);

            if (existing != null) {
                return "Already checked in today";
            }

            Attendance attendance = new Attendance();

            attendance.setUserId(userId);
            attendance.setDate(today);
            attendance.setCheckIn(LocalTime.now().toString());

            attendanceRepo.save(attendance);

            return "Check-in successful";
        }

        public String checkOut(String userId, String date) {

            // Use the passed date if provided, otherwise fall back to today
            String lookupDate = (date != null && !date.isBlank()) ? date : LocalDate.now().toString();

            Attendance attendance =
                    attendanceRepo.findByUserIdAndDate(userId, lookupDate);

            if (attendance == null) {
                return "Check-in not found";
            }

            String checkOutTime = LocalTime.now().toString();
            attendance.setCheckOut(checkOutTime);

            LocalTime in = LocalTime.parse(attendance.getCheckIn());
            LocalTime out = LocalTime.parse(checkOutTime);

            int minutes = (int) Duration.between(in, out).toMinutes();

            attendance.setWorkedMinutes(minutes);

            attendanceRepo.save(attendance);

            return "Check-out successful";
        }

        public List<AttendanceDTO> getMyAttendance(String userId) {
            List<Attendance> records = attendanceRepo.findByUserId(userId);
            return records.stream().map(r -> enrichAttendance(r)).collect(Collectors.toList());
        }

        public List<AttendanceDTO> getAllAttendance() {
            List<Attendance> records = attendanceRepo.findAll();
            return records.stream().map(r -> enrichAttendance(r)).collect(Collectors.toList());
        }

        /**
         * Enrich an Attendance record with user info (empId, name, dept, reportingManager)
         * Resolution order for empId:
         *   1. user.employeeId (set on User document)
         *   2. employee.employeeId (from Employee collection, linked by userId)
         *   3. employee.employeeId (from Employee collection, linked by email)
         *   4. raw userId as last resort
         */
        private AttendanceDTO enrichAttendance(Attendance a) {
            AttendanceDTO dto = new AttendanceDTO();
            dto.setId(a.getId());
            dto.setUserId(a.getUserId());
            dto.setDate(a.getDate());
            dto.setCheckIn(a.getCheckIn());
            dto.setCheckOut(a.getCheckOut());
            dto.setWorkedMinutes(a.getWorkedMinutes());

            Optional<User> userOpt = userRepo.findById(a.getUserId());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                dto.setName(user.getName());
                dto.setDepartment(user.getDepartment() != null ? user.getDepartment() : "-");
                dto.setReportingManager(user.getManagerName() != null ? user.getManagerName() : "-");

                // Resolve proper employeeId: check User.employeeId first, then Employee collection
                String resolvedEmpId = user.getEmployeeId();
                if (resolvedEmpId == null || resolvedEmpId.isBlank()) {
                    // Try Employee collection by userId
                    Optional<Employee> empByUserId = employeeRepo.findByUserId(a.getUserId());
                    if (empByUserId.isPresent()) {
                        resolvedEmpId = empByUserId.get().getEmployeeId();
                    }
                }
                if (resolvedEmpId == null || resolvedEmpId.isBlank()) {
                    // Try Employee collection by email
                    Optional<Employee> empByEmail = employeeRepo.findByEmail(user.getEmail());
                    if (empByEmail.isPresent()) {
                        resolvedEmpId = empByEmail.get().getEmployeeId();
                    }
                }
                dto.setEmpId(resolvedEmpId != null && !resolvedEmpId.isBlank() ? resolvedEmpId : a.getUserId());
            } else {
                dto.setEmpId(a.getUserId());
                dto.setName("-");
                dto.setDepartment("-");
                dto.setReportingManager("-");
            }
            return dto;
        }
    }
