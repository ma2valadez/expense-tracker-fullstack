// User types
export interface User {
    _id: string;
    name: string;
    email: string;
    role?: 'user' | 'admin';
    isActive?: boolean;
    createdAt: string;
    updatedAt: string;
}

// Auth types
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
}

// Expense types
export interface Expense {
    _id: string;
    user: string;
    title: string;
    amount: number;
    category: ExpenseCategory;
    description?: string;
    date: string;
    isRecurring: boolean;
    recurringInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    tags: string[];
    attachments?: Array<{
        filename: string;
        url: string;
        uploadedAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

export type ExpenseCategory =
    | 'Food'
    | 'Transportation'
    | 'Housing'
    | 'Entertainment'
    | 'Healthcare'
    | 'Shopping'
    | 'Education'
    | 'Utilities'
    | 'Other';

export interface ExpenseFormData {
    title: string;
    amount: number;
    category: ExpenseCategory;
    description?: string;
    date: string;
    isRecurring: boolean;
    recurringInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    tags: string[];
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    token?: string;
    user?: User;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    pages: number;
    total: number;  // Remove the ? to make it required
}

export interface ExpenseListResponse {
    success: boolean;
    count: number;
    total: number;
    totalAmount: number;
    pagination: PaginationInfo;
    data: Expense[];
}

// Statistics types
export interface CategoryStats {
    category: string;
    totalAmount: number;
    count: number;
    avgAmount: number;
}

export interface MonthlyStats {
    year: number;
    month: number;
    totalAmount: number;
    count: number;
}

export interface ExpenseStats {
    categoryStats: CategoryStats[];
    monthlyStats: MonthlyStats[];
    dateRange: {
        start: string;
        end: string;
    };
}