package ru.mkenopsia.shared.dto;

public record EmailMessageDto(
        String emailAddress,
        String header,
        String body
) {
}
