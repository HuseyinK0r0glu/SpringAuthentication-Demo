package com.hk.OAuth2.Demo.controller;

import com.hk.OAuth2.Demo.dto.UserDto;
import com.hk.OAuth2.Demo.entity.User;
import com.hk.OAuth2.Demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController()
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userService.findAll();

        List<UserDto> userDtos = new ArrayList<>();

        for(User user : users) {
            // dont send admin
            if(user.getRoles().contains("ROLE_ADMIN")) {
                continue;
            }
            UserDto dto = new UserDto(user.getId(),user.getUsername(),user.getEmail(),
                    user.getProvider(),user.getOauth2Id(),user.getPicture(),user.getLocalPicture(),
                    user.getRoles(),user.isProfilePictureVisible(),user.isBanned());
            userDtos.add(dto);
        }

        return ResponseEntity.ok().body(userDtos);
    }

    @PatchMapping("/ban-user")
    public ResponseEntity<?> banUser(@RequestBody Map<String, Object> banRequest) {

        Map<String,Object> response = new HashMap<>();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) authentication.getPrincipal();
        User admin = userService.findByEmail(email);

        if(admin == null) {
            response.put("error", "User not found.");
            return ResponseEntity.badRequest().body(response);
        }

        if(!admin.getRoles().contains("ROLE_ADMIN")) {
            response.put("error", "User is not admin.");
            return ResponseEntity.badRequest().body(response);
        }

        if(!banRequest.containsKey("user_id")) {
            response.put("error","Missing user id");
            return ResponseEntity.badRequest().body(response);
        }

        Object userIdObj = banRequest.get("user_id");
        long userId;

        try{
            if(userIdObj instanceof Number) {
                userId = ((Number) userIdObj).longValue();
            }else {
                userId = Long.parseLong(userIdObj.toString());
            }
        }catch (Exception e){
            response.put("error","Invalid user id");
            return ResponseEntity.badRequest().body(response);
        }

        User user = userService.findById(userId);

        if(user == null) {
            response.put("error", "User not found.");
            return ResponseEntity.badRequest().body(response);
        }

        if(!banRequest.containsKey("ban_value")) {
            response.put("error","Missing ban value");
            return ResponseEntity.badRequest().body(response);
        }

        user.setBanned((Boolean) banRequest.get("ban_value"));
        userService.save(user);
        response.put("result","User status updated successfully.");
        return ResponseEntity.ok().body(response);
    }


}
