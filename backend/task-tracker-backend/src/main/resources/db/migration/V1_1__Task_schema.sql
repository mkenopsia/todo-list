create schema if not exists task_management;

create table if not exists task_management.t_task
(
    id            serial primary key,
    c_name        varchar(100) not null check ( length(trim(c_name)) > 0),
    c_description varchar(500) not null check ( length(trim(c_description)) > 0),
    c_isdone      boolean      not null,
    c_date        date  not null,
    c_author_id   int          not null,
    constraint fk_task_user
        foreign key (c_author_id) references user_management.t_user (id)
);