    package com.omoikaneinnovation.hmrsbackend.service;

    import com.omoikaneinnovation.hmrsbackend.model.Attendance;
    import com.omoikaneinnovation.hmrsbackend.repository.AttendanceRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;

    import java.time.Duration;
    import java.time.LocalDate;
    import java.time.LocalTime;
    import java.util.List;

    @Service
    public class AttendanceService {

        @Autowired
        private AttendanceRepository attendanceRepo;

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

            String today = LocalDate.now().toString();

            Attendance attendance =
                    attendanceRepo.findByUserIdAndDate(userId, today);

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

        public List<Attendance> getMyAttendance(String userId) {

            return attendanceRepo.findByUserId(userId);
        }

        public List<Attendance> getAllAttendance() {
    return attendanceRepo.findAll();
}
    }