package com.example.bookswap.payload;

import jakarta.validation.constraints.*;

public record SignupRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min=6, max=40) String password,
        @NotBlank @Size(min=6, max=40) String confirmPassword,
        @NotBlank @Size(min=2, max=50) String name
) {}