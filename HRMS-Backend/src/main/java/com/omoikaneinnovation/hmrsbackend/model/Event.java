package com.omoikaneinnovation.hmrsbackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;

import lombok.Data;
import lombok.NoArgsConstructor;



@Data

@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "events")
public class Event {

    @Id
    private String id;
    private String title;
    private String date;
      private String type;   // 🔥 NEW: HR / MEETING / HOLIDAY
       private String createdBy; // HR/Admin userId
}
