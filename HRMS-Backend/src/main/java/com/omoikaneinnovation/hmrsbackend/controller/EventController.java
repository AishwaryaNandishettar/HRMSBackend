package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.Event;
import com.omoikaneinnovation.hmrsbackend.repository.EventRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventRepository eventRepository;

    public EventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // ✅ CREATE EVENT
    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventRepository.save(event);
    }

    // ✅ GET ALL EVENTS
    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // ✅ DELETE EVENT (optional for testing)
    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable String id) {
        eventRepository.deleteById(id);
    }
}