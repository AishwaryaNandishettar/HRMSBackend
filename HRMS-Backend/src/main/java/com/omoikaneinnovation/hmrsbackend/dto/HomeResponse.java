package com.omoikaneinnovation.hmrsbackend.dto;

import java.util.List;
import lombok.Data;
import lombok.AllArgsConstructor;
    import com.omoikaneinnovation.hmrsbackend.dto.HomeResponse;
import com.omoikaneinnovation.hmrsbackend.dto.HomeResponse.Salary;
import com.omoikaneinnovation.hmrsbackend.dto.HomeResponse.Stats;
import com.omoikaneinnovation.hmrsbackend.dto.HomeResponse.Event;
import lombok.NoArgsConstructor;
import java.util.Map;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HomeResponse {

    private Stats stats;
   private com.omoikaneinnovation.hmrsbackend.dto.HomeResponse.Salary salary;
    private List<Event> events;
    //List<Map<String, Object>> attendanceGraph
    private List<Map<String, Object>> attendanceGraph;
private List<Map<String, Object>> leaveGraph;
    /* ================= STATS ================= */
  @Data
@AllArgsConstructor
@NoArgsConstructor
public static class Stats {

    // ✅ existing fields (keep as-is)
    private int presentDays;
    private double avgHours;
    private int leaveTaken;

    // ✅ ADD THESE (for service compatibility)
    private int totalDays;
    private int leaves;
}
    /* ================= SALARY ================= */
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Salary {
        private List<Item> earnings;
        private List<Item> deductions;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Item {
        private String name;
        private double amount;
    }

    /* ================= EVENTS ================= */
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Event {
        private String title;
        private String date;
        private String type;   // 🔥 ADD THIS
    }
}
