package com.hk.OAuth2.Demo.controller;

import com.hk.OAuth2.Demo.dto.UpdatePasswordRequest;
import com.hk.OAuth2.Demo.dto.UpdateUserNameRequest;
import com.hk.OAuth2.Demo.entity.User;
import com.hk.OAuth2.Demo.service.PasswordValidationService;
import com.hk.OAuth2.Demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final PasswordValidationService passwordValidationService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordValidationService passwordValidationService,PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordValidationService = passwordValidationService;
        this.passwordEncoder = passwordEncoder;
    }

    @PutMapping("/{id}/update-username")
    public ResponseEntity<?> updateUserName(@PathVariable Long id, @RequestBody UpdateUserNameRequest updateUserNameRequest) {

        Map<String,String> response = new HashMap<>();
        User user = userService.findById(id);

        if(user == null) {
            response.put("error", "User not found.");
            return ResponseEntity.badRequest().body(response);
        }

        if(user.getUsername().equals(updateUserNameRequest.getUsername())){
            response.put("error", "New username cannot be the same as the current username.");
            return ResponseEntity.badRequest().body(response);
        }

        User existingUser = userService.findByUsername(updateUserNameRequest.getUsername());
        if(existingUser != null && !existingUser.getId().equals(user.getId())) {
            response.put("error", "Username is already in use.");
            return ResponseEntity.badRequest().body(response);
        }

        user.setUsername(updateUserNameRequest.getUsername());
        userService.save(user);
        return ResponseEntity.ok("Username updated successfully");
    }

    @PutMapping("/{id}/update-password")
    public ResponseEntity<?> updatePassword(@PathVariable Long id,@RequestBody UpdatePasswordRequest updatePasswordRequest) {

        Map<String,String> response = new HashMap<>();
        User user = userService.findById(id);

        if(user == null) {
            response.put("error", "User not found.");
            return ResponseEntity.badRequest().body(response);
        }

        if(!updatePasswordRequest.getPassword().equals(updatePasswordRequest.getConfirmPassword())) {
            response.put("error", "Passwords do not match.");
            return ResponseEntity.badRequest().body(response);
        }

        if(passwordEncoder.matches(updatePasswordRequest.getPassword(), user.getPassword())) {
            response.put("error", "New password cannot be the same as the current password.");
            return ResponseEntity.badRequest().body(response);
        }

        String validationResult = passwordValidationService.validatePassword(updatePasswordRequest.getPassword());
        if(validationResult != null) {
            response.put("error", validationResult);
            return ResponseEntity.badRequest().body(response);
        }

        user.setPassword(passwordEncoder.encode(updatePasswordRequest.getPassword()));
        userService.save(user);
        return ResponseEntity.ok("Password updated successfully");
    }
}
