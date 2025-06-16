import React, { createContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/auth.service';
import { User, LoginCredentials, RegisterCredentials, AuthState } from '../types';

interface AuthContextValue extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: true,
    });

    useEffect(() => {
        const initAuth = async () => {
            const token = authService.getStoredToken();
            const user = authService.getStoredUser();

            if (token && user) {
                try {
                    const currentUser = await authService.getCurrentUser();
                    setState({
                        user: currentUser,
                        token,
                        isAuthenticated: true,
                        loading: false,
                    });
                } catch (error) {
                    authService.logout();
                    setState({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        loading: false,
                    });
                }
            } else {
                setState(prev => ({ ...prev, loading: false }));
            }
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const { user, token } = await authService.login(credentials);
        setState({
            user,
            token,
            isAuthenticated: true,
            loading: false,
        });
    };

    const register = async (credentials: RegisterCredentials) => {
        const { user, token } = await authService.register(credentials);
        setState({
            user,
            token,
            isAuthenticated: true,
            loading: false,
        });
    };

    const logout = () => {
        authService.logout();
        setState({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
        });
    };

    const updateUser = (user: User) => {
        setState(prev => ({ ...prev, user }));
        localStorage.setItem('user', JSON.stringify(user));
    };

    const value: AuthContextValue = {
        ...state,
        login,
        register,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};