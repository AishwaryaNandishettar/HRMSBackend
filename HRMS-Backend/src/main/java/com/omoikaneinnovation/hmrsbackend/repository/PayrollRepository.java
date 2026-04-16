package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.Payroll;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PayrollRepository extends MongoRepository<Payroll, String> {

    List<Payroll> findByEmpCode(String empCode);

    Optional<Payroll> findByEmployeeId(String employeeId);
    
}