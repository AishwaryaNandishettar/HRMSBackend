package com.omoikaneinnovation.hmrsbackend.controller;
import com.omoikaneinnovation.hmrsbackend.model.Attendance;
import com.omoikaneinnovation.hmrsbackend.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/checkin")
    public String checkIn(@RequestBody Map<String,String> payload){
        String userId = payload.get("userId");
        return attendanceService.checkIn(userId);
    }

    @PostMapping("/checkout")
    public String checkOut(@RequestBody Map<String,String> payload){

        String userId = payload.get("userId");
          String date = payload.get("date"); // ✅ add this
        return attendanceService.checkOut(userId,date);
    }

    @GetMapping("/my/{userId}")
    public List<?> myAttendance(@PathVariable String userId){

        return attendanceService.getMyAttendance(userId);
    }

    @GetMapping("/all")
public List<Attendance> getAllAttendance() {
    return attendanceService.getAllAttendance();
}
}