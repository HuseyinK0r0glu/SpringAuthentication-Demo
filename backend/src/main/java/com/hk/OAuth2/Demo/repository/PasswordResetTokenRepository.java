package com.hk.OAuth2.Demo.repository;

import com.hk.OAuth2.Demo.entity.PasswordResetToken;
import com.hk.OAuth2.Demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    PasswordResetToken findByToken(String token);
    PasswordResetToken findByUser(User user);
    void deleteByUserId(Long userId);
}
