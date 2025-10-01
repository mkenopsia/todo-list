import React, { useState } from "react";
import './TodoList.css'
import DateContext from "../DateContext/DateContext";
import OverdueTasks from "../OverdueTask/OverdueTask";
import EditingWindow from "../EditingWindow/EditingWindow";
import { useTasks } from '../../provider/TasksProvider';
import { useModal } from '../../provider/ModalProvider';

function TodoList() {
  const { tasks, updateTask, addTask, deleteTask, toggleTaskStatus, getCurrentWeekDates, weekDates, editTask } = useTasks();
  const { isModalOpen, modalDate, formData, openCreatingModal, closeModal, isSaveMode, openEditingModal } = useModal();

  // надо чтобы брал из мапы текущую неделю и отрисовывал её
  return (
    <div className="weekdays-container">
      <OverdueTasks />
      {/* <CompletedTasksContext /> */}
      {weekDates.map((date) =>
        <DateContext key={date} date={date} tasks={tasks} />)}

      {isModalOpen && (
        <EditingWindow />
      )}
    </div>
  );
}

export default TodoList;
