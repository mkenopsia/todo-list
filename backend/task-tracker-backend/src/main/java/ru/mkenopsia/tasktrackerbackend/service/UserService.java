package ru.mkenopsia.tasktrackerbackend.service;

import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mkenopsia.shared.entity.User;
import ru.mkenopsia.tasktrackerbackend.dto.UserInfoDto;
import ru.mkenopsia.tasktrackerbackend.mapper.UserMapper;
import ru.mkenopsia.tasktrackerbackend.repository.UserRepository;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Transactional
    public User save(User user) {
        if(userRepository.existsByUsername(user.getUsername())) {
            throw new EntityExistsException("datasource.error.user.username_already_taken");
        }

        if(userRepository.existsByEmail(user.getEmail())) {
            throw new EntityExistsException("datasource.error.user.email_already_taken");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return this.userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User findByUsernameOrEmail(String usernameOrEmail) {
        return this.userRepository.findByUsernameOrEmail(usernameOrEmail)
                .orElseThrow(() -> new NoSuchElementException("datasource.error.user.not_found"));
    }

    public User findByUsername(String username) {
        return this.userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("datasource.error.user.not_found"));
    }

    @Transactional(readOnly = true)
    public UserInfoDto getUserInfo(Authentication authentication) {
        User user = this.findByUsernameOrEmail(authentication.getName());

        return userMapper.toUserInfoDto(user);
    }
}
