package ru.mkenopsia.tasktrackerbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.mkenopsia.shared.entity.Task;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Integer> {
    @Query(nativeQuery = true, value = "SELECT * FROM task_management.t_task" +
            " WHERE c_date BETWEEN :from AND :to AND c_author_id = :userId")
    List<Task> getUserTasksWithinPeriod(@Param("userId") Integer userId, @Param("from") LocalDate from, @Param("to") LocalDate to);

    List<Task> getAllTasksByAuthorId(Integer authorId);

    Optional<Task> getTaskById(Integer taskId);
}
