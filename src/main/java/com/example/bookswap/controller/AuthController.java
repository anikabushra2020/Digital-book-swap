package com.example.bookswap.controller;

import com.example.bookswap.model.User;
import com.example.bookswap.payload.*;
import com.example.bookswap.security.JwtUtils;
import com.example.bookswap.security.UserDetailsImpl;
import com.example.bookswap.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    
    public AuthController(AuthenticationManager authenticationManager, 
                         UserService userService, 
                         JwtUtils jwtUtils, 
                         PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (!signUpRequest.password().equals(signUpRequest.confirmPassword())) {
            return ResponseEntity.badRequest().body("Passwords do not match");
        }

        if (userService.getUserByEmail(signUpRequest.email()) != null) {
            return ResponseEntity.badRequest().body("Email is already in use");
        }

        User user = userService.registerUser(signUpRequest.email(), signUpRequest.password());
        String token = jwtUtils.generateJwtToken(user.getEmail(), user.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(new JwtResponse(token, "Bearer", user.getEmail(), user.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String jwt = jwtUtils.generateJwtToken(userDetails.getUsername(), userDetails.getId());

            return ResponseEntity.ok(new JwtResponse(jwt, "Bearer", userDetails.getUsername(), userDetails.getId()));

        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }
}