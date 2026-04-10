package com.fit.iuh.userservice.service;

import com.fit.iuh.userservice.dto.AuthResponse;
import com.fit.iuh.userservice.dto.LoginRequest;
import com.fit.iuh.userservice.dto.RegisterRequest;
import com.fit.iuh.userservice.dto.TokenValidationResponse;
import com.fit.iuh.userservice.dto.UserResponse;
import com.fit.iuh.userservice.entity.User;
import com.fit.iuh.userservice.repository.UserRepository;
import com.fit.iuh.userservice.security.JwtTokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserEventPublisher userEventPublisher;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider,
            AuthenticationManager authenticationManager,
            UserEventPublisher userEventPublisher
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.userEventPublisher = userEventPublisher;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role("USER")
                .build();

        User savedUser = userRepository.save(user);
        userEventPublisher.publishUserRegistered(savedUser);
        String token = jwtTokenProvider.generateToken(savedUser.getUsername());

        return new AuthResponse(token, "Bearer", UserResponse.fromEntity(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );
        } catch (BadCredentialsException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        String token = jwtTokenProvider.generateToken(user.getUsername());
        return new AuthResponse(token, "Bearer", UserResponse.fromEntity(user));
    }

    public TokenValidationResponse validateToken(String token) {
        if (token == null || token.isBlank() || !jwtTokenProvider.isTokenValid(token)) {
            return new TokenValidationResponse(false, null, null);
        }

        return new TokenValidationResponse(
                true,
                jwtTokenProvider.extractUsername(token),
                jwtTokenProvider.extractExpiration(token)
        );
    }
}
