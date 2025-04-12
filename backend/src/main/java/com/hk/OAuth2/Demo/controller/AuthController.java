package com.hk.OAuth2.Demo.controller;

import com.hk.OAuth2.Demo.dto.ForgotPasswordRequest;
import com.hk.OAuth2.Demo.dto.LoginRequest;
import com.hk.OAuth2.Demo.dto.UpdatePasswordRequest;
import com.hk.OAuth2.Demo.dto.UserSignUpDto;
import com.hk.OAuth2.Demo.entity.PasswordResetToken;
import com.hk.OAuth2.Demo.entity.User;
import com.hk.OAuth2.Demo.jwt.JWTUtil;
import com.hk.OAuth2.Demo.repository.PasswordResetTokenRepository;
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
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final JWTUtil jwtUtil;

    public AuthController(UserService userService, AuthenticationManager authenticationManager, EmailService emailService, PasswordEncoder passwordEncoder, PasswordValidationService passwordValidationService, PasswordResetTokenRepository passwordResetTokenRepository,JWTUtil jwtUtil) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.passwordValidationService = passwordValidationService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.jwtUtil = jwtUtil;
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

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest) throws IOException {

        Map<String,Object> response = new HashMap<>();

        User user = userService.findByEmail(forgotPasswordRequest.getEmail());

        if(user == null) {
            response.put("error", "User not found");
            return ResponseEntity.badRequest().body(response);
        }

        if(user.getProvider() != null){
            response.put("error", "Please log in using " + user.getProvider());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String token = UUID.randomUUID().toString();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(15);

        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByUser(user);
        if(passwordResetToken == null) {
            passwordResetToken = new PasswordResetToken();
            passwordResetToken.setUser(user);
        }

        passwordResetToken.setToken(token);
        passwordResetToken.setExpiryTime(expiryTime);
        passwordResetTokenRepository.save(passwordResetToken);

        emailService.sendEmail(user.getEmail() , "Password Reset Request", "Click the link to reset your password: http://localhost:3000/new-password?token=" + token);
        response.put("message", "Reset email send successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam("token") String token ,@RequestBody UpdatePasswordRequest updatePasswordRequest) {

        Map<String,Object> response = new HashMap<>();

        if(token == null) {
            response.put("error", "Missing token");
            return ResponseEntity.badRequest().body(response);
        }

        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token);

        if(passwordResetToken == null) {
            response.put("error", "Token not found");
            return ResponseEntity.badRequest().body(response);
        }

        if(passwordResetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            response.put("error", "Token has expired");
            return ResponseEntity.badRequest().body(response);
        }

        User user = passwordResetToken.getUser();

        if(user == null) {
            response.put("error", "User not found");
            return ResponseEntity.badRequest().body(response);
        }

        if (passwordEncoder.matches(updatePasswordRequest.getPassword(), user.getPassword())) {
            response.put("error", "The new password cannot be the same as the old password.");
            return ResponseEntity.badRequest().body(response);
        }

        String passwordValidationResult = PasswordValidationService.validatePassword(updatePasswordRequest.getPassword());

        if (passwordValidationResult != null) {
            response.put("error", passwordValidationResult);
            return ResponseEntity.badRequest().body(response);
        }

        user.setPassword(passwordEncoder.encode(updatePasswordRequest.getPassword()));
        userService.save(user);

        passwordResetTokenRepository.delete(passwordResetToken);

        response.put("message", "Password successfully reset. You can now log in with your new password.");
        return ResponseEntity.ok(response);
    }

    // for traditional login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){

        // loginRequest contains email and password

        try{
            User user = userService.findByEmail(loginRequest.getEmail());
            Map<String,Object> response = new HashMap<>();

            if(user == null) {
                response.put("error", "User not found");
                return ResponseEntity.badRequest().body(response);
            }

            if (user.getVerified() == 0) {
                response.put("error", "Email is not verified. Please verify your email before logging in.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            if(user.getProvider() != null){
                response.put("error", "Please log in using " + user.getProvider());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            String token = jwtUtil.generateToken(user.getEmail());
            // send jwt token to frontend
            response.put("token",token);

            response.put("message","Login Successful");
            response.put("id" , user.getId());
            response.put("email",user.getEmail());
            response.put("name",user.getUsername());
            response.put("local_picture",user.getLocalPicture());

            return ResponseEntity.ok(response);

        }catch (Exception e){
            Map<String,Object> response = new HashMap<>();
            response.put("error", "Invalid username or password");
            return ResponseEntity.badRequest().body(response);
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

        String tokenJwt = jwtUtil.generateToken(user.getEmail());

        // Return user details as JSON for frontend
        Map<String,Object> response = new HashMap<>();
        response.put("id" , user.getId());
        response.put("name" , user.getUsername());
        response.put("email" , user.getEmail());
        response.put("provider" , user.getProvider());
        response.put("oauth2Id" , user.getOauth2Id());
        response.put("picture" , picture);
        response.put("token" , tokenJwt);

        return ResponseEntity.ok(response);
    }
}