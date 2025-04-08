package com.hk.OAuth2.Demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "user_name")
    private String username;

    @Column(unique = true , name = "email")
    private String email;

    @Column(name = "provider" ,nullable = true)
    private String provider;

    @Column(unique = true , name = "oauth2_id" , nullable = true)
    private String oauth2Id;

    @Column(name = "image")
    private String picture;

    @Column(name = "local_image")
    private String localPicture;

    // for traditional login
    @Column(name = "password")
    private String password;

    @Column(name = "verified")
    // 0 mean not verified 1 mean verified
    private int verified;

    @Column(name = "verification_token")
    private String verificationToken;

    @Column(name = "expiry_time")
    private LocalDateTime expiryTime;

    public User() {
    }

    // for traditional login (email,password)
    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // for oauth2 login
    public User(String username, String email, String provider, String oauth2Id, String picture) {
        this.username = username;
        this.email = email;
        this.provider = provider;
        this.oauth2Id = oauth2Id;
        this.picture = picture;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", provider='" + provider + '\'' +
                '}';
    }
}
