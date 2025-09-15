import React, { useState } from "react";
import './TodoList.css'
import DateContext from "../DateContext/DateContext";
import OverdueTasks from "../OverdueTask/OverdueTask";
import EditingWindow from "../EditingWindow/EditingWindow";
import { useTasks } from '../../provider/TasksProvider';
import { useModal } from '../../provider/ModalProvider';
import CompletedTasks from "../CompletedTasks/CompletedTasks";

function TodoList() {
  const { tasks, weekDates } = useTasks();
  const { isModalOpen } = useModal();

  // берет из мапы текущую неделю и отрисовывает задачи на неё
  return (
    <div className="weekdays-container">
      <CompletedTasks/>
      <OverdueTasks />
      {weekDates.map((date) =>
        <DateContext key={date} date={date} tasks={tasks} />)}

      {isModalOpen && (
        <EditingWindow />
      )}
    </div>
  );
}

export default TodoList;
