package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.InsuranceClaim;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface InsuranceClaimRepository extends MongoRepository<InsuranceClaim, String> 
{
    
}