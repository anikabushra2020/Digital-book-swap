package com.example.bookswap.payload;

public record JwtResponse(String token, String type, String email, Long id) {}