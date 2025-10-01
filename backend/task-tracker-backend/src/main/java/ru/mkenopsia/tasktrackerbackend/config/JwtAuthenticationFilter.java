package ru.mkenopsia.tasktrackerbackend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.filter.OncePerRequestFilter;
import ru.mkenopsia.tasktrackerbackend.service.JwtTokenService;

import java.io.IOException;
import java.util.NoSuchElementException;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenService jwtTokenService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        if (path.startsWith("/api/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwtToken = null;

        try {
            jwtToken = jwtTokenService.getTokenFromHttpCookie(request.getCookies());
        } catch (NoSuchElementException exception) {
            filterChain.doFilter(request, response);
            return;
        }

        if(!jwtTokenService.isTokenValid(jwtToken)) {
            filterChain.doFilter(request, response);
            return;
        }

        String username = jwtTokenService.getUsername(jwtToken);

        if(!username.isBlank() && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                var authToken = new UsernamePasswordAuthenticationToken(userDetails.getUsername(),
                        null, userDetails.getAuthorities());

                authToken.setDetails(userDetails);
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } catch (UsernameNotFoundException exception) {
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
