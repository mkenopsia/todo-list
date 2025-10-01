import React, {useEffect} from 'react';
import UserHeader from './component/UserHeader/UserHeader';
import TodoList from './component/TodoList/TodoList';
import WeekScrollButton from './component/WeekScrollButton/WeekScrollButton';
import './App.css';
import {TasksProvider} from './provider/TasksProvider';
import {ModalProvider} from './provider/ModalProvider';
import {AuthProvider, useAuth} from "./provider/AuthProvider.jsx";
import AuthPage from "./component/AuthPage/AuthPage.jsx";
import LoadingSpinner from "./component/LoadingSpinner/LoadingSpinner.jsx";

function App() {
    return (
        <AuthProvider>
            <AppContent/>
        </AuthProvider>
    )
}

function AppContent() {
    const { isAuthenticated, isLoading, fetchUserData } = useAuth();

    useEffect(() => {
        fetchUserData();
    }, []);

    if (isLoading) return <LoadingSpinner />;
    if (!isAuthenticated) return <AuthPage />;

    return (
        <ModalProvider>
            <TasksProvider isAuthenticated={isAuthenticated}>
                <div className="app-layout">
                    <UserHeader />
                    <WeekScrollButton />
                    <main>
                        <TodoList />
                    </main>
                </div>
            </TasksProvider>
        </ModalProvider>
    );
}
export default App;