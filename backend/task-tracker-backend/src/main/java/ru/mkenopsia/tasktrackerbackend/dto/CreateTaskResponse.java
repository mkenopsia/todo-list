package ru.mkenopsia.tasktrackerbackend.dto;

import java.time.LocalDate;

public record CreateTaskResponse(
        Integer id,
        String name,
        String description,
        LocalDate date
) {
}
