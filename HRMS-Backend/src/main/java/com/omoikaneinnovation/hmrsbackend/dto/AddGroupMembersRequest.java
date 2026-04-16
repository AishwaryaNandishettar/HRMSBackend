package com.omoikaneinnovation.hmrsbackend.dto;

import lombok.Data;
import java.util.List;

@Data

public class AddGroupMembersRequest {
    private List<String> members;
}

