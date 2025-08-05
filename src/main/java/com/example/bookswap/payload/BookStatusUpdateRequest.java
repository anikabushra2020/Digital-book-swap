package com.example.bookswap.payload;

import jakarta.validation.constraints.NotBlank;

public record BookStatusUpdateRequest(@NotBlank String status) {}