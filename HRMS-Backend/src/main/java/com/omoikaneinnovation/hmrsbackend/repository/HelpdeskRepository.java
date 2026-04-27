package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.HelpdeskTicket;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HelpdeskRepository extends MongoRepository<HelpdeskTicket, String> {
}