package ru.mkenopsia.tasktrackerbackend.service;

import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.mkenopsia.shared.entity.User;
import ru.mkenopsia.tasktrackerbackend.dto.UserLoginRequest;
import ru.mkenopsia.tasktrackerbackend.dto.UserLoginResponse;
import ru.mkenopsia.tasktrackerbackend.dto.UserSignUpRequest;
import ru.mkenopsia.tasktrackerbackend.dto.UserSignUpResponse;
import ru.mkenopsia.tasktrackerbackend.mapper.UserMapper;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final UserMapper userMapper;
    private final JwtTokenService jwtTokenService;
    private final TokenCookieService tokenCookieService;

    public UserSignUpResponse signUpUser(UserSignUpRequest userSignUpRequest) {
        User user = userMapper.toEntity(userSignUpRequest);

        this.userService.save(user);

        return userMapper.toSignUpResponse(user);
    }

    public UserLoginResponse signInUser(UserLoginRequest userLoginRequest) {
        User user = this.userService.findByUsernameOrEmail(userLoginRequest.identifier());

        return userMapper.toUserLoginResponse(user);
    }

    public Cookie getDeletionCookie() {
        return this.tokenCookieService.getDeletionCookie();
    }

    public Cookie getTokenCookie(String username, String email) {
        return tokenCookieService.provideCookieWithRefreshedToken(jwtTokenService.generateToken(username, email));
    }
}
