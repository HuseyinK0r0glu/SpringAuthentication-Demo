package com.hk.OAuth2.Demo.service;

import com.hk.OAuth2.Demo.dto.FriendshipDto;
import com.hk.OAuth2.Demo.entity.Friendships;
import com.hk.OAuth2.Demo.entity.User;
import com.hk.OAuth2.Demo.repository.FriendshipsRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FriendshipsService {

    private final FriendshipsRepository friendshipsRepository;
    private final UserService userService;

    public FriendshipsService(FriendshipsRepository friendshipsRepository, UserService userService) {
        this.friendshipsRepository = friendshipsRepository;
        this.userService = userService;
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

    // here it deletes the frienships from db this could change
    public Friendships rejectFriendRequest(Long requestId) {

        Friendships friendship = friendshipsRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        friendshipsRepository.deleteById(requestId);

        return friendship;
    }

    public List<FriendshipDto> getFriends(Long userId) {
        User user = userService.findById(userId);
        if(user == null){
            throw new RuntimeException("User not found");
        }
        List<Friendships> sent =  friendshipsRepository.findBySenderAndStatus(user, "ACCEPTED");
        List<Friendships>  received = friendshipsRepository.findByReceiverAndStatus(user, "ACCEPTED");

        sent.addAll(received);

        List<FriendshipDto> friendshipDtos = new ArrayList<>();

        for(Friendships friendships : sent){
            FriendshipDto friendshipDto = getFriendshipDto(friendships);
            friendshipDtos.add(friendshipDto);
        }

        return friendshipDtos;
    }

    public List<FriendshipDto> getPendingRequests(Long userId) {
        User user = userService.findById(userId);
        if(user == null){
            throw new RuntimeException("User not found");
        }

        List<FriendshipDto> pendingRequestDtos = new ArrayList<>();
        List<Friendships> pendingList = friendshipsRepository.findByReceiverAndStatus(user,"PENDING");

        for(Friendships friendships : pendingList){
            FriendshipDto friendshipDto = getFriendshipDto(friendships);
            pendingRequestDtos.add(friendshipDto);
        }

        return pendingRequestDtos;
    }
}
