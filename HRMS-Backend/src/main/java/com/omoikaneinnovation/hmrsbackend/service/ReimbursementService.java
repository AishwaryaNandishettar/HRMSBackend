package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.Reimbursement;
import com.omoikaneinnovation.hmrsbackend.repository.ReimbursementRepository;
import org.springframework.stereotype.Service;
import java.nio.file.*;
import java.util.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Service
public class ReimbursementService {

    private final ReimbursementRepository repo;

    public ReimbursementService(ReimbursementRepository repo){
        this.repo = repo;
    }

    public Reimbursement create(Reimbursement r){
    r.setStatus("Pending");   // ✅ set default status here
    return repo.save(r);
}

public Reimbursement createWithFiles(List<MultipartFile> files, Map<String, String> data) {

  List<String> fileUrls = new ArrayList<>();

if (files != null) {   // ✅ ADD THIS LINE
    for (MultipartFile file : files) {
        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path path = Paths.get("uploads/" + fileName);

            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            fileUrls.add("http://localhost:8082/uploads/" + fileName);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

    Reimbursement r = new Reimbursement();

    // ✅ map fields
    r.setEmpName(data.get("empName"));
    r.setEmpCode(data.get("empCode"));
    r.setClaimType(data.get("claimType"));
    r.setDescription(data.get("description"));
    r.setAmount(Double.parseDouble(data.get("amount")));
    r.setStatus(data.get("status"));

    r.setFiles(fileUrls); // ✅ IMPORTANT

    return repo.save(r); // ✅ USE repo (not repository ❌)
}
    public List<Reimbursement> getAll(){
        return repo.findAll();
    }

    public Reimbursement updateStatus(String id,String status){

        Reimbursement r = repo.findById(id).orElseThrow();

        r.setStatus(status);

        return repo.save(r);
    }

    public List<Reimbursement> getFiltered(String role, String empCode) {

    List<Reimbursement> list = repo.findAll();

    if (role == null) return list;

    // EMPLOYEE → only own data
    if (role.equals("employee")) {
        return list.stream()
                .filter(r -> empCode.equals(r.getEmpCode()))
                .toList();
    }

    // MANAGER → all data
    if (role.equals("manager")) {
        return list;
    }

    // ADMIN → only manager approved
    if (role.equals("admin")) {
        return list.stream()
                .filter(r -> "Manager Approved".equals(r.getStatus()))
                .toList();
    }

    return list;
}
}