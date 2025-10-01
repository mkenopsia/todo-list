package ru.mkenopsia.task_tracker_scheduler.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import ru.mkenopsia.shared.dto.EmailMessageDto;
import ru.mkenopsia.shared.entity.Task;
import ru.mkenopsia.shared.entity.User;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmailSenderService {

    private final KafkaTemplate<String, EmailMessageDto> kafkaTemplate;
    private final UserService userService;
    private final TaskService taskService;

    @Value("${EMAIL_SENDING_TOPIC}")
    private String topicName;

    @Scheduled(cron = "@daily")
//    @Scheduled(fixedRate = 3000)
    public void sendDailyTaskDigest() {
        List<User> users = this.userService.getAllUsers();

        for (User user : users) {
            List<Task> userTasks = this.taskService.getAllUserTasksByDay(user.getId(), LocalDate.now());

            List<String> completedTasks = userTasks.stream()
                    .filter(Task::getIsDone)
                    .map(Task::getName)
                    .limit(5)
                    .toList();

            List<String> uncompletedTasks = userTasks.stream()
                    .filter(task -> !task.getIsDone())
                    .map(Task::getName)
                    .limit(5)
                    .toList();

            if (completedTasks.isEmpty() && uncompletedTasks.isEmpty()) continue;

            this.kafkaTemplate.send(topicName,
                    this.createEmail(user.getEmail(), completedTasks, uncompletedTasks));
        }
    }

    private EmailMessageDto createEmail(String emailAddress, List<String> completedTasks, List<String> uncompletedTasks) {
        String header = "Ежедневный отчёт по задачам";
        String body = "Привет! Твой ежедневный отчёт по задачам:\n" +
                ((completedTasks.isEmpty()) ? "" : "За сегодня сделано:\n%s\n".formatted(String.join("\n", completedTasks))) +
                ((uncompletedTasks.isEmpty()) ? "" : "Просроченные задачи:\n%s".formatted(String.join("\n", uncompletedTasks)));

        return new EmailMessageDto(emailAddress, header, body);
    }
}
