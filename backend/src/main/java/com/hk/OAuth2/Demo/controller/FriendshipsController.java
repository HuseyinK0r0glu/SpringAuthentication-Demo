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


    // return json from endpoints


    @PostMapping("/request")
    public ResponseEntity<Map<String,Object>> sendFriendRequest(@RequestParam Long senderId,@RequestParam Long receiverId){
        Map<String,Object> response = new HashMap<>();

        List<Friendships> pendingRequests = friendshipsService.getPendingRequests(receiverId);
        for(Friendships f : pendingRequests){
            if(f.getSender().getId().equals(senderId)){
                response.put("error","Request already sent");
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
    public ResponseEntity<List<Friendships>> getFriendsList(@RequestParam Long userId) {
        List<Friendships> friendsList = friendshipsService.getFriends(userId);
        return ResponseEntity.ok(friendsList);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Friendships>> getPendingFriendsList(@RequestParam Long userId) {
        List<Friendships> pendingList = friendshipsService.getPendingRequests(userId);
        return ResponseEntity.ok(pendingList);
    }

}
