// src/App.jsx
import React from 'react';
import UserHeader from './component/UserHeader/UserHeader';
import TodoList from './component/TodoList/TodoList';
import './App.css';
import { TasksProvider } from './provider/TasksProvider';
import { ModalProvider } from './provider/ModalProvider';

function App() {
  return (
    <ModalProvider>
      <TasksProvider>
        <div className="app-layout">
          <UserHeader />
          <main>
            <TodoList />
          </main>
        </div>
      </TasksProvider>
    </ModalProvider>
  );
}

export default App;