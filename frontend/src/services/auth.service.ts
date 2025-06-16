// frontend/src/services/auth.service.ts
import api from './api';
import { User, LoginCredentials, RegisterCredentials, ApiResponse } from '../types';

interface AuthResponse {
    user: User;
    token: string;
}

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        console.log('AuthService: Logging in with:', credentials.email);

        const response = await api.post<ApiResponse<AuthResponse>>(
            '/auth/login',
            credentials
        );

        console.log('AuthService: Login response:', response.data);

        // The backend directly returns { success, token, user }
        if (response.data.success && response.data.token && response.data.user) {
            const { token, user } = response.data as any;
            this.setSession(token, user);
            return { user, token };
        }

        throw new Error('Login failed');
    }

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        console.log('AuthService: Registering user:', credentials.email);

        const response = await api.post<ApiResponse<AuthResponse>>(
            '/auth/register',
            credentials
        );

        console.log('AuthService: Register response:', response.data);

        // The backend directly returns { success, token, user }
        if (response.data.success && response.data.token && response.data.user) {
            const { token, user } = response.data as any;
            this.setSession(token, user);
            return { user, token };
        }

        throw new Error('Registration failed');
    }

    async getCurrentUser(): Promise<User> {
        const response = await api.get<ApiResponse<User>>('/auth/me');

        if (response.data.success && response.data.data) {
            return response.data.data;
        }

        throw new Error('Failed to get user');
    }

    async updateProfile(data: Partial<User>): Promise<User> {
        const response = await api.put<ApiResponse<User>>('/auth/updatedetails', data);

        if (response.data.success && response.data.data) {
            // Update stored user data
            const currentUser = this.getStoredUser();
            if (currentUser) {
                const updatedUser = { ...currentUser, ...response.data.data };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            return response.data.data;
        }

        throw new Error('Failed to update profile');
    }

    async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
        const response = await api.put('/auth/updatepassword', {
            currentPassword,
            newPassword,
        });

        if (response.data.success && response.data.token) {
            // Update the token if a new one is provided
            localStorage.setItem('token', response.data.token);
        }
    }

    logout(): void {
        console.log('AuthService: Logging out');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }

    private setSession(token: string, user: User): void {
        console.log('AuthService: Setting session for user:', user.email);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    }

    getStoredToken(): string | null {
        return localStorage.getItem('token');
    }

    getStoredUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error parsing stored user:', error);
            return null;
        }
    }
}

export default new AuthService();