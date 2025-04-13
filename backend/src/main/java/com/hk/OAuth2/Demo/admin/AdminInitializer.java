package com.hk.OAuth2.Demo.admin;

import com.hk.OAuth2.Demo.entity.User;
import com.hk.OAuth2.Demo.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if(!userService.existsByUserName("admin")){
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setVerified(1);
            admin.setEmail("admin@hk.com");
            admin.setRoles(Arrays.asList("ROLE_ADMIN", "ROLE_USER"));
            admin.setFailedAttempts(0);
            userService.save(admin);
        }
    }
}
