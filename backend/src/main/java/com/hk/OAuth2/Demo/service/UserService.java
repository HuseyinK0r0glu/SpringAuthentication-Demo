package com.hk.OAuth2.Demo.service;

import com.hk.OAuth2.Demo.entity.User;
import com.hk.OAuth2.Demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository , PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public User findByVerificationToken(String verificationToken) {
        return userRepository.findByVerificationToken(verificationToken).orElse(null);
    }

    public boolean existsByUserName(String username){
        return userRepository.existsByUsername(username);
    }

    // for update the user
    public void save(User user) {
        userRepository.save(user);
    }

    public User findById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    // for oauth2 logins
    public User createUser(String userName , String email , String provider , String oauth2Id , String picture) {

        User existingUser = userRepository.findByEmail(email).orElse(null);

        if(existingUser != null) {
            return existingUser;
        }

        User user = new User(userName,email,provider,oauth2Id,picture);

        user.setRoles(List.of("ROLE_USER"));
        user.setVerified(1);

        return userRepository.save(user);
    }

    public User saveUserForTraditionalLogin(String userName , String email , String password , String token, LocalDateTime expiryTime) {

        Optional<User> existingUser = userRepository.findByEmail(email);

        if(existingUser.isPresent()) {
            return existingUser.get();
        }

        User user = new User();
        user.setUsername(userName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setVerified(0);
        user.setVerificationToken(token);
        user.setExpiryTime(expiryTime);
        user.setRoles(List.of("ROLE_USER"));

        return userRepository.save(user);
    }

    public void deleteById(Long userId) {
        userRepository.deleteById(userId);
    }

}