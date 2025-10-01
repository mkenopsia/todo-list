import {createContext, useContext, useEffect, useState} from "react";
import {useTasks} from "./TasksProvider.jsx";

const AuthContext = createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error();
    return context;
}

const BACKEND_GET_USER_URL = 'http://localhost:8080/api/user';
const BACKEND_LOGIN_URL = 'http://localhost:8080/api/auth/sign-in';
const BACKEND_REGISTER_URL = 'http://localhost:8080/api/auth/sign-up';
const BACKEND_LOGOUT_URL = 'http://localhost:8080/api/auth/sign-out';

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        try {
            const response = await fetch(BACKEND_GET_USER_URL, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const userData = await response.json();
                console.log(userData.username)
                setCurrentUser(userData);
                setIsAuthenticated(true)
            } else {
                setCurrentUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.log(error);
            setCurrentUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }

    const login = async (identifier, password) => {
        setIsLoading(true);
        try {
            const response = await fetch(BACKEND_LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    identifier: identifier,
                    password: password
                }),
                credentials: 'include'
            });

            if (response.ok) {
                const userData = await response.json();
                setCurrentUser(userData);
                setIsAuthenticated(true);
            } else {
                setCurrentUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.log(error);
            setCurrentUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }

    const register = async (username, email, password) => {
        setIsLoading(true);
        try {
            const response = fetch(BACKEND_REGISTER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                }),
                credentials: 'include'
            });

            if (response.ok) {
                const userData = await response.json();
                setCurrentUser(userData);
                setIsAuthenticated(true);
                console.log('успешно брат')
            } else {
                setCurrentUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.log(error);
            setCurrentUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }

    const logout = async () => {
        fetch(BACKEND_LOGOUT_URL, {
            method: 'POST',
            credentials: 'include'
        });

        setCurrentUser(null);
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{
            currentUser,
            isAuthenticated,
            fetchUserData,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}