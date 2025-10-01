package ru.mkenopsia.tasktrackerbackend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.mkenopsia.tasktrackerbackend.dto.*;
import ru.mkenopsia.tasktrackerbackend.mapper.TaskMapper;
import ru.mkenopsia.tasktrackerbackend.service.TaskService;

@RestController
@RequestMapping("/api/task")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final TaskMapper taskMapper;

    @PostMapping
    public ResponseEntity<CreateTaskResponse> createTask(@Valid @RequestBody CreateTaskRequest request, BindingResult bindingResult) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }

        Integer userId = null;
        if (SecurityContextHolder.getContext().getAuthentication().getDetails() instanceof CustomUserDetails userDetails) {
            userId = userDetails.getId();
        } else {
            throw new IllegalArgumentException("server.auth.exception");
        }

        CreateTaskResponse createdTask = this.taskMapper.toCreateTaskResponse(
                this.taskService.createTask(this.taskMapper.toEntity(userId, request))
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @PostMapping("toggleStatus/{taskId}")
    public ResponseEntity<TaskDto> toggleTaskStatus(@PathVariable Integer taskId) {
        return ResponseEntity.ok().body(this.taskMapper.toTaskDto(
                this.taskService.toggleTaskStatus(taskId)
        ));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable("taskId") Integer taskId) {
        this.taskService.deleteTaskById(taskId);

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{taskId}")
    public ResponseEntity<UpdateTaskResponse> updateTask(@PathVariable("taskId") Integer taskId,
                                                         @Valid @RequestBody UpdateTaskRequest request,
                                                         BindingResult bindingResult) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }

        Integer userId = null;
        if (SecurityContextHolder.getContext().getAuthentication().getDetails() instanceof CustomUserDetails userDetails) {
            userId = userDetails.getId();
        } else {
            throw new IllegalArgumentException("server.auth.exception");
        }

        UpdateTaskResponse updatedTask = this.taskMapper.toUpdateTaskResponse(
                this.taskService.updateTask(this.taskMapper.toEntity(userId, taskId, request))
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(updatedTask);
    }
}
