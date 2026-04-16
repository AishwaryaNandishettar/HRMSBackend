package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.Reimbursement;
import com.omoikaneinnovation.hmrsbackend.service.ReimbursementService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/reimbursements")
@CrossOrigin
public class ReimbursementController {

    private final ReimbursementService service;

    public ReimbursementController(ReimbursementService service){
        this.service = service;
    }

   @PostMapping(value = "/create", consumes = "multipart/form-data")
public Reimbursement create(
        @RequestParam("files") List<MultipartFile> files,
        @RequestParam Map<String, String> data
) {
    return service.createWithFiles(files, data); // ✅ CALL SERVICE
}

   @GetMapping
public List<Reimbursement> getAll(
        @RequestParam(required = false) String role,
        @RequestParam(required = false) String empCode
){
    return service.getFiltered(role, empCode);
}

    @PutMapping("/status/{id}")
    public Reimbursement updateStatus(
            @PathVariable String id,
            @RequestParam String status){
        return service.updateStatus(id,status);
    }



}