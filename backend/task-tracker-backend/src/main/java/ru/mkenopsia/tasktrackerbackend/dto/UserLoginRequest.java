package ru.mkenopsia.tasktrackerbackend.dto;

import jakarta.validation.constraints.NotBlank;

public record UserLoginRequest(
        @NotBlank(message = "{validation.error.not_blank}")
        String identifier,
        @NotBlank(message = "{validation.error.not_blank}")
        String password
) {}
