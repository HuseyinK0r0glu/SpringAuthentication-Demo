package com.hk.OAuth2.Demo.repository;

import com.hk.OAuth2.Demo.entity.Friendships;
import com.hk.OAuth2.Demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendshipsRepository extends JpaRepository<Friendships, Long> {

    List<Friendships> findBySenderAndStatus(User user, String status);
    List<Friendships> findByReceiverAndStatus(User receiver, String status);
    Friendships findById(long id);
    void deleteById(long id);

}
