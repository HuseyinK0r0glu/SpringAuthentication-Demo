package com.hk.OAuth2.Demo.controller;

import com.hk.OAuth2.Demo.dto.UpdatePasswordRequest;
import com.hk.OAuth2.Demo.dto.UpdateUserNameRequest;
import com.hk.OAuth2.Demo.entity.User;
import com.hk.OAuth2.Demo.service.PasswordValidationService;
import com.hk.OAuth2.Demo.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final PasswordValidationService passwordValidationService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService,
                          PasswordValidationService passwordValidationService,
                          PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordValidationService = passwordValidationService;
        this.passwordEncoder = passwordEncoder;
    }

    @PutMapping("/update-username")
    public ResponseEntity<?> updateUserName(@RequestBody UpdateUserNameRequest updateUserNameRequest) {

        Map<String,String> response = new HashMap<>();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailAddress = (String) authentication.getPrincipal();
        User user = userService.findByEmail(emailAddress);

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
        response.put("message", "User updated successfully.");
        return ResponseEntity.ok().body(response);
    }

    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody UpdatePasswordRequest updatePasswordRequest) {

        Map<String,String> response = new HashMap<>();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailAddress = (String) authentication.getPrincipal();
        User user = userService.findByEmail(emailAddress);

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
        response.put("message", "Password updated successfully");
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/oauth")
    public ResponseEntity<?> deleteOauthUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailAddress = (String) authentication.getPrincipal();
        User user = userService.findByEmail(emailAddress);

        Map<String,String> response = new HashMap<>();

        if(user == null){
            response.put("error", "User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        userService.deleteById(user.getId());
        response.put("result", "User deleted successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/traditional")
    public ResponseEntity<?> deleteTraditionalUser(@RequestBody Map<String,String> request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailAddress = (String) authentication.getPrincipal();
        User user = userService.findByEmail(emailAddress);

        String providedPassword = request.get("password");

        Map<String,String> response = new HashMap<>();

        if(user == null){
            response.put("error", "User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        if(!passwordEncoder.matches(providedPassword, user.getPassword())) {
            response.put("error", "Passwords do not match.");
            return ResponseEntity.badRequest().body(response);
        }

        userService.deleteById(user.getId());
        response.put("result", "User deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload-profile-picture")
    public ResponseEntity<?> addProfilePicture(@RequestParam("image") MultipartFile image) throws IOException {

        Map<String,String> response = new HashMap<>();

        if(image == null){
            response.put("error", "Image is empty.");
            return ResponseEntity.badRequest().body(response);
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailAddress = (String) authentication.getPrincipal();
        User user = userService.findByEmail(emailAddress);

        if(user == null) {
            response.put("error", "User not found.");
            return ResponseEntity.badRequest().body(response);
        }

        String directory = "uploads/profile_pictures";

        File uploadDir = new File(directory);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // if user have a profile picture we need to delete that before adding new one
        String oldProfilePicturePath = user.getLocalPicture();
        if(oldProfilePicturePath != null) {
            File oldImage = new File(oldProfilePicturePath);
            if(oldImage.exists()) {
                oldImage.delete();
            }
        }

        String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
        Path path = Paths.get(directory, filename).toAbsolutePath().normalize();
        Files.copy(image.getInputStream(),path, StandardCopyOption.REPLACE_EXISTING);

        user.setLocalPicture(directory + "/" + filename);
        userService.save(user);

        response.put("result", "Profile picture uploaded successfully");
        return ResponseEntity.ok().body(response);
    }

}
