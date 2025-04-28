package com.hk.OAuth2.Demo.service;

import com.hk.OAuth2.Demo.entity.Friendships;
import com.hk.OAuth2.Demo.repository.FriendshipsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendshipsService {

    FriendshipsRepository friendshipsRepository;

    public FriendshipsService(FriendshipsRepository friendshipsRepository) {
        this.friendshipsRepository = friendshipsRepository;
    }

    public Friendships sendFriendRequest(Long senderId , Long receiverId) {
        Friendships friendships = new Friendships();
        friendships.setSenderId(senderId);
        friendships.setReceiverId(receiverId);
        friendships.setStatus("PENDING");
        return friendshipsRepository.save(friendships);
    }

    public Friendships acceptFriendRequest(Long requestId) {

        Friendships friendship = friendshipsRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        friendship.setStatus("ACCEPTED");
        return friendshipsRepository.save(friendship);
    }

    public void rejectFriendRequest(Long requestId) {

        Friendships friendship = friendshipsRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        friendshipsRepository.deleteById(requestId);
    }

    public List<Friendships> getFriends(Long userId) {
        return friendshipsRepository.findBySenderIdOrReceiverIdAndStatus(userId,userId,"ACCEPTED");
    }

    public List<Friendships> getPendingRquests(Long userId) {
        return friendshipsRepository.findByReceiverIdAndStatus(userId,"PENDING");
    }

}
