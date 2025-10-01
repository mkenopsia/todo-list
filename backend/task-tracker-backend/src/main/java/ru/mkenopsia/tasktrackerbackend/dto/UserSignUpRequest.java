package ru.mkenopsia.tasktrackerbackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserSignUpRequest(
        @NotBlank(message = "{validation.error.username.not_blank}")
        @Size(min = 2, max = 20, message = "{validation.error.username.invalid_size}")
        String username,
        @NotBlank(message = "{validation.error.password.not_blank}")
        @Size(min = 5, max = 50, message = "{validation.error.password.invalid_size}")
        String password,
        @NotBlank(message = "{validation.error.email.not_blank}")
        @Email(regexp = "\\w+@\\w+\\.\\w+", message = "{validation.error.email.invalid_structure}")
        String email
) {}
