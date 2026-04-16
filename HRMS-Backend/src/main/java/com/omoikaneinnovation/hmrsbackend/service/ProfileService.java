package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.dto.ProfileResponse;
import com.omoikaneinnovation.hmrsbackend.model.User;
import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepo;

    public ProfileResponse getMyProfile(String empId) {

        User emp = userRepo.findByEmployeeId(empId);

        if (emp == null) {
            throw new RuntimeException("Employee not found");
        }

        User manager = null;

        if (emp.getManagerId() != null) {
            manager = userRepo.findByEmployeeId(emp.getManagerId());
        }

        ProfileResponse res = new ProfileResponse();

       res.setEmployeeId(emp.getEmployeeId());
        res.setName(emp.getName());
        res.setDepartment(emp.getDepartment());

        res.setManagerId(emp.getManagerId());

        res.setManagerName(
                manager != null ? manager.getName() : "Not Assigned"
        );

        return res;
    }
}