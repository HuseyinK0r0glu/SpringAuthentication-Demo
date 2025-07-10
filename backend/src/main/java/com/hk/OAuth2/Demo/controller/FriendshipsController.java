package com.hk.OAuth2.Demo.controller;

import com.hk.OAuth2.Demo.dto.FriendshipDto;
import com.hk.OAuth2.Demo.entity.Friendships;
import com.hk.OAuth2.Demo.entity.User;
import com.hk.OAuth2.Demo.service.FriendshipsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/friends")
public class FriendshipsController {

    private final FriendshipsService friendshipsService;

    public FriendshipsController(FriendshipsService friendshipsService) {
        this.friendshipsService = friendshipsService;
    }

    // return json from endpoints

    @PostMapping("/request")
    public ResponseEntity<Map<String,Object>> sendFriendRequest(@RequestParam Long senderId,@RequestParam Long receiverId){
        Map<String,Object> response = new HashMap<>();

        // 1. Check if there's already a pending request *from sender to receiver
        List<Friendships> pendingRequests = friendshipsService.getPendingRequests(receiverId);
        for(Friendships f : pendingRequests){
            if(f.getSender().getId().equals(senderId)){
                response.put("error","Request already sent");
                return ResponseEntity.badRequest().body(response);
            }
        }

        // 2. Check if there's already a pending request *from receiver to sender
        List<Friendships> pendingRequestsForSender =  friendshipsService.getPendingRequests(senderId);
        for(Friendships f : pendingRequestsForSender){
            if(f.getSender().getId().equals(receiverId)){
                response.put("error", "You already have a request from this user");
                return ResponseEntity.badRequest().body(response);
            }
        }

        // 3. Check if they are already friends
        List<Friendships> friends =  friendshipsService.getFriends(receiverId);
        for(Friendships f : friends){
            if(f.getSender().getId().equals(senderId) &&  f.getReceiver().getId().equals(receiverId)){
                response.put("error", "You are already friends");
                return ResponseEntity.badRequest().body(response);
            }

            if(f.getSender().getId().equals(receiverId) &&  f.getReceiver().getId().equals(senderId)){
                response.put("error", "You are already friends");
                return ResponseEntity.badRequest().body(response);
            }

        }

        Friendships friendships = friendshipsService.sendFriendRequest(senderId, receiverId);
        response.put("message", "Friend request sent successfully");
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/accept")
    public ResponseEntity<Friendships> acceptFriendRequest(@RequestParam Long requestId){
        Friendships friendships = friendshipsService.acceptFriendRequest(requestId);
        return ResponseEntity.ok(friendships);
    }

    @DeleteMapping("/reject")
    public ResponseEntity<?> rejectFriendRequest(@RequestParam Long requestId){
        friendshipsService.rejectFriendRequest(requestId);
        Map<String,String> response = new HashMap<>();
        response.put("message","Friend request rejected");
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/friends-list")
    public ResponseEntity<List<FriendshipDto>> getFriendsList(@RequestParam Long userId) {

        List<FriendshipDto> friendshipDtos = new ArrayList<>();

        List<Friendships> friendsList = friendshipsService.getFriends(userId);

        for(Friendships f : friendsList){
            User receiver = f.getReceiver();
            User sender = f.getSender();
            FriendshipDto friendshipDto = new FriendshipDto(
                    f.getStatus(),
                    f.getCreatedAt(),
                    f.getId(),
                    receiver.getId(),
                    receiver.isBanned(),
                    receiver.getEmail(),
                    receiver.getLocalPicture(),
                    receiver.getOauth2Id(),
                    receiver.getPhoneNumber(),
                    receiver.getPicture(),
                    receiver.isProfilePictureVisible(),
                    receiver.getProvider(),
                    sender.getId(),
                    sender.isBanned(),
                    sender.getEmail(),
                    sender.getLocalPicture(),
                    sender.getOauth2Id(),
                    sender.getPhoneNumber(),
                    sender.getPicture(),
                    sender.isProfilePictureVisible(),
                    sender.getProvider()
            );
            friendshipDtos.add(friendshipDto);
        }

        return ResponseEntity.ok().body(friendshipDtos);
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingFriendsList(@RequestParam Long userId) {

        Map<String,Object> response = new HashMap<>();

        List<FriendshipDto> pendingFriendshipRequests = new ArrayList<>();

        List<Friendships> pendingList = friendshipsService.getPendingRequests(userId);

        for(Friendships f : pendingList){
            User receiver = f.getReceiver();
            User sender = f.getSender();
            FriendshipDto friendshipDto = new FriendshipDto(
                    f.getStatus(),
                    f.getCreatedAt(),
                    f.getId(),
                    receiver.getId(),
                    receiver.isBanned(),
                    receiver.getEmail(),
                    receiver.getLocalPicture(),
                    receiver.getOauth2Id(),
                    receiver.getPhoneNumber(),
                    receiver.getPicture(),
                    receiver.isProfilePictureVisible(),
                    receiver.getProvider(),
                    sender.getId(),
                    sender.isBanned(),
                    sender.getEmail(),
                    sender.getLocalPicture(),
                    sender.getOauth2Id(),
                    sender.getPhoneNumber(),
                    sender.getPicture(),
                    sender.isProfilePictureVisible(),
                    sender.getProvider()
            );
            pendingFriendshipRequests.add(friendshipDto);
        }

        response.put("response",pendingFriendshipRequests);

        return ResponseEntity.ok(response);
    }

}
