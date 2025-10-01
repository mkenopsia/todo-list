package ru.mkenopsia.tasktrackerbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mkenopsia.tasktrackerbackend.dto.UserInfoDto;
import ru.mkenopsia.tasktrackerbackend.service.UserService;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserInfoDto> getUser(Authentication authentication) {

        UserInfoDto userInfo = this.userService.getUserInfo(authentication);

        return ResponseEntity.ok(userInfo);
    }
}
