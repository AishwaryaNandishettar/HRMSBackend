package com.omoikaneinnovation.hmrsbackend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.omoikaneinnovation.hmrsbackend.model.Salary;

public interface SalaryRepository extends MongoRepository<Salary, String> {
    Salary findByUserId(String userId);
}
