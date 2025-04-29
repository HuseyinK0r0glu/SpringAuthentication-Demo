package com.hk.OAuth2.Demo.controller;

import com.hk.OAuth2.Demo.entity.Friendships;
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

    @PostMapping("/request")
    public ResponseEntity<Friendships> sendFriendRequest(@RequestParam Long senderId,@RequestParam Long receiverId){
        Friendships friendships = friendshipsService.sendFriendRequest(senderId, receiverId);
        return ResponseEntity.ok(friendships);
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
    public ResponseEntity<List<Friendships>> getFriendsList(@RequestParam Long userId) {
        List<Friendships> friendsList = friendshipsService.getFriends(userId);
        return ResponseEntity.ok(friendsList);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Friendships>> getPendingFriendsList(@RequestParam Long userId) {
        List<Friendships> pendingList = friendshipsService.getPendingRquests(userId);
        return ResponseEntity.ok(pendingList);
    }

}
