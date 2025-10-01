package ru.mkenopsia.task_tracker_scheduler.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.mkenopsia.shared.entity.Task;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Integer> {

    List<Task> findAllByAuthorIdAndDate(Integer authorId, LocalDate date);
}
