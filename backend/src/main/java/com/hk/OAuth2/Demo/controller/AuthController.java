package com.hk.OAuth2.Demo.controller;

import com.hk.OAuth2.Demo.dto.LoginRequest;
import com.hk.OAuth2.Demo.dto.UserSignUpDto;
import com.hk.OAuth2.Demo.entity.User;
import com.hk.OAuth2.Demo.service.EmailService;
import com.hk.OAuth2.Demo.service.PasswordValidationService;
import com.hk.OAuth2.Demo.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final PasswordValidationService passwordValidationService;

    public AuthController(UserService userService, AuthenticationManager authenticationManager, EmailService emailService,PasswordEncoder passwordEncoder,PasswordValidationService passwordValidationService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.passwordValidationService = passwordValidationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserSignUpDto userSignUpDto) throws IOException {

        // userSignUpDto contains email,username,password,confirmPassword

        Map<String, String> response = new HashMap<>();

        if(!userSignUpDto.getPassword().equals(userSignUpDto.getConfirmPassword())){
            response.put("error","Passwords do not match!");
            return ResponseEntity.badRequest().body(response);
        }

        if(userService.findByEmail(userSignUpDto.getEmail()) != null) {
            response.put("error", "Email is already in use.");
            return ResponseEntity.badRequest().body(response);
        }

        if(userService.findByUsername(userSignUpDto.getUsername()) != null) {
            response.put("error", "Username is already in use.");
            return ResponseEntity.badRequest().body(response);
        }

        String passwordValidationResult = PasswordValidationService.validatePassword(userSignUpDto.getPassword());

        if (passwordValidationResult != null) {
            response.put("error", passwordValidationResult);
            return ResponseEntity.badRequest().body(response);
        }

        String hashedPassword = passwordEncoder.encode(userSignUpDto.getPassword());
        // generate verification token
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryTime = LocalDateTime.now().plusHours(24);
        User user = userService.saveUserForTraditionalLogin(userSignUpDto.getUsername() , userSignUpDto.getEmail() , userSignUpDto.getPassword(), token , expiryTime);

        emailService.sendEmail(userSignUpDto.getEmail() , "Verify your email", "Click the link to verify your email: http://localhost:3000/verify?token=" + token);
        response.put("message", "Registration successful. Check your email for verification.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam("token") String token) {

        if(token == null) {
            return ResponseEntity.badRequest().body("Missing token");
        }

        User user = userService.findByVerificationToken(token);

        if(user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found for this token");
        }

        // check if the token is expired
        if(user.getExpiryTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Verification link has expired. Please request a new one.");
        }

        if (user.getVerified() == 1) {
            return ResponseEntity.ok("User already verified");
        }

        user.setVerified(1);
        user.setVerificationToken(null);

        // update the user
        userService.save(user);

        return ResponseEntity.ok("User verified successfully");

    }

    // for traditional login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){

        // loginRequest contains email and password

        try{
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            User user = userService.findByEmail(loginRequest.getEmail());

            if (user.getVerified() == 0) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email is not verified. Please verify your email before logging in.");
            }

            Map<String,Object> response = new HashMap<>();
            response.put("message","Login Successful");
            response.put("id" , user.getId());
            response.put("email",user.getEmail());
            response.put("password",user.getPassword());

            return ResponseEntity.ok(response);

        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

    }

    // after oauth2 authentication flow it will be called to check if success
    @GetMapping ("/oauth2/login")
    public ResponseEntity<Map<String,Object>> loginSuccess(OAuth2AuthenticationToken token) {

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "OAuth2 Authentication failed"));
        }

        Map<String,Object> attributes = token.getPrincipal().getAttributes();
        String provider = token.getAuthorizedClientRegistrationId();
        String email = (String) attributes.get("email");
        String picture = null;
        if (email == null && provider.equals("github")) {
            email = attributes.get("login") + "@github.com"; // Fallback for GitHub
        }

        String name = (String) attributes.get("name");
        if (name == null) {
            name = (String) attributes.get("login"); // Fallback for GitHub
        }

        // this returns "google","GitHub","facebook"
        String oauth2Id = provider.equals("google") ? (String) attributes.get("sub")
                : provider.equals("github") ? String.valueOf(attributes.get("id")) : null;

        if (provider.equals("google")) {
            picture = (String) attributes.get("picture"); // Google profile image
        }

        if (provider.equals("github")) {
            picture = (String) attributes.get("avatar_url"); // GitHub profile image
        }

        User user = userService.createUser(name , email , provider, oauth2Id , picture);

        // Return user details as JSON for frontend
        Map<String,Object> response = new HashMap<>();
        response.put("id" , user.getId());
        response.put("name" , user.getUsername());
        response.put("email" , user.getEmail());
        response.put("provider" , user.getProvider());
        response.put("oauth2Id" , user.getOauth2Id());
        response.put("picture" , picture);

        return ResponseEntity.ok(response);
    }
}
