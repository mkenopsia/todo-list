package ru.mkenopsia.tasktrackerbackend.service;

import jakarta.servlet.http.Cookie;
import org.springframework.stereotype.Service;
import ru.mkenopsia.tasktrackerbackend.dto.TokenDto;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.NoSuchElementException;

@Service
public class TokenCookieService {

    public Cookie getTokenBearerCookie(Cookie[] cookies) {
        if(cookies == null) {
            throw new NoSuchElementException("auth.error.jwt_token.token_not_found");
        }

        for(var cookie : cookies) {
//            if(cookie.getName().equals("__Host-auth-token")) {
            if(cookie.getName().equals("auth-token")) {
                return cookie;
            }
        }

        throw new NoSuchElementException("auth.error.jwt_token.token_not_found");
    }

    public Cookie provideCookieWithRefreshedToken(TokenDto tokenDto) {
//        Cookie cookie = new Cookie("__Host-auth-token", tokenDto.token());
        Cookie cookie = new Cookie("auth-token", tokenDto.token());
        cookie.setPath("/");
//        cookie.setDomain(null);
//        cookie.setSecure(true);
//        cookie.setHttpOnly(true);
        cookie.setMaxAge((int) ChronoUnit.SECONDS.between(Instant.now(), tokenDto.expirationTime().toInstant()));

        return cookie;
    }

    public Cookie getDeletionCookie() {
//        Cookie cookie = new Cookie("__Host-auth-token", "");
        Cookie cookie = new Cookie("auth-token", "");
        cookie.setPath("/");
//        cookie.setDomain(null);
//        cookie.setSecure(true);
//        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);

        return cookie;
    }
}
