package ru.mkenopsia.tasktrackerbackend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ru.mkenopsia.tasktrackerbackend.dto.TokenDto;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtTokenService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.lifetime}")
    private Duration jwtLifetime;

    private final TokenCookieService tokenCookieService;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public TokenDto generateToken(String username, String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);

        Date issuedTime = new Date();
        Date expirationTime = new Date(issuedTime.getTime() + jwtLifetime.toMillis());

        String token = Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(issuedTime)
                .expiration(expirationTime)
                .signWith(getSigningKey())
                .compact();

        return new TokenDto(token, expirationTime);
    }

    public String getUsername(String token) {
        return this.getAllClaims(token).getSubject();
    }

    public String getEmail(String token) {
        return this.getAllClaims(token).get("email", String.class);
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getTokenFromHttpCookie(Cookie[] cookies) {
        if(cookies == null) return null;

        return tokenCookieService.getTokenBearerCookie(cookies).getValue();
    }

    public TokenDto refreshToken(String jwtToken) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", this.getEmail(jwtToken));

        Date issuedTime = new Date();
        Date expirationTime = new Date(issuedTime.getTime() + jwtLifetime.toMillis());

        String token = Jwts.builder()
                .claims(claims)
                .subject(this.getUsername(jwtToken))
                .issuedAt(issuedTime)
                .expiration(expirationTime)
                .signWith(getSigningKey())
                .compact();

        return new TokenDto(token, expirationTime);
    }
}
