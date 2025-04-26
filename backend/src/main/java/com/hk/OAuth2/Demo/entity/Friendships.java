package com.hk.OAuth2.Demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "friendships")
@Getter
@Setter
public class Friendships {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long senderId;
    private Long receiverId;

    // "PENDING" or "ACCEPTED"
    private String status;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Friendships() {
    }

    public Friendships(Long senderId, Long receiverId, String status, LocalDateTime createdAt) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.status = status;
        this.createdAt = createdAt;
    }
}
