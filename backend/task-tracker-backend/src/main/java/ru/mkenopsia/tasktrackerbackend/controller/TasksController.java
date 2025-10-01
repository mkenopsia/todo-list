package ru.mkenopsia.tasktrackerbackend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.mkenopsia.tasktrackerbackend.dto.CreateTaskRequest;
import ru.mkenopsia.tasktrackerbackend.dto.CreateTaskResponse;
import ru.mkenopsia.tasktrackerbackend.dto.CustomUserDetails;
import ru.mkenopsia.tasktrackerbackend.dto.TaskDto;
import ru.mkenopsia.tasktrackerbackend.mapper.TaskMapper;
import ru.mkenopsia.tasktrackerbackend.service.TaskService;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TasksController {

    private final TaskService taskService;
    private final TaskMapper taskMapper;

    @GetMapping("/period")
    public ResponseEntity<Map<String, List<TaskDto>>> getTasksWithinPeriod(@RequestParam("from") LocalDate from,
                                                                           @RequestParam("to") LocalDate to) {
        if (from.isAfter(to)) {
            throw new IllegalArgumentException("validation.error.invalid_period");
        }

        Map<String, List<TaskDto>> tasks = new HashMap<>();
        if (SecurityContextHolder.getContext().getAuthentication().getDetails()
                instanceof CustomUserDetails userDetails) {
            tasks = this.taskService.getUserTasksWithinPeriod(userDetails.getId(), from, to);
        } else {
            throw new IllegalArgumentException("server.auth.exception");
        }

        return ResponseEntity.ok(tasks);
    }

    @GetMapping
    public ResponseEntity<Map<String, List<TaskDto>>> getAllTasks() {
        Map<String, List<TaskDto>> tasks;
        if (SecurityContextHolder.getContext().getAuthentication().getDetails()
                instanceof CustomUserDetails userDetails) {
            tasks = this.taskService.getAllUserTasks(userDetails.getId());
        } else {
            throw new IllegalArgumentException("server.auth.exception");
        }

        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<List<CreateTaskResponse>> createTasks(@Valid @RequestBody List<CreateTaskRequest> request,
                                                                BindingResult bindingResult) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }

        Integer userId = null;
        if (SecurityContextHolder.getContext().getAuthentication().getDetails()
                instanceof CustomUserDetails userDetails) {
            userId = userDetails.getId();
        } else {
            throw new IllegalArgumentException("server.auth.exception");
        }

        List<CreateTaskResponse> createdTasks = this.taskMapper.toCreateTaskResponses(
                this.taskService.saveTasks(this.taskMapper.toEntities(userId, request))
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(createdTasks);
    }
}
