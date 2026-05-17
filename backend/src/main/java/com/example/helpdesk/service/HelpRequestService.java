package com.example.helpdesk.service;

import com.example.helpdesk.model.HelpRequest;
import com.example.helpdesk.repository.HelpRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HelpRequestService {
    private final HelpRequestRepository repository;

    public HelpRequestService(HelpRequestRepository repository) {
        this.repository = repository;
    }

    public List<HelpRequest> getAll() {
        return repository.findAll();
    }

    public HelpRequest create(HelpRequest request) {
        request.setStatus("OPEN");
        return repository.save(request);
    }

    public HelpRequest updateStatus(Long id, String status) {
        HelpRequest request = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Help request not found"));
        request.setStatus(status);
        return repository.save(request);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
