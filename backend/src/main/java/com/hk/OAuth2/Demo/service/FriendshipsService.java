package com.hk.OAuth2.Demo.service;

import com.hk.OAuth2.Demo.entity.Friendships;
import com.hk.OAuth2.Demo.entity.User;
import com.hk.OAuth2.Demo.repository.FriendshipsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendshipsService {

    private final FriendshipsRepository friendshipsRepository;
    private final UserService userService;

    public FriendshipsService(FriendshipsRepository friendshipsRepository, UserService userService) {
        this.friendshipsRepository = friendshipsRepository;
        this.userService = userService;
    }

    public Friendships sendFriendRequest(Long senderId , Long receiverId) {

        User sender = userService.findById(senderId);
        User receiver = userService.findById(receiverId);

        if(sender == null){
            throw new RuntimeException("Sender not found");
        }
        if(receiver == null){
            throw new RuntimeException("Receiver not found");
        }

        Friendships friendships = new Friendships();
        friendships.setSender(sender);
        friendships.setReceiver(receiver);
        friendships.setStatus("PENDING");
        return friendshipsRepository.save(friendships);
    }

    public Friendships acceptFriendRequest(Long requestId) {

        Friendships friendship = friendshipsRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        friendship.setStatus("ACCEPTED");
        return friendshipsRepository.save(friendship);
    }

    public Friendships rejectFriendRequest(Long requestId) {

        Friendships friendship = friendshipsRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        friendshipsRepository.deleteById(requestId);

        return friendship;
    }

    public List<Friendships> getFriends(Long userId) {
        User user = userService.findById(userId);
        if(user == null){
            throw new RuntimeException("User not found");
        }
        return friendshipsRepository.findBySenderOrReceiverAndStatus(user,user,"ACCEPTED");
    }

    public List<Friendships> getPendingRequests(Long userId) {
        User user = userService.findById(userId);
        if(user == null){
            throw new RuntimeException("User not found");
        }
        return friendshipsRepository.findByReceiverAndStatus(user,"PENDING");
    }

}
