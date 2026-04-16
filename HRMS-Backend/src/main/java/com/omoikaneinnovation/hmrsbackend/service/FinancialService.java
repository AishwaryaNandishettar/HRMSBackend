package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.FinancialRecord;
import com.omoikaneinnovation.hmrsbackend.repository.FinancialRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FinancialService {

    private final FinancialRepository repo;

    // ✅ Correct constructor
    public FinancialService(FinancialRepository repo) {
        this.repo = repo;
    }

    // ✅ GET all sorted
    public List<FinancialRecord> getAll() {
        return repo.findAll(Sort.by(Sort.Direction.ASC, "month"));
    }

    // ✅ SAVE with update logic
    public FinancialRecord save(FinancialRecord record) {

        Optional<FinancialRecord> existing = repo.findByMonth(record.getMonth());

        // UPDATE if exists
        if (existing.isPresent()) {
            FinancialRecord old = existing.get();

            old.setRevenue(record.getRevenue());
            old.setExpense(record.getExpense());
            old.setProfit(record.getProfit());
            old.setLoss(record.getLoss());

            return repo.save(old);
        }

        // INSERT if new
        return repo.save(record);
    }
}