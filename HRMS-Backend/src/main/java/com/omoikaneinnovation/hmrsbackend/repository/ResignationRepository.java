package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.Resignation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ResignationRepository extends MongoRepository<Resignation, String> {
    List<Resignation> findByEmpId(String empId);
}