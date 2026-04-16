package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.Reimbursement;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReimbursementRepository extends MongoRepository<Reimbursement, String> {

}