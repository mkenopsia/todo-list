package ru.mkenopsia.tasktrackerbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@EntityScan({"ru.mkenopsia.shared.entity"})
public class TaskTrackerBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskTrackerBackendApplication.class, args);
    }

}
