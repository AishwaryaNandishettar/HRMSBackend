package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.Payroll;
import com.omoikaneinnovation.hmrsbackend.service.PayrollService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin
public class PayrollController {

    private final PayrollService service;

    public PayrollController(PayrollService service){
        this.service = service;
    }

    @PostMapping("/create")
    public Payroll create(@RequestBody Payroll p){
        return service.createPayroll(p);
    }

    @GetMapping
    public List<Payroll> getAll(){
        return service.getAll();
    }

    @GetMapping("/employee/{empCode}")
    public List<Payroll> getEmployeePayroll(@PathVariable String empCode){
        return service.getEmployeePayroll(empCode);
    }

    @PutMapping("/update/{empId}")
    public Payroll update(@PathVariable String empId, @RequestBody Payroll p) {
        return service.updatePayroll(empId, p);
    }

    @PutMapping("/update-all")
    public List<Payroll> updateAll(@RequestBody List<Payroll> payrollList) {
        return service.saveAll(payrollList);
    }

     @PostMapping("/batch")
public List<Payroll> saveBatch(@RequestBody List<Payroll> list) {
    return service.saveAll(list); // ✅ CORRECT
}
@PutMapping("/process/{empId}")
public Payroll process(@PathVariable String empId) {
    return service.processPayroll(empId);
}
@PutMapping("/process-all")
public List<Payroll> processAll() {
    return service.processAllPayroll();
}
}
