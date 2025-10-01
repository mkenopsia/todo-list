package ru.mkenopsia.tasktrackerbackend.dto;

import java.time.LocalDate;

public record TaskDto(
        Integer id,
        String name,
        String description,
        Boolean isDone,
        LocalDate date) {
}
