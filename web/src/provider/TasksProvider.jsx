// TasksContext.jsx
import { createContext, useContext, useState } from 'react';
import { useModal } from './ModalProvider';

class Task {
    constructor(name, description, date, status) {
        this.id = Date.now() + Math.random(),
            this.name = name,
            this.description = description,
            this.date = date,
            this.status = status
    }
}

const TasksContext = createContext();

export function useTasks() {
    const context = useContext(TasksContext);
    if (!context) throw new Error('useTasks must be used within TasksProvider');
    return context;
}

export function TasksProvider({ children }) {
    const weekDates = getCurrentWeekDates();

    const { isModalOpen, modalDate, formData, setFormData, closeModal } = useModal();

    function getCurrentWeekDates() {
        const today = new Date();
        const week = [];

        const dayOfWeek = today.getDay();
        const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const monday = new Date(today);
        monday.setDate(today.getDate() - mondayOffset);

        for (let i = today.getDay(); i <= 7; i++) {
            const day = new Date(today);
            day.setDate(monday.getDate() + i);
            week.push(day.toISOString().split('T')[0]);
        }

        return week;
    }

    const [tasks, setDailyTasks] = useState(() => {
        const map = new Map();
        weekDates.forEach(date => {
            map.set(date, []);
        })

        map.set('2025-07-01', [new Task(
            'fdf',
            '123',
            '2025-07-01',
            'active'
        )])

        return map;
    });

    function updateTask(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    function editTask(taskId) {
        if (!formData.name.trim()) return;

        const newTask = new Task(
            formData.name.trim(),
            formData.description.trim(),
            modalDate,
            formData.status
        );

        setDailyTasks(prev => {
            const tasks = prev.get(modalDate) || [];
            const newTasks = [...tasks];
            const oldTaskIndex = newTasks.findIndex(task => (task.id === taskId));
            newTasks[oldTaskIndex] = newTask;
            const newMap = new Map(prev);
            newMap.set(modalDate, newTasks);
            return newMap;
        });

        closeModal();
    };

    function addTask(e) {
        e.preventDefault();
        if (!formData.name.trim()) return;

        const newTask = new Task(
            formData.name.trim(),
            formData.description.trim(),
            modalDate,
            formData.status
        );

        setDailyTasks(prev => {
            const tasks = prev.get(modalDate) || [];
            const newTasks = [...tasks, newTask];
            const newMap = new Map(prev);
            newMap.set(modalDate, newTasks);
            return newMap;
        });

        closeModal();
    };

    function deleteTask(date, taskForDeletion) {
        setDailyTasks(prev => {
            const tasks = prev.get(date) || [];
            const newTasks = tasks.filter(task => task.id !== taskForDeletion.id);
            const newMap = new Map(prev);
            newMap.set(date, newTasks);
            return newMap;
        });
    }

    function toggleTaskStatus(date, task) {
        setDailyTasks(prev => {
            const newMap = new Map(prev);
            const newTasks = [...newMap.get(date)];
            const index = newTasks.findIndex(t => t.id === task.id);

            newTasks[index] = {
                ...newTasks[index],
                status: task.status === 'active' ? 'done' : 'active'
            }

            newMap.set(date, newTasks);

            return newMap;
        });
    }

    return (
        <TasksContext.Provider value={{ tasks, updateTask, addTask, deleteTask, toggleTaskStatus, getCurrentWeekDates, editTask, weekDates }}>
            {children}
        </TasksContext.Provider>
    );
}