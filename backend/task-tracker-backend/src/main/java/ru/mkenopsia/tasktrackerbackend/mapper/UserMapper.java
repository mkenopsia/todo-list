package ru.mkenopsia.tasktrackerbackend.mapper;

import org.springframework.stereotype.Component;
import ru.mkenopsia.shared.entity.User;
import ru.mkenopsia.tasktrackerbackend.dto.*;

//@Mapper(
//        componentModel = "spring",
//        unmappedTargetPolicy = ReportingPolicy.IGNORE
//)
//public interface UserMapper {
//
//    User toEntity(UserSignUpRequest request);
//
//    User toEntity(UserInfoDto userInfoDto);
//
//    UserSignUpResponse toSignUpResponse(User user);
//
//    UserInfoDto toUserInfoDto(User user);
//
//    UserLoginResponse toUserLoginResponse(User user);
//}

@Component
public class UserMapper {
    public User toEntity(UserSignUpRequest request) {
        if (request == null) {
            return null;
        } else {
            User user = new User();
            user.setUsername(request.username());
            user.setEmail(request.email());
            user.setPassword(request.password());
            return user;
        }
    }

    public User toEntity(UserInfoDto userInfoDto) {
        if (userInfoDto == null) {
            return null;
        } else {
            User user = new User();
            user.setUsername(userInfoDto.username());
            user.setEmail(userInfoDto.email());
            return user;
        }
    }

    public UserSignUpResponse toSignUpResponse(User user) {
        if (user == null) {
            return null;
        } else {
            String username = null;
            String email = null;
            username = user.getUsername();
            email = user.getEmail();
            UserSignUpResponse userSignUpResponse = new UserSignUpResponse(username, email);
            return userSignUpResponse;
        }
    }

    public UserInfoDto toUserInfoDto(User user) {
        if (user == null) {
            return null;
        } else {
            String username = null;
            String email = null;
            username = user.getUsername();
            email = user.getEmail();
            UserInfoDto userInfoDto = new UserInfoDto(username, email);
            return userInfoDto;
        }
    }

    public UserLoginResponse toUserLoginResponse(User user) {
        if (user == null) {
            return null;
        } else {
            String username = null;
            String email = null;
            username = user.getUsername();
            email = user.getEmail();
            UserLoginResponse userLoginResponse = new UserLoginResponse(username, email);
            return userLoginResponse;
        }
    }
}
