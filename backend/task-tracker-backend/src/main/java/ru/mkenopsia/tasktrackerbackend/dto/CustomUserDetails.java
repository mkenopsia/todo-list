package ru.mkenopsia.tasktrackerbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@Getter
@Setter
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

    private Integer id;
    private String username;
    private String email;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;
}
