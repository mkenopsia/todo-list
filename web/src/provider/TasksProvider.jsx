import { createContext, useContext, useMemo, useState } from 'react';
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
    if (!context) throw new Error('TasksContext');
    return context;
}

const STORAGE_KEY = 'user-tasks';

export function TasksProvider({ children }) {
    const { isModalOpen, modalDate, formData, setFormData, closeModal } = useModal();

    function exportTasksAsJson() {
        const currentTasks = localStorage.getItem(STORAGE_KEY);
        var allTasks = [];

        for (const value of tasks.values()) {
            allTasks.push(...value);
        }

        if (!currentTasks || allTasks.length === 0) {
            alert('Нечего сохранять - заданий нет :D');
            return;
        }

        const jsonizedTasks = JSON.parse(currentTasks);

        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(jsonizedTasks, null, 2))}`;

        const download = document.createElement('a');
        download.setAttribute("href", jsonString);
        download.setAttribute("download", `tasks-backup-${new Date().toDateString()}.json`);
        document.body.appendChild(download);
        download.click();
        document.body.removeChild(download);
    }

    function loadTasksFromJson(jsonFile) {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const parsedTasks = JSON.parse(event.target.result);
                const newMap = new Map();

                Object.entries(parsedTasks).forEach(([date, tasks]) => {
                    console.log(tasks)
                    const loadedTaskList = tasks.map(t => {
                        const loadedTask = new Task(
                            t.name,
                            t.description,
                            t.date,
                            t.status
                        );
                        loadedTask.id = t.id;
                        return loadedTask;
                    });

                    newMap.set(date, loadedTaskList);
                });

                setDailyTasks(newMap);

                alert('Задачи загружены)');
                window.location.reload();
            } catch (err) {
                alert('Не удается загрузить задачи из файла(');
            }
        }

        reader.readAsText(jsonFile);
    }

    function saveTasksToLocalStorage(tasksMap) {
        const plainObject = {};
        tasksMap.forEach((tasks, date) => {
            plainObject[date] = tasks.map(task => ({
                id: task.id,
                name: task.name,
                description: task.description,
                date: task.date,
                status: task.status
            }));
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(plainObject));
    }

    function loadTasksFromLocalStorage() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return null;

        try {
            const plainObject = JSON.parse(saved);
            const map = new Map();

            Object.entries(plainObject).forEach(([date, tasks]) => {
                const taskList = tasks.map(task => {
                    const t = new Task(
                        task.name,
                        task.description,
                        task.date,
                        task.status
                    );
                    t.id = task.id;
                    return t;
                });
                map.set(date, taskList);
            });

            return map;
        } catch (e) {
            console.error('Чет не парсятся задачи(');
            return null;
        }
    }

    const [offsetWeeks, setOffsetWeeks] = useState(0);

    const weekDates = useMemo(() => getCurrentWeekDates(offsetWeeks), [offsetWeeks]);

    function incrementOffsetWeeks() {
        setOffsetWeeks(offsetWeeks + 1);
        // console.log(offsetWeeks)
    }

    function decrementOffsetWeeks() {
        if (offsetWeeks === 0) {
            return;
        }
        setOffsetWeeks(offsetWeeks - 1);
    }

    function getCurrentWeekDates(offsetWeeks) {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        const monday = new Date(today);
        monday.setDate(today.getDate() - mondayOffset + offsetWeeks * 7 + 1);
        monday.setHours(0, 0, 0, 0);

        const week = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            if(day >= today) {
                week.push(day.toISOString().split('T')[0]);
            }
        }

        return week;
    }

    const [tasks, setDailyTasks] = useState(() => {
        const savedTasks = loadTasksFromLocalStorage();

        if (savedTasks) {
            const expandedTasks = new Map(savedTasks);
            weekDates.forEach(date => {
                if (!expandedTasks.has(date)) {
                    expandedTasks.set(date, []);
                }
            });
            return expandedTasks;
        }

        const newTasks = new Map();
        weekDates.forEach(date => {
            newTasks.set(date, []);
        });
        return newTasks;
    });

    useMemo(() => {
        saveTasksToLocalStorage(tasks);
    }, [tasks]);

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
        <TasksContext.Provider value={{
            tasks,
            updateTask,
            addTask,
            deleteTask,
            toggleTaskStatus,
            getCurrentWeekDates,
            editTask,
            weekDates,
            exportTasksAsJson,
            loadTasksFromJson,
            incrementOffsetWeeks,
            decrementOffsetWeeks
        }}>
            {children}
        </TasksContext.Provider>
    );
}