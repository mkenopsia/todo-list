import React, { useState } from "react";
import './TodoList.css'
import DateContext from "../DateContext/DateContext";
import OverdueTasksContext from "../OverdueTask/OverdueTask";
import { useTasks } from '../../provider/TasksProvider';
import { useModal } from '../../provider/ModalProvider';


function TodoList() {
  const { tasks, updateTask, addTask, deleteTask, toggleTaskStatus, getCurrentWeekDates, weekDates, editTask } = useTasks();
  const { isModalOpen, modalDate, formData, openCreatingModal, closeModal, isSaveMode, openEditingModal } = useModal();

  // надо чтобы брал из мапы текущую неделю и отрисовывал её
  return (
    <div className="weekdays-container">
      <OverdueTasksContext />
      {/* <CompletedTasksContext /> */}
      {weekDates.map((date) =>
        <DateContext key={date} date={date} tasks={tasks} />)}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Новая задача - {modalDate}</h3>
            <div>
              <div>
                <label>Название *</label>
                <input
                  className="task-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={updateTask}
                  required
                  placeholder="Введите название"
                />
              </div>

              <div>
                <label>Описание</label>
                <textarea
                  className="task-description"
                  name="description"
                  value={formData.description}
                  onChange={updateTask}
                  placeholder="Описание задачи"
                  rows="3"
                />
              </div>

              <div>
                <label>Статус</label>
                <select className="task-status-selector" name="status" value={formData.status} onChange={updateTask}>
                  <option value="active">Активна</option>
                  <option value="done">Выполнена</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-cancel">
                  Отмена
                </button>
                {isSaveMode ? (
                  <button onClick={addTask} className="btn-submit">
                    Добавить
                  </button>
                ) :
                  <button onClick={() => editTask(formData.taskId)}>Сохранить</button>
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoList;
