import api from './api';
import {
    Expense,
    ExpenseFormData,
    ExpenseListResponse,
    ExpenseStats,
    ApiResponse
} from '../types';

interface GetExpensesParams {
    category?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    page?: number;
}

class ExpenseService {
    async getExpenses(params?: GetExpensesParams): Promise<ExpenseListResponse> {
        const response = await api.get<ExpenseListResponse>('/expenses', { params });
        return response.data;
    }

    async getExpense(id: string): Promise<Expense> {
        const response = await api.get<ApiResponse<Expense>>(`/expenses/${id}`);

        if (response.data.success && response.data.data) {
            return response.data.data;
        }

        throw new Error('Failed to get expense');
    }

    async createExpense(data: ExpenseFormData): Promise<Expense> {
        const response = await api.post<ApiResponse<Expense>>('/expenses', data);

        if (response.data.success && response.data.data) {
            return response.data.data;
        }

        throw new Error('Failed to create expense');
    }

    async updateExpense(id: string, data: Partial<ExpenseFormData>): Promise<Expense> {
        const response = await api.put<ApiResponse<Expense>>(`/expenses/${id}`, data);

        if (response.data.success && response.data.data) {
            return response.data.data;
        }

        throw new Error('Failed to update expense');
    }

    async deleteExpense(id: string): Promise<void> {
        await api.delete(`/expenses/${id}`);
    }

    async getExpenseStats(year?: number, month?: number): Promise<ExpenseStats> {
        const params: any = {};
        if (year) params.year = year;
        if (month) params.month = month;

        const response = await api.get<ApiResponse<ExpenseStats>>('/expenses/stats', { params });

        if (response.data.success && response.data.data) {
            return response.data.data;
        }

        throw new Error('Failed to get expense statistics');
    }

    async bulkCreateExpenses(expenses: ExpenseFormData[]): Promise<number> {
        const response = await api.post<ApiResponse<{ count: number }>>('/expenses/bulk', {
            expenses,
        });

        if (response.data.success && response.data.data) {
            return response.data.data.count;
        }

        throw new Error('Failed to bulk create expenses');
    }
}

export default new ExpenseService();