import React, { createContext, useMemo, useState, useContext } from "react";
import '../TodoList/TodoList.css'
import { useModal } from '../../provider/ModalProvider'
import { useTasks } from '../../provider/TasksProvider';

function CompletedTasks() {
    const { openEditingModal } = useModal();
    const { tasks, deleteTask, toggleTaskStatus } = useTasks();

    const completedTasks = useMemo(() => {
        var allTasks = [];

        for (const value of tasks.values()) {
            allTasks.push(...value);
        }

        console.log(allTasks);

        return allTasks.filter(task => { return (task.status === 'done') });
    }, [tasks]);

    if (completedTasks.length === 0) {
        return null;
    }

    return (
        <div key={Math.random()} className="day-container">
            <div className="date-label"><strong>Выполненные задачи</strong></div>

            <div className="tasks-list">
                {completedTasks.map(task => (
                    <div key={task.id} className="task-card">
                        <input type="checkbox"
                            checked={task.status === 'done'}
                            className={`task-status`}
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
                ))}
            </div>
        </div>
    );
}

export default CompletedTasks;