package ru.mkenopsia.tasktrackerbackend.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mkenopsia.tasktrackerbackend.dto.UserLoginRequest;
import ru.mkenopsia.tasktrackerbackend.dto.UserLoginResponse;
import ru.mkenopsia.tasktrackerbackend.dto.UserSignUpRequest;
import ru.mkenopsia.tasktrackerbackend.dto.UserSignUpResponse;
import ru.mkenopsia.tasktrackerbackend.service.AuthService;
import ru.mkenopsia.tasktrackerbackend.service.EmailSenderService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmailSenderService emailSenderService;

    @PostMapping("/sign-up")
    public ResponseEntity<UserSignUpResponse> signUp(@Valid @RequestBody UserSignUpRequest userSignUpRequest,
                                                     HttpServletResponse response,
                                                     BindingResult bindingResult) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }

        UserSignUpResponse createdUser = this.authService.signUpUser(userSignUpRequest);

        this.emailSenderService.sendGreetingEmail(createdUser.username(), createdUser.email());

        response.addCookie(authService.getTokenCookie(createdUser.username(), createdUser.email()));

        return ResponseEntity.ok(createdUser);
    }

    @PostMapping("/sign-in")
    public ResponseEntity<UserLoginResponse> signIn(@Valid @RequestBody UserLoginRequest userLoginRequest,
                                                    HttpServletResponse response,
                                                    BindingResult bindingResult) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }

        UserLoginResponse loginResponse = this.authService.signInUser(userLoginRequest);

        response.addCookie(authService.getTokenCookie(loginResponse.username(), loginResponse.email()));

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/sign-out")
    public ResponseEntity<?> signOut(HttpServletResponse response) {

        response.addCookie(authService.getDeletionCookie());

        return ResponseEntity.noContent().build();
    }
}
