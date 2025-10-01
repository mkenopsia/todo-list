package ru.mkenopsia.tasktrackerbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdateTaskRequest(
        @NotBlank(message = "{validation.error.task.name.not_blank}")
        @Size(min = 1, max = 200, message = "{validation.error.task.name.invalid_size}")
        String name,
        @Size(max = 500, message = "{validation.error.task.description_invalid_size}")
        String description,
        Boolean isDone,
        LocalDate date
) {
}
