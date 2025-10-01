//package ru.mkenopsia.tasktrackerbackend.config;
//
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.web.authentication.session.SessionAuthenticationException;
//import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
//import ru.mkenopsia.tasktrackerbackend.dto.CustomUserDetails;
//import ru.mkenopsia.tasktrackerbackend.dto.UserInfoDto;
//import ru.mkenopsia.tasktrackerbackend.utils.TokenCookieUtils;
//import ru.mkenopsia.tasktrackerbackend.utils.JwtTokenUtils;
//
//@RequiredArgsConstructor
//public class JwtCookieSessionAuthenticationStrategy implements SessionAuthenticationStrategy {
//
//    private final JwtTokenUtils jwtTokenUtils;
//    private final TokenCookieUtils cookieUtils;
//
//    @Override
//    public void onAuthentication(Authentication authentication, HttpServletRequest request, HttpServletResponse response) throws SessionAuthenticationException {
//        if (authentication instanceof UsernamePasswordAuthenticationToken &&
//                authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
//
//            response.addCookie(cookieUtils.provideCookieWithRefreshedToken(jwtTokenUtils.generateToken(userDetails)));
//        } else {
//            throw new UnsupportedOperationException("auth.error.authentication-data");
//        }
//    }
//}
