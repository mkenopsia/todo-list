package ru.mkenopsia.tasktrackerbackend.dto;

import java.util.Date;

public record TokenDto(
        String token,
        Date expirationTime
) {}
