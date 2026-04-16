package com.omoikaneinnovation.hmrsbackend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.omoikaneinnovation.hmrsbackend.service.ReportService;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService service;

    /**
     * Get comprehensive HR reports with optional filters
     * @param department - filter by department (optional)
     * @param startDate - filter start date in YYYY-MM-DD format (optional)
     * @param endDate - filter end date in YYYY-MM-DD format (optional)
     * 
     * Example: GET /api/reports?department=Engineering&startDate=2026-01-01&endDate=2026-04-16
     */
    @GetMapping
    public Map<String, Object> getReports(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        return service.getAllReports(department, startDate, endDate);
    }
    
    /**
     * Export reports to Excel
     * TODO: Implement Excel export using Apache POI
     */
    @GetMapping("/export/excel")
    public String exportExcel(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        // TODO: Implement Excel export
        return "Excel export feature coming soon";
    }
    
    /**
     * Export reports to PDF
     * TODO: Implement PDF export using iText or similar
     */
    @GetMapping("/export/pdf")
    public String exportPDF(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        // TODO: Implement PDF export
        return "PDF export feature coming soon";
    }
}