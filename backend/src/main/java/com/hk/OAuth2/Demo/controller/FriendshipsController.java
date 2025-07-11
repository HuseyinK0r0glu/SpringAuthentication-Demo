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

    public FriendshipDto getFriendshipDto(Friendships friendships){
        User receiver = friendships.getReceiver();
        User sender = friendships.getSender();
        FriendshipDto friendshipDto = new FriendshipDto(
                friendships.getStatus(),
                friendships.getCreatedAt(),
                friendships.getId(),
                receiver.getUsername(),
                receiver.getId(),
                receiver.isBanned(),
                receiver.getEmail(),
                receiver.getLocalPicture(),
                receiver.getOauth2Id(),
                receiver.getPhoneNumber(),
                receiver.getPicture(),
                receiver.isProfilePictureVisible(),
                receiver.getProvider(),
                sender.getUsername(),
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
        return friendshipDto;
    }

    @PostMapping("/accept")
    public ResponseEntity<?> acceptFriendRequest(@RequestParam Long requestId){
        Friendships friendships = friendshipsService.acceptFriendRequest(requestId);
        Map<String,Object> response = new HashMap<>();
        response.put("result","friendship accepted");
        FriendshipDto friendshipDto = getFriendshipDto(friendships);
        response.put("response",friendshipDto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/reject")
    public ResponseEntity<?> rejectFriendRequest(@RequestParam Long requestId){
        Friendships friendships = friendshipsService.rejectFriendRequest(requestId);
        Map<String,Object> response = new HashMap<>();
        response.put("result","Friend request rejected");
        FriendshipDto friendshipDto = getFriendshipDto(friendships);
        response.put("response",friendshipDto);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/friends-list")
    public ResponseEntity<?> getFriendsList(@RequestParam Long userId) {

        Map<String,Object> response = new HashMap<>();

        List<FriendshipDto> friendshipDtos = new ArrayList<>();

        List<Friendships> friendsList = friendshipsService.getFriends(userId);

        for(Friendships friendships : friendsList){
            FriendshipDto friendshipDto = getFriendshipDto(friendships);
            friendshipDtos.add(friendshipDto);
        }

        response.put("response",friendshipDtos);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingFriendsList(@RequestParam Long userId) {

        Map<String,Object> response = new HashMap<>();

        List<FriendshipDto> pendingFriendshipRequests = new ArrayList<>();

        List<Friendships> pendingList = friendshipsService.getPendingRequests(userId);

        for(Friendships friendships : pendingList){
            FriendshipDto friendshipDto = getFriendshipDto(friendships);
            pendingFriendshipRequests.add(friendshipDto);
        }

        response.put("response",pendingFriendshipRequests);

        return ResponseEntity.ok(response);
    }

}