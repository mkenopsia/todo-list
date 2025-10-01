package ru.mkenopsia.tasktrackerbackend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import ru.mkenopsia.shared.dto.EmailMessageDto;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class EmailSenderService {

    private final KafkaTemplate<String, EmailMessageDto> template;
    private final MessageSource messageSource;

    @Value("${EMAIL_SENDING_TOPIC}")
    private String topicName;

    public void sendGreetingEmail(String username, String email) {
        String greetingHeader = this.messageSource.getMessage("email.greeting.header",
                null, Locale.getDefault());

        String greetingMessage = this.messageSource.getMessage("email.greeting.message",
                null, Locale.getDefault()).formatted(username);

        template.send(topicName, new EmailMessageDto(email, greetingHeader, greetingMessage));
    }
}
