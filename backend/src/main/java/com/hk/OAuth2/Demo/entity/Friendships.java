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

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;

    // "PENDING" or "ACCEPTED"
    private String status;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Friendships() {
    }

    public Friendships(User sender, User receiver, String status, LocalDateTime createdAt) {
        this.sender = sender;
        this.receiver = receiver;
        this.status = status;
        this.createdAt = createdAt;
    }
}
