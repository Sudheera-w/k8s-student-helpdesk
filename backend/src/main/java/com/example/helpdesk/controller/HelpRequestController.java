package com.example.helpdesk.controller;

import com.example.helpdesk.model.HelpRequest;
import com.example.helpdesk.service.HelpRequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost", "*"}, allowCredentials = "false")
public class HelpRequestController {
    private final HelpRequestService service;

    public HelpRequestController(HelpRequestService service) {
        this.service = service;
    }

    @GetMapping
    public List<HelpRequest> getAll() {
        return service.getAll();
    }

    @PostMapping
    public HelpRequest create(@Valid @RequestBody HelpRequest request) {
        return service.create(request);
    }

    @PatchMapping("/{id}/status")
    public HelpRequest updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return service.updateStatus(id, body.getOrDefault("status", "OPEN"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "helpdesk-backend");
    }
}
