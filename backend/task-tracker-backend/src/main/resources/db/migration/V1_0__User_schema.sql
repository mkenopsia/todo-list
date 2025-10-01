create schema if not exists user_management;

create table if not exists user_management.t_user
(
    id         serial primary key,
    c_username varchar(20) not null check ( length(trim(c_username)) > 0 ),
    c_password varchar     not null check ( length(trim(c_password)) > 0 ),
    c_email    varchar     not null check ( length(trim(c_email)) > 0 )
);