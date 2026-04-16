package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.FinancialRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface FinancialRepository extends MongoRepository<FinancialRecord, String> {
    Optional<FinancialRecord> findByMonth(String month);
}