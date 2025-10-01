package ru.mkenopsia.tasktrackerbackend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mkenopsia.shared.entity.Task;
import ru.mkenopsia.tasktrackerbackend.dto.TaskDto;
import ru.mkenopsia.tasktrackerbackend.mapper.TaskMapper;
import ru.mkenopsia.tasktrackerbackend.repository.TaskRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    @Transactional
    public Task createTask(Task task) {
        return this.taskRepository.save(task);
    }

    @Transactional(readOnly = true)
    public Map<String, List<TaskDto>> getUserTasksWithinPeriod(Integer userId, LocalDate from, LocalDate to) {
        return this.taskRepository.getUserTasksWithinPeriod(userId, from, to)
                .stream().map(taskMapper::toTaskDto)
                .collect(Collectors.groupingBy(task -> task.date().toString()));
    }

    @Transactional
    public void deleteTaskById(Integer taskId) {
        this.taskRepository.deleteById(taskId);
    }

    @Transactional
    public Task updateTask(Task task) {
        return this.taskRepository.save(task);
    }

    @Transactional(readOnly = true)
    public Map<String, List<TaskDto>> getAllUserTasks(Integer userId) {
        var tasks = this.taskRepository.getAllTasksByAuthorId(userId);

        return tasks.stream().map(taskMapper::toTaskDto)
                .collect(Collectors.groupingBy(task -> task.date().toString()));
    }

    @Transactional
    public Task toggleTaskStatus(Integer taskId) {
        Task task = this.taskRepository.getTaskById(taskId)
                .orElseThrow(() -> new NoSuchElementException("datasource.error.tasks.not_found"));

        task.setIsDone(!task.getIsDone());

        return this.taskRepository.save(task);
    }

    public List<Task> saveTasks(List<Task> tasks) {
        return this.taskRepository.saveAll(tasks);
    }
}
