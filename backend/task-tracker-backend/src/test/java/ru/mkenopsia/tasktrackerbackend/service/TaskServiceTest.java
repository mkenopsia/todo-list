package ru.mkenopsia.tasktrackerbackend.service;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import ru.mkenopsia.shared.entity.Task;
import ru.mkenopsia.shared.entity.User;
import ru.mkenopsia.tasktrackerbackend.mapper.TaskMapper;
import ru.mkenopsia.tasktrackerbackend.repository.TaskRepository;
import ru.mkenopsia.tasktrackerbackend.repository.UserRepository;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Import(TaskService.class)
@ActiveProfiles("test")
class TaskServiceTest {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskService taskService;

    @MockitoBean
    private TaskMapper taskMapper;

    private User user1 = User.builder()
            .username("user1")
            .password("123")
            .email("user1@mail.ru")
            .build();

    @BeforeEach
    public void setUp() {
        this.userRepository.save(user1);
    }

    @Test
    void testCreateTask_successfulCreation() {

        Task task = Task.builder()
                .authorId(this.userRepository.findByUsername(user1.getUsername()).get().getId())
                .date(LocalDate.now())
                .description("skibi")
                .name("dop")
                .isDone(false)
                .build();

        Task savedTask = this.taskService.createTask(task);

        assertThat(this.taskRepository.existsById(savedTask.getId())).isTrue();
        assertThat(savedTask)
                .extracting(Task::getAuthorId, Task::getName, Task::getDescription, Task::getDate, Task::getIsDone)
                .containsExactly(task.getAuthorId(), task.getName(), task.getDescription(), task.getDate(), task.getIsDone());
    }

    @Test
    void getUserTasksWithinPeriod() {
    }

    @Test
    void deleteTaskById() {
    }

    @Test
    void updateTask() {
    }

    @Test
    void getAllUserTasks() {
    }

    @Test
    void toggleTaskStatus() {
    }

    @Test
    void saveTasks() {
    }
}