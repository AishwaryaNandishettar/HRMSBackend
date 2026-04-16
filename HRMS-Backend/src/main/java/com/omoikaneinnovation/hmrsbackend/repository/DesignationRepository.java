package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.Designation;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DesignationRepository extends MongoRepository<Designation, String> {
}