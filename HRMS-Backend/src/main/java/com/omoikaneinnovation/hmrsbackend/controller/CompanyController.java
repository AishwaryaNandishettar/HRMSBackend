package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.Company;
import com.omoikaneinnovation.hmrsbackend.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
@CrossOrigin(origins = "*")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @PostMapping
    public ResponseEntity<Company> saveCompany(@RequestBody Company company) {
        return ResponseEntity.ok(companyService.saveCompany(company));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompany(@PathVariable String id) {
        Company company = companyService.getCompanyById(id);
        return company != null ? ResponseEntity.ok(company) : ResponseEntity.notFound().build();
    }
}