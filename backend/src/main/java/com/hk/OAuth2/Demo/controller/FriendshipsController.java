package com.hk.OAuth2.Demo.controller;

import com.hk.OAuth2.Demo.dto.FriendshipDto;
import com.hk.OAuth2.Demo.entity.Friendships;
import com.hk.OAuth2.Demo.entity.User;
import com.hk.OAuth2.Demo.service.FriendshipsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        List<FriendshipDto> pendingRequests = friendshipsService.getPendingRequests(receiverId);
        for(FriendshipDto f : pendingRequests){
            if(f.getSenderId().equals(senderId)){
                response.put("error","Request already sent");
                return ResponseEntity.badRequest().body(response);
            }
        }

        // 2. Check if there's already a pending request *from receiver to sender
        List<FriendshipDto> pendingRequestsForSender =  friendshipsService.getPendingRequests(senderId);
        for(FriendshipDto f : pendingRequestsForSender){
            if(f.getSenderId().equals(receiverId)){
                response.put("error", "You already have a request from this user");
                return ResponseEntity.badRequest().body(response);
            }
        }

        // 3. Check if they are already friends
        List<FriendshipDto> friends =  friendshipsService.getFriends(receiverId);
        for(FriendshipDto f : friends){
            if(f.getSenderId().equals(senderId) &&  f.getReceiverId().equals(receiverId)){
                response.put("error", "You are already friends");
                return ResponseEntity.badRequest().body(response);
            }
            if(f.getSenderId().equals(receiverId) &&  f.getReceiverId().equals(senderId)){
                response.put("error", "You are already friends");
                return ResponseEntity.badRequest().body(response);
            }

        }

        Friendships friendships = friendshipsService.sendFriendRequest(senderId, receiverId);
        response.put("message", "Friend request sent successfully");
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/accept")
    public ResponseEntity<?> acceptFriendRequest(@RequestParam Long requestId){
        Friendships friendships = friendshipsService.acceptFriendRequest(requestId);
        Map<String,Object> response = new HashMap<>();
        response.put("result","friendship accepted");
        FriendshipDto friendshipDto = friendshipsService.getFriendshipDto(friendships);
        response.put("response",friendshipDto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/reject")
    public ResponseEntity<?> rejectFriendRequest(@RequestParam Long requestId){
        Friendships friendships = friendshipsService.rejectFriendRequest(requestId);
        Map<String,Object> response = new HashMap<>();
        response.put("result","Friend request rejected");
        FriendshipDto friendshipDto = friendshipsService.getFriendshipDto(friendships);
        response.put("response",friendshipDto);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/friends-list")
    public ResponseEntity<?> getFriendsList(@RequestParam Long userId) {
        Map<String,Object> response = new HashMap<>();
        List<FriendshipDto> friendshipDtos = friendshipsService.getFriends(userId);
        response.put("response",friendshipDtos);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingFriendsList(@RequestParam Long userId) {
        Map<String,Object> response = new HashMap<>();
        List<FriendshipDto> pendingFriendshipDtos = friendshipsService.getPendingRequests(userId);
        response.put("response",pendingFriendshipDtos);
        return ResponseEntity.ok(response);
    }
}