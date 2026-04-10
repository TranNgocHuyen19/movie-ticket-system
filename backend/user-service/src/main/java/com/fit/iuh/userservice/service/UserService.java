package com.fit.iuh.userservice.service;

import com.fit.iuh.userservice.dto.UpdateUserRequest;
import com.fit.iuh.userservice.dto.UserResponse;
import com.fit.iuh.userservice.entity.User;
import com.fit.iuh.userservice.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return UserResponse.fromEntity(user);
    }

    public UserResponse getById(Long id) {
        User user = findByIdOrThrow(id);
        return UserResponse.fromEntity(user);
    }

    public UserResponse updateById(Long id, UpdateUserRequest request, String requesterUsername) {
        User user = findByIdOrThrow(id);
        if (!user.getUsername().equals(requesterUsername)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only update your own user");
        }

        if (request.username() != null && !request.username().isBlank() && !request.username().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.username())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
            }
            user.setUsername(request.username());
        }

        if (request.email() != null && !request.email().isBlank() && !request.email().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.email())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
            }
            user.setEmail(request.email());
        }

        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }

        return UserResponse.fromEntity(userRepository.save(user));
    }

    public void deleteById(Long id, String requesterUsername) {
        User user = findByIdOrThrow(id);
        if (!user.getUsername().equals(requesterUsername)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own user");
        }

        userRepository.delete(user);
    }

    private User findByIdOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
