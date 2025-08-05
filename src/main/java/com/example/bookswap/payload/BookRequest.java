package com.example.bookswap.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

public record BookRequest(
    @NotBlank String title,

    @NotBlank String author,

    @NotBlank String subject,

    String description,

    @NotBlank @Email String contactEmail
) {}