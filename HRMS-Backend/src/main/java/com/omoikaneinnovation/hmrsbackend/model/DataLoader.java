package com.omoikaneinnovation.hmrsbackend.config;

import com.omoikaneinnovation.hmrsbackend.model.*;
import com.omoikaneinnovation.hmrsbackend.repository.PerformanceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadData(PerformanceRepository repo) {
        return args -> {

            if (repo.count() == 0) {

                Performance p = new Performance();
                p.setEmployeeId("EMP001");
                p.setOverallScore(4.3);

                p.setMonthlyRatings(List.of(
                        new MonthlyRating("Jan", 3.5),
                        new MonthlyRating("Feb", 4.0)
                ));

                repo.save(p);
            }
        };
    }
}