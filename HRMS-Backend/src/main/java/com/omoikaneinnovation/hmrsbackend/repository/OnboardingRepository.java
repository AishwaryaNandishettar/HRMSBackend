package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.OnboardingRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OnboardingRepository
        extends MongoRepository<OnboardingRecord, String> {
                OnboardingRecord findByEmployeeId(String employeeId);
}
