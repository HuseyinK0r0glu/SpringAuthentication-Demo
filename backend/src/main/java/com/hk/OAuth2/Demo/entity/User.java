package com.hk.OAuth2.Demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    // it stores the roles in another table
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles" , joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "roles")
    private List<String> roles = new ArrayList<>();

    @Column(name = "failed_attempts")
    private int failedAttempts;

    // it is the time when user locked
    @Column(name = "lock_time")
    private LocalDateTime lockTime;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Setter
    @Column(name = "phone_verified")
    private boolean phoneVerified;

    @Column(name = "verification_code")
    private String verificationCode;

    @Column(name = "verification_code_sent_at")
    private LocalDateTime verificationCodeSentAt;

    @OneToMany(mappedBy = "sender" , cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Friendships> sendRequests = new ArrayList<>();

    @OneToMany(mappedBy = "receiver" , cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Friendships> receiveRequests = new ArrayList<>();

    @Column(name = "is_profile_picture_visible", nullable = false)
    private boolean isProfilePictureVisible = true;

    public User() {
    }

    // for traditional login (email,password)
    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public User(String username,
                String email,
                String password,
                int verified,
                String verificationToken,
                LocalDateTime expiryTime,
                List<String> roles,
                int failedAttempts,
                String phoneNumber,
                boolean phoneVerified) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.verified = verified;
        this.verificationToken = verificationToken;
        this.expiryTime = expiryTime;
        this.roles = roles;
        this.failedAttempts = failedAttempts;
        this.phoneNumber = phoneNumber;
        this.phoneVerified = phoneVerified;
    }

    public User(String username,
                String email,
                String password,
                int verified,
                String verificationToken,
                LocalDateTime expiryTime,
                List<String> roles,
                int failedAttempts,
                String phoneNumber,
                boolean phoneVerified,
                List<Friendships> sendRequests,
                List<Friendships> receiveRequests) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.verified = verified;
        this.verificationToken = verificationToken;
        this.expiryTime = expiryTime;
        this.roles = roles;
        this.failedAttempts = failedAttempts;
        this.phoneNumber = phoneNumber;
        this.phoneVerified = phoneVerified;
        this.sendRequests = sendRequests;
        this.receiveRequests = receiveRequests;
    }

    // for oauth2 login
    public User(String username, String email, String provider, String oauth2Id, String picture,List<String> roles,int verified) {
        this.username = username;
        this.email = email;
        this.provider = provider;
        this.oauth2Id = oauth2Id;
        this.picture = picture;
        this.roles = roles;
        this.verified = verified;
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

    public boolean getPhoneVerified() {
        return phoneVerified;
    }

}
