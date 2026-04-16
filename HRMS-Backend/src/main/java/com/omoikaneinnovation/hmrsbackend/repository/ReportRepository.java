package com.omoikaneinnovation.hmrsbackend.repository;
import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
import com.omoikaneinnovation.hmrsbackend.repository.JobRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.omoikaneinnovation.hmrsbackend.model.Report;

public interface ReportRepository extends MongoRepository<Report, String> {
}