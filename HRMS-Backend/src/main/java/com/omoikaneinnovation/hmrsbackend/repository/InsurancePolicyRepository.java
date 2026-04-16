package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.InsurancePolicy;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface InsurancePolicyRepository extends MongoRepository<InsurancePolicy, String> {

    Optional<InsurancePolicy> findByCompanyId(String companyId);
}