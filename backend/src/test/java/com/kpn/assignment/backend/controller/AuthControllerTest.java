package com.kpn.assignment.backend.controller;

import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.kpn.assignment.backend.model.User;
import com.kpn.assignment.backend.repository.UserRepository;
import com.kpn.assignment.backend.security.JwtUtil;
import com.kpn.assignment.backend.service.UserDetailsServiceImpl;

class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ===================== LOGIN TESTS =====================
    @Test
    void login_ShouldReturnToken_WhenCredentialsAreValid() throws Exception {
        String username = "testUser";
        String password = "password";
        String token = "jwt-token";

        UserDetails userDetails = mock(UserDetails.class);

        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
        when(jwtUtil.generateToken(userDetails)).thenReturn(token);

        ResponseEntity<?> response = authController.login(Map.of(
            "username", username,
            "password", password
        ));

        verify(authenticationManager).authenticate(new UsernamePasswordAuthenticationToken(username, password));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).containsEntry("token", token)
                        .containsEntry("username", username)
                        .containsEntry("expiresIn", "10 hours");
    }

    @Test
    void login_ShouldReturnUnauthorized_WhenBadCredentials() throws Exception {
        String username = "wrongUser";
        String password = "wrongPass";

        doThrow(BadCredentialsException.class)
            .when(authenticationManager)
            .authenticate(any(UsernamePasswordAuthenticationToken.class));

        ResponseEntity<?> response = authController.login(Map.of(
            "username", username,
            "password", password
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).containsEntry("error", "Invalid credentials");
    }

    // ===================== REGISTER TESTS =====================
    @Test
    void register_ShouldReturnSuccess_WhenUserDoesNotExist() {
        String username = "newUser";
        String password = "newPass";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());
        when(passwordEncoder.encode(password)).thenReturn("encodedPass");

        ResponseEntity<?> response = authController.register(Map.of(
            "username", username,
            "password", password
        ));

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();

        assertThat(savedUser.getUsername()).isEqualTo(username);
        assertThat(savedUser.getPassword()).isEqualTo("encodedPass");
        assertThat(savedUser.getRole()).isEqualTo("ROLE_USER");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).containsEntry("message", "User registered successfully");
    }

    @Test
    void register_ShouldReturnConflict_WhenUsernameAlreadyExists() {
        String username = "existingUser";
        String password = "pass";

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(new User()));

        ResponseEntity<?> response = authController.register(Map.of(
            "username", username,
            "password", password
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).containsEntry("error", "Username already exists");
    }
}