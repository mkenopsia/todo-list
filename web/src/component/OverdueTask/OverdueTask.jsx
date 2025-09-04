import React, { useMemo, useState } from "react";
import '../TodoList/TodoList.css'
import { useModal } from '../../provider/ModalProvider'
import { useTasks } from '../../provider/TasksProvider';

function OverdueTasksContext() {
    const { isModalOpen, modalDate, formData, openCreatingModal, closeModal, openEditingModal } = useModal();
    const { tasks, updateTask, addTask, deleteTask, toggleTaskStatus, getCurrentWeekDates, weekDates } = useTasks();

    const overdueTasks = useMemo(() => {
        var allTasks = [];

        for (const value of tasks.values()) {
            allTasks.push(...value);
        }

        console.log(allTasks);

        return allTasks.filter(task => { return (new Date(task.date).getTime() < Date.now()) && (task.status === 'active') });
    }, [tasks]);

    return (
        <div key={Math.random()} className="day-container">
            <div className="date-label"><strong>Просроченные задачи</strong></div>

            <div className="tasks-list">
                {overdueTasks.length > 0 ? (
                    overdueTasks.map(task => (
                        <div key={task.id} className="task-card">
                            <input type="checkbox"
                                checked={task.status === 'done'}
                                className={`task-status${task.status}`}
                                onChange={() => toggleTaskStatus(task.date, task)}>
                            </input>
                            <div className="task-details">
                                <strong>{task.name}</strong>
                                {task.description && <p>{task.description}</p>}
                                <div className="task-control-buttons">
                                    <button onClick={() => deleteTask(task.date, task)}>🗑️</button>
                                    <button onClick={() => openEditingModal(task.date, task)}>✍️</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
}

export default OverdueTasksContext;