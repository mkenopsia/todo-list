package ru.mkenopsia.tasktrackeremailsender.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailSendingService {

    private final JavaMailSender mailSender;

    public void sendEmail(String address, String subject, String body) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(address);
        mailMessage.setSubject(subject);
        mailMessage.setText(body);
        mailMessage.setFrom("gxkurro@yandex.ru");

        mailSender.send(mailMessage);
    }
}
