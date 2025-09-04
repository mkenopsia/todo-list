import React, { useState } from "react";
import '../TodoList/TodoList.css'
import { useModal } from '../../provider/ModalProvider'
import { useTasks } from '../../provider/TasksProvider';

function DateContext({ date }) {
    const { isModalOpen, modalDate, formData, openCreatingModal, closeModal, openEditingModal } = useModal();
    const { tasks, updateTask, addTask, deleteTask, toggleTaskStatus, getCurrentWeekDates, weekDates } = useTasks();

    return (
        <div key={date} className="day-container">
            <div className="date-label"><strong>{new Date(date).toLocaleDateString('ru-RU', {
                weekday: 'short',
                day: '2-digit',
                month: 'short'
            })}</strong></div>

            <div className="tasks-list">
                {tasks.get(date)?.length > 0 ? (
                    tasks.get(date).map(task => (
                        <div key={task.id} className="task-card">
                            <input type="checkbox"
                                checked={task.status === 'done'}
                                className={`task-status${task.status}`}
                                onChange={() => toggleTaskStatus(date, task)}>
                            </input>
                            <div className="task-details">
                                <strong>{task.name}</strong>
                                {task.description && <p>{task.description}</p>}
                                <div className="task-control-buttons">
                                    <button onClick={() => deleteTask(date, task)}>🗑️</button>
                                    <button onClick={() => openEditingModal(date, task)}>✍️</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty">Нет задач</div>
                )}
            </div>

            <button onClick={() => openCreatingModal(date)} className="add-task-btn">
                + Добавить
            </button>
        </div>)
}

export default DateContext;