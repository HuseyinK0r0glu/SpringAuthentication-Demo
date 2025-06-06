package com.hk.OAuth2.Demo.controller;

import com.hk.OAuth2.Demo.dto.UpdatePasswordRequest;
import com.hk.OAuth2.Demo.dto.UpdateUserNameRequest;
import com.hk.OAuth2.Demo.dto.UserDto;
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
import java.util.*;

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

        // database Unicode changed to utf8mb4 that supports case sensivity
        // ALTER TABLE users MODIFY user_name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
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

        // if the user had a profile picture we need to delete that before deleting the user
        deleteLocalProfileImage(user);

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

        // if the user had a profile picture we need to delete that before deleting the user
        deleteLocalProfileImage(user);

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
        deleteLocalProfileImage(user);

        String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
        Path path = Paths.get(directory, filename).toAbsolutePath().normalize();
        Files.copy(image.getInputStream(),path, StandardCopyOption.REPLACE_EXISTING);

        user.setLocalPicture("profile_pictures" + "/" + filename);
        userService.save(user);

        response.put("result", "Profile picture uploaded successfully");
        response.put("local_picture",user.getLocalPicture());
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/delete-profile-picture")
    public ResponseEntity<?> deleteProfilePicture() {

        Map<String,String> response = new HashMap<>();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailAddress = (String) authentication.getPrincipal();
        User user = userService.findByEmail(emailAddress);

        if(user == null) {
            response.put("error", "User not found.");
            return ResponseEntity.badRequest().body(response);
        }

        String profilePicture = user.getLocalPicture();

        if(profilePicture == null) {
            response.put("error", "Profile picture is empty.");
            return ResponseEntity.badRequest().body(response);
        }

        // delete the picture from local system
        deleteLocalProfileImage(user);

        // delete the picture from database
        user.setLocalPicture(null);
        userService.save(user);

        response.put("result", "Profile picture deleted successfully");
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String name) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailAddress = (String) authentication.getPrincipal();
        User currentUser = userService.findByEmail(emailAddress);

        List<User> listOfUsers = userService.searchUsersByUsername(name);

        if (listOfUsers.isEmpty()) {
            Map<String,String> response = new HashMap<>();
            response.put("error", "No user with this name exists.");
            return ResponseEntity.badRequest().body(response);
        }

        List<UserDto> userDtos = getUserDtos(listOfUsers, currentUser);

        return ResponseEntity.ok().body(userDtos);
    }

    private List<UserDto> getUserDtos(List<User> listOfUsers, User currentUser) {
        List<UserDto> userDtos = new ArrayList<>();

        for (User user : listOfUsers) {

            if(user == currentUser){
                continue;
            }

            // dont send admin as user
            if(user.getRoles().contains("ROLE_ADMIN")){
                continue;
            }

            UserDto userDto = new UserDto(user.getId(),user.getUsername(),user.getEmail(),
                    user.getProvider(),user.getOauth2Id(),user.getPicture(),user.getLocalPicture(),
                    user.getRoles(),user.isProfilePictureVisible(), user.isBanned());
            userDtos.add(userDto);
        }
        return userDtos;
    }

    // HTTP method used to partially update a resource on the server
    // PUT updates entire resource and this updates partially
    @PatchMapping("/profile-picture-visibility")
    public ResponseEntity<?> changeProfilePictureVisibility(@RequestBody Map<String,Boolean> request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailAddress = (String) authentication.getPrincipal();
        User user = userService.findByEmail(emailAddress);

        Map<String,Object> response = new HashMap<>();

        if(user == null) {
            response.put("error", "User not found.");
            return ResponseEntity.badRequest().body(response);
        }

        boolean isVisible = request.getOrDefault("isVisible", true);
        user.setProfilePictureVisible(isVisible);
        userService.save(user);

        response.put("result", "Profile picture visibility updated successfully");
        return ResponseEntity.ok().body(response);
    }

    // to get the updated user
    @GetMapping("/me")
    public ResponseEntity<?> me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailAddress = (String) authentication.getPrincipal();
        User user = userService.findByEmail(emailAddress);

        Map<String,Object> response = new HashMap<>();

        if(user == null) {
            response.put("error", "User not found.");
            return ResponseEntity.badRequest().body(response);
        }

        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("name", user.getUsername());
        response.put("roles", user.getRoles());
        response.put("is_banned", user.isBanned());
        response.put("picture_visible", user.isProfilePictureVisible());
        response.put("local_picture", user.getLocalPicture());
        response.put("verified", user.getVerified());

        if (user.getProvider() != null) {
            response.put("provider", user.getProvider());
            response.put("oauth2Id", user.getOauth2Id());
            response.put("picture", user.getPicture());
        } else {
            response.put("failed_attempts", user.getFailedAttempts());
            response.put("phone", user.getPhoneNumber());
            response.put("phone_verified", user.getPhoneVerified());
        }

        return ResponseEntity.ok().body(response);
    }

    public void deleteLocalProfileImage(User user){
        String profilePicture = user.getLocalPicture();
        if(profilePicture != null) {
            File picturePath = new File("uploads/" + profilePicture);
            if(picturePath.exists()) {
                picturePath.delete();
            }
        }
    }

}
