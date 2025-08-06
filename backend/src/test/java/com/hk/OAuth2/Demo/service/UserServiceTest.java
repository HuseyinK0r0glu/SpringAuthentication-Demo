package com.hk.OAuth2.Demo.service;

import com.hk.OAuth2.Demo.entity.User;
import com.hk.OAuth2.Demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    UserService userService;
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    // runs before every test
    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);

        userService = new UserService(userRepository, passwordEncoder);
    }

    @Test
    public void testFindByIdReturnsCorrectUser() {

        Long id = 1L;

        User user = new User();
        user.setId(id);
        user.setUsername("Hüseyin");
        user.setEmail("hüseyin@example.com");

        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        User result = userService.findById(id);

        assertNotNull(result);
        assertEquals("Hüseyin", result.getUsername());
        assertEquals("hüseyin@example.com", result.getEmail());

        verify(userRepository,times(1)).findById(id);

    }

    @Test
    public void testFindByUsernameReturnsCorrectUser() {

        String username = "Hüseyin";
        String email = "hüseyin@example.com";

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        User result = userService.findByUsername(username);

        assertNotNull(result);
        assertEquals(username, result.getUsername());
        assertEquals(email, result.getEmail());
        verify(userRepository,times(1)).findByUsername(username);

    }

    @Test
    public void testFindByUsernanmeReturnsNullWhenNotFound() {

        String username = "NoneexistentUser";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        User result = userService.findByUsername(username);

        assertNull(result);
        verify(userRepository,times(1)).findByUsername(username);

    }

    @Test
    public void testFindByEmailReturnsCorrectUser() {

        String username = "Hüseyin";
        String email = "hüseyin@example.com";

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        User result = userService.findByEmail(email);

        assertNotNull(result);
        assertEquals(username, result.getUsername());
        assertEquals(email, result.getEmail());
        verify(userRepository,times(1)).findByEmail(email);
    }

    @Test
    public void testFindByEmailReturnsNullWhenNotFound() {

        String email = "nonexistent@example.com";

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        User result = userService.findByEmail(email);

        assertNull(result);
        verify(userRepository,times(1)).findByEmail(email);
    }

}
