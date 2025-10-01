// TasksContext.jsx
import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {useModal} from './ModalProvider';
import {useAuth} from "./AuthProvider.jsx";

class Task {
    constructor(name, description, date, isDone) {
        this.id = Date.now() + Math.random(),
            this.name = name,
            this.description = description,
            this.date = date,
            this.isDone = isDone
    }
}

const TasksContext = createContext();

const BACKEND_POST_TASK_URL = 'http://localhost:8080/api/task';
const BACKEND_UPLOAD_LIST_TASK_URL = 'http://localhost:8080/api/tasks';
const BACKEND_DELETE_TASK_URL = 'http://localhost:8080/api/task/';
const BACKEND_UPDATE_TASK_URL = 'http://localhost:8080/api/task/';
const BACKEND_TOGGLE_TASK_STATUS_URL = 'http://localhost:8080/api/task/toggleStatus/';
const BACKEND_GET_TASKS_URL = 'http://localhost:8080/api/tasks';

export function useTasks() {
    const context = useContext(TasksContext);
    if (!context) throw new Error('');
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

        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", jsonString);
        downloadAnchorNode.setAttribute("download", `tasks-backup-${new Date().toDateString()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        document.body.removeChild(downloadAnchorNode);
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
                alert('Не удается загрузить задачи из файла');
            }
        }

        reader.readAsText(jsonFile);
    }

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            loadTasks();
        } else {
            setDailyTasks(new Map());
        }
    }, [isAuthenticated]);

    async function loadTasks() {
        try {
            const response = await fetch(BACKEND_GET_TASKS_URL, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const loadedTasks = await response.json();
                const newMap = new Map(Object.entries(loadedTasks));
                console.log(newMap)
                setDailyTasks(newMap);
            }
        } catch (error) {
            console.log(error);
        }
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
            console.error('Failed to parse saved tasks', e);
            return null;
        }
    }

    const [offsetWeeks, setOffsetWeeks] = useState(0);

    const weekDates = useMemo(() => getCurrentWeekDates(offsetWeeks), [offsetWeeks]);

    function incrementOffsetWeeks() {
        setOffsetWeeks(offsetWeeks + 1);
        console.log(offsetWeeks)
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

        if (savedTasks) { // добавляем контейнеры для дней текущей недели
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

    async function editTask(taskId) {
        if (!formData.name.trim()) return;

        const newTask = new Task(
            formData.name.trim(),
            formData.description.trim(),
            modalDate,
            formData.status === 'done'
        );

        try {
            const response = await fetch(BACKEND_UPDATE_TASK_URL + taskId, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask),
                credentials: 'include'
            });

            if (response.ok) {
                const taskResponse = await response.json();

                setDailyTasks(prev => {
                    const tasks = prev.get(modalDate) || [];
                    const newTasks = [...tasks];
                    const oldTaskIndex = newTasks.findIndex(task => (task.id === taskId));
                    newTasks[oldTaskIndex] = taskResponse;
                    const newMap = new Map(prev);
                    newMap.set(modalDate, newTasks);
                    return newMap;
                });
            }
        } catch (error) {
            console.log(error);
        }

        closeModal();
    };

    async function addTask(e) {
        e.preventDefault();
        if (!formData.name.trim()) return;

        console.log(formData.isDone)

        const newTask = new Task(
            formData.name.trim(),
            formData.description.trim(),
            modalDate,
            formData.status === 'done'
        );

        try {
            const response = await fetch(BACKEND_POST_TASK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask),
                credentials: 'include'
            });

            if (response.ok) {
                const loadedTask = await response.json();

                setDailyTasks(prev => {
                    const tasks = prev.get(modalDate) || [];
                    const newTasks = [...tasks, loadedTask];
                    const newMap = new Map(prev);
                    newMap.set(modalDate, newTasks);
                    return newMap;
                });
            }
        } catch (error) {
            console.log(error);
        }

        closeModal();
    };

    async function deleteTask(date, taskForDeletion) {
        try {
            const response = await fetch(BACKEND_DELETE_TASK_URL + taskForDeletion.id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                setDailyTasks(prev => {
                    const tasks = prev.get(date) || [];
                    const newTasks = tasks.filter(task => task.id !== taskForDeletion.id);
                    const newMap = new Map(prev);
                    newMap.set(date, newTasks);
                    return newMap;
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function toggleTaskStatus(date, task) {
        try {
            const response = await fetch(BACKEND_TOGGLE_TASK_STATUS_URL + task.id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                const taskResponse = await response.json();

                setDailyTasks(prev => {
                    const newMap = new Map(prev);
                    const newTasks = [...newMap.get(date)];
                    const index = newTasks.findIndex(t => t.id === task.id);

                    newTasks[index] = {
                        ...newTasks[index],
                        status: task.isDone = !task.isDone
                    }

                    newMap.set(date, newTasks);

                    return newMap;
                });
            }
        } catch (error) {
            console.log(error);
        }
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
            decrementOffsetWeeks,
            loadTasks
        }}>
            {children}
        </TasksContext.Provider>
    );
}