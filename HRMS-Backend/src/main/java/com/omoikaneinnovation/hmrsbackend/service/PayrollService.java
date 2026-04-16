package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.Payroll;
import com.omoikaneinnovation.hmrsbackend.repository.PayrollRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PayrollService {

    private final PayrollRepository repo;
    

    public PayrollService(PayrollRepository repo) {
        this.repo = repo;
    }

    public Payroll createPayroll(Payroll p){
        return repo.save(p);
    }

    public List<Payroll> getAll(){
        return repo.findAll();
    }

    public List<Payroll> getEmployeePayroll(String empCode){
        return repo.findByEmpCode(empCode);
    }

    public Payroll updatePayroll(String empId, Payroll p){
        p.setEmployeeId(empId);
        return repo.save(p);
    }

    public Payroll processPayroll(String employeeId) {

Payroll payroll = repo.findByEmployeeId(employeeId)
    .orElseGet(() -> repo.findByEmpCode(employeeId).stream().findFirst().orElse(null));

    if (payroll == null) {
        throw new RuntimeException("Payroll not found for ID: " + employeeId);
    }

    payroll.setPayrollStatus("PROCESSING");
    repo.save(payroll);

    try {
        Thread.sleep(2000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }

    payroll.setGross(15000.0);
    payroll.setNet(12000.0);
    payroll.setPayrollStatus("SUCCESSFUL");
    payroll.setSalaryStatus("CREDITED");

    return repo.save(payroll);
}

    // ✅ YOUR LOGIC (UNCHANGED — just moved here)
    public List<Payroll> saveAll(List<Payroll> payrollList) {

        // 1. Make old payroll INACTIVE
        List<Payroll> existing = repo.findAll();
       existing.forEach(p -> {
           p.setRecordStatus("INACTIVE");
           p.setStatus("INACTIVE"); // ✅ SYNC STATUS
       });
        repo.saveAll(existing);

        // 2. Save new payroll as ACTIVE
        payrollList.forEach(p -> {
            // ✅ ENSURE STATUS IS UPPERCASE
            String statusValue = (p.getStatus() != null) ? p.getStatus().toUpperCase() : "ACTIVE";
            p.setStatus(statusValue);
            p.setRecordStatus(statusValue); // ✅ SYNC BOTH FIELDS
            p.setPayrollStatus("INITIATED");
            p.setUpdatedAt(System.currentTimeMillis());
            
            System.out.println("🔥 SAVING PAYROLL: empId=" + p.getEmployeeId() + ", status=" + p.getStatus());
        });

        List<Payroll> saved = repo.saveAll(payrollList);
        
        System.out.println("✅ PAYROLL BATCH SAVED: " + saved.size() + " records");
        
        return saved;
    }

    public List<Payroll> processAllPayroll() {

    List<Payroll> list = repo.findAll();

    // Step 1: set PROCESSING
    list.forEach(p -> p.setPayrollStatus("PROCESSING"));
    repo.saveAll(list);

    try {
        Thread.sleep(2000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }

    // Step 2: set SUCCESSFUL + CREDITED
    list.forEach(p -> {
        p.setGross(15000.0);
        p.setNet(12000.0);
        p.setPayrollStatus("SUCCESSFUL");
        p.setSalaryStatus("CREDITED");
    });

    return repo.saveAll(list);
}
}