package ru.mkenopsia.task_tracker_scheduler.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.mkenopsia.shared.entity.Task;
import ru.mkenopsia.task_tracker_scheduler.repository.TaskRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return this.taskRepository.findAll();
    }

    public List<Task> getAllUserTasksByDay(Integer authorId, LocalDate now) {
        return this.taskRepository.findAllByAuthorIdAndDate(authorId, now);
    }
}
