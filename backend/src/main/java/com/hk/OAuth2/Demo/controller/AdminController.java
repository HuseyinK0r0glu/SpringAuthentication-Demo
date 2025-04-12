package com.hk.OAuth2.Demo.controller;

import com.hk.OAuth2.Demo.dto.UserDto;
import com.hk.OAuth2.Demo.entity.User;
import com.hk.OAuth2.Demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

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
                    user.getRoles());
            userDtos.add(dto);
        }

        return ResponseEntity.ok().body(userDtos);
    }

}
