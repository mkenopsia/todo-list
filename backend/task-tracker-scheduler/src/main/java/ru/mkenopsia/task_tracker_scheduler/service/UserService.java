package ru.mkenopsia.task_tracker_scheduler.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.mkenopsia.shared.entity.User;
import ru.mkenopsia.task_tracker_scheduler.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return this.userRepository.findAll();
    }
}
