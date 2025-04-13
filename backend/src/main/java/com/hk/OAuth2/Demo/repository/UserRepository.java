package com.hk.OAuth2.Demo.repository;

import com.hk.OAuth2.Demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByOauth2Id(String oauth2Id);
    Optional<User> findByUsername(String username);
    Optional<User> findByVerificationToken(String verificationToken);
    Optional<User> findByPhoneNumber(String phoneNumber);
    boolean existsByUsername(String username);
    List<User> findAll();
    void deleteById(Long id);

}
