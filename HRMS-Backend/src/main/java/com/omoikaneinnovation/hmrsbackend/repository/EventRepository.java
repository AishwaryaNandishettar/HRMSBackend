package com.omoikaneinnovation.hmrsbackend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.omoikaneinnovation.hmrsbackend.model.Event;

public interface EventRepository extends MongoRepository<Event, String> {
}
