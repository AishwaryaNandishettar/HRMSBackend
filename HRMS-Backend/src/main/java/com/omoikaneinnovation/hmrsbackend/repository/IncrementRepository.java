package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.Increment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface IncrementRepository extends MongoRepository<Increment, String> {
    List<Increment> findByEmpId(String empId);
}