package ru.mkenopsia.shared.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder
@Table(schema = "task_management", name = "t_task")
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "c_name")
    private String name;

    @Column(name = "c_description")
    private String description;

    @Column(name = "c_isdone")
    private Boolean isDone;

    @Column(name = "c_date")
    private LocalDate date;

//    @ManyToOne
//    private User author;
    @Column(name = "c_author_id")
    private Integer authorId;
}
