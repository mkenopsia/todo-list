import React, { useState } from "react";
import './TodoList.css'

class Task {
  constructor(name, description, date, status) {
    this.id = Date.now() + Math.random(),
      this.name = name,
      this.description = description,
      this.date = date,
      this.status = status
  }
}

function TodoList() {
  //   var tasks = [tasks, setTasks] = useState([]);
  //   const [newTask, setNewTasks] = useState("");

  const weekDays = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье",
  ];

  const weekDates = getCurrentWeekDates();

  const [dailyTasks, setDailyTasks] = useState(() => {
    const map = new Map();
    weekDates.forEach(date => {
      map.set(date, []);
    })

    return map;
  });

  function getCurrentWeekDates() {
    const today = new Date();
    const week = [];

    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - mondayOffset);

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(day.toLocaleDateString('ru-RU', {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
      })
      );
    }

    return week;
  }

  // console.log(getCurrentWeekDates());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active'
  });

  function openModal(date) {
    setModalDate(date);
    setFormData({ name: '', description: '', status: 'active' });
    setIsModalOpen(true);
  };

  function closeModal() {
    setIsModalOpen(false);
    setModalDate('');
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  function handleSubmit(e) {
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

  // надо чтобы брал из мапы текущую неделю и отрисовывал её
  return (
    <div className="weekdays-container">
      {weekDates.map((date) => (
        <div key={date} className="day-container">
          <div className="date-label"><strong>{date}</strong></div>

          <div className="tasks-list">
            {dailyTasks.get(date)?.length > 0 ? (
              dailyTasks.get(date).map(task => (
                <div key={task.id} className="task-card">
                  <input type="checkbox"
                    checked={task.status === 'done'}
                    className={`task-status${task.status}`}
                    onChange={() => toggleTaskStatus(date, task)}>
                  </input>
                  <div className="task-details">
                    <strong>{task.name}</strong>
                    {task.description && <p>{task.description}</p>}
                    {/* <div className="control-buttons"></div> */}
                    <button onClick={() => deleteTask(date, task)}>🗑️</button>
                  </div>
                  {/* <div>
                    <button onClick={() => deleteTask(date, task)}>🗑️</button>
                  </div> */}
                </div>
              ))
            ) : (
              <div className="empty">Нет задач</div>
            )}
          </div>

          <button onClick={() => openModal(date)} className="add-task-btn">
            + Добавить
          </button>
        </div>
      ))}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Новая задача — {modalDate}</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Название *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Введите название"
                />
              </div>

              <div>
                <label>Описание</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Описание задачи"
                  rows="3"
                />
              </div>

              <div>
                <label>Статус</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="active">Активна</option>
                  <option value="done">Выполнена</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-cancel">
                  Отмена
                </button>
                <button type="submit" className="btn-submit">
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoList;
