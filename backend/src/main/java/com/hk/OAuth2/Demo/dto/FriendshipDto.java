package com.hk.OAuth2.Demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class FriendshipDto {

    private String status;
    private LocalDateTime createdAt;
    private Long id;

    // Receiver info
    private String receiverUsername;
    private Long receiverId;
    private boolean receiverIsBanned;
    private String receiverEmail;
    private String receiverLocalPicture;
    private String receiverOauth2Id;
    private String receiverPhoneNumber;
    private String receiverPicture;
    private boolean receiverProfileIsVisible;
    private String receiverProvider;

    // Sender info
    private String senderUsername;
    private Long senderId;
    private boolean senderIsBanned;
    private String senderEmail;
    private String senderLocalPicture;
    private String senderOauth2Id;
    private String senderPhoneNumber;
    private String senderPicture;
    private boolean senderProfileIsVisible;
    private String senderProvider;

    public FriendshipDto(String status, LocalDateTime createdAt, Long id, String receiverUsername ,Long receiverId, boolean receiverIsBanned, String receiverEmail, String receiverLocalPicture, String receiverOauth2Id, String receiverPhoneNumber, String receiverPicture, boolean receiverProfileIsVisible, String receiverProvider, String senderUsername ,Long senderId, boolean senderIsBanned, String senderEmail, String senderLocalPicture, String senderOauth2Id, String senderPhoneNumber, String senderPicture, boolean senderProfileIsVisible, String senderProvider) {
        this.status = status;
        this.createdAt = createdAt;
        this.id = id;
        this.receiverUsername = receiverUsername;
        this.receiverId = receiverId;
        this.receiverIsBanned = receiverIsBanned;
        this.receiverEmail = receiverEmail;
        this.receiverLocalPicture = receiverLocalPicture;
        this.receiverOauth2Id = receiverOauth2Id;
        this.receiverPhoneNumber = receiverPhoneNumber;
        this.receiverPicture = receiverPicture;
        this.receiverProfileIsVisible = receiverProfileIsVisible;
        this.receiverProvider = receiverProvider;
        this.senderUsername = senderUsername;
        this.senderId = senderId;
        this.senderIsBanned = senderIsBanned;
        this.senderEmail = senderEmail;
        this.senderLocalPicture = senderLocalPicture;
        this.senderOauth2Id = senderOauth2Id;
        this.senderPhoneNumber = senderPhoneNumber;
        this.senderPicture = senderPicture;
        this.senderProfileIsVisible = senderProfileIsVisible;
        this.senderProvider = senderProvider;
    }
}
