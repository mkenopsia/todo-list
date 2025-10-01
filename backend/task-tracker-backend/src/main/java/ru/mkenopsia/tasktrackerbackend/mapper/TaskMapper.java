package ru.mkenopsia.tasktrackerbackend.mapper;

import org.springframework.stereotype.Component;
import ru.mkenopsia.shared.entity.Task;
import ru.mkenopsia.tasktrackerbackend.dto.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

//@Mapper(
//        componentModel = "spring",
//        unmappedTargetPolicy = ReportingPolicy.IGNORE
//)
//public interface TaskMapper {
//
////    @Mapping(target = "date", expression = "java(task.getDate().toLocalDate())")
//    TaskDto toTaskDto(Task task);
//
//    @Mapping(target = "id", ignore = true)
//    @Mapping(target = "authorId", source = "userId")
//    @Mapping(target = "isDone", constant = "false")
//    @Mapping(target = "name", source = "request.name")
//    @Mapping(target = "description", source = "request.description")
//    @Mapping(target = "date", source = "request.date")
//    Task toEntity(Integer userId, CreateTaskRequest request);
//
//    @Mapping(target = "id", source = "taskId")
//    @Mapping(target = "authorId", source = "userId")
//    @Mapping(target = "isDone", source = "request.isDone")
//    @Mapping(target = "name", source = "request.name")
//    @Mapping(target = "description", source = "request.description")
//    @Mapping(target = "date", source = "request.date")
//    Task toEntity(Integer userId, Integer taskId, UpdateTaskRequest request);
//
//    CreateTaskResponse toCreateTaskResponse(Task task);
//
//    UpdateTaskResponse toUpdateTaskResponse(Task task);
//
//    default List<Task> toEntities(Integer userId, List<CreateTaskRequest> request) {
//        if(userId == null || request == null) {
//            return null;
//        }
//
//        return request.stream()
//                .map((createTaskRequest) -> this.toEntity(userId, createTaskRequest))
//                .toList();
//    }
//
//    ArrayList<CreateTaskResponse> toCreateTaskResponses(List<Task> tasks);
//
//    ArrayList<UpdateTaskResponse> toUpdateTaskResponses(List<Task> tasks);
//}

@Component
public class TaskMapper {

    public TaskDto toTaskDto(Task task) {
        if ( task == null ) {
            return null;
        }

        Integer id = null;
        String name = null;
        String description = null;
        Boolean isDone = null;
        LocalDate date = null;

        id = task.getId();
        name = task.getName();
        description = task.getDescription();
        isDone = task.getIsDone();
        date = task.getDate();

        TaskDto taskDto = new TaskDto( id, name, description, isDone, date );

        return taskDto;
    }

    public Task toEntity(Integer userId, CreateTaskRequest request) {
        if ( userId == null && request == null ) {
            return null;
        }

        Task task = new Task();

        if ( request != null ) {
            task.setName( request.name() );
            task.setDescription( request.description() );
            task.setDate( request.date() );
            task.setIsDone( request.isDone() );
        }
        task.setAuthorId( userId );

        return task;
    }

    public List<Task> toEntities(Integer userId, List<CreateTaskRequest> request) {
        if(userId == null || request == null) {
            return null;
        }

        return request.stream()
                .map((createTaskRequest) -> this.toEntity(userId, createTaskRequest))
                .toList();
    }

    public Task toEntity(Integer userId, Integer taskId, UpdateTaskRequest request) {
        if ( userId == null && taskId == null && request == null ) {
            return null;
        }

        Task task = new Task();

        if ( request != null ) {
            task.setIsDone( request.isDone() );
            task.setName( request.name() );
            task.setDescription( request.description() );
            task.setDate( request.date() );
        }
        task.setAuthorId( userId );
        task.setId( taskId );

        return task;
    }

    public CreateTaskResponse toCreateTaskResponse(Task task) {
        if ( task == null ) {
            return null;
        }

        Integer id = null;
        String name = null;
        String description = null;
        LocalDate date = null;

        id = task.getId();
        name = task.getName();
        description = task.getDescription();
        date = task.getDate();

        CreateTaskResponse createTaskResponse = new CreateTaskResponse( id, name, description, date );

        return createTaskResponse;
    }

    public UpdateTaskResponse toUpdateTaskResponse(Task task) {
        if ( task == null ) {
            return null;
        }

        Integer id = null;
        String name = null;
        String description = null;
        Boolean isDone = null;
        LocalDate date = null;

        id = task.getId();
        name = task.getName();
        description = task.getDescription();
        isDone = task.getIsDone();
        date = task.getDate();

        UpdateTaskResponse updateTaskResponse = new UpdateTaskResponse( id, name, description, isDone, date );

        return updateTaskResponse;
    }

    public ArrayList<CreateTaskResponse> toCreateTaskResponses(List<Task> tasks) {
        if ( tasks == null ) {
            return null;
        }

        ArrayList<CreateTaskResponse> arrayList = new ArrayList<CreateTaskResponse>();
        for ( Task task : tasks ) {
            arrayList.add( toCreateTaskResponse( task ) );
        }

        return arrayList;
    }

    public ArrayList<UpdateTaskResponse> toUpdateTaskResponses(List<Task> tasks) {
        if ( tasks == null ) {
            return null;
        }

        ArrayList<UpdateTaskResponse> arrayList = new ArrayList<UpdateTaskResponse>();
        for ( Task task : tasks ) {
            arrayList.add( toUpdateTaskResponse( task ) );
        }

        return arrayList;
    }
}