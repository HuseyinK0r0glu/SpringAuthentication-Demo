package com.hk.OAuth2.Demo.repository;

import com.hk.OAuth2.Demo.entity.Friendships;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendshipsRepository extends JpaRepository<Friendships, Long> {

    List<Friendships> findBySenderIdOrReceiverIdAndStatus(Long senderId, Long receiverId, String status);
    List<Friendships> findByReceiverIdAndStatus(Long receiverId, String status);
    Friendships findById(long id);
    void deleteById(long id);

}
