import { useState, useEffect, useCallback } from 'react';
import expenseService from '../services/expense.service';
import { Expense, ExpenseFormData } from '../types';

interface UseExpensesOptions {
    autoFetch?: boolean;
    category?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    page?: number;
}

export function useExpenses(options: UseExpensesOptions = {}) {
    const { autoFetch = true, category, startDate, endDate, limit, page } = options;

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        pages: 1,
        total: 0,
    });

    const fetchExpenses = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = {
                category,
                startDate,
                endDate,
                limit,
                page
            };

            const response = await expenseService.getExpenses(params);
            setExpenses(response.data ?? []);
            setTotalAmount(response.totalAmount ?? 0);
            if (response.pagination) {
                setPagination({
                    page: response.pagination.page,
                    limit: response.pagination.limit,
                    pages: response.pagination.pages,
                    total: response.pagination.total ?? 0
                });
            }
        } catch (error) {
            setError(error as Error);
            setExpenses([]);
            setTotalAmount(0);
        } finally {
            setLoading(false);
        }
    }, [category, startDate, endDate, limit, page]);

    const createExpense = useCallback(async (data: ExpenseFormData) => {
        const newExpense = await expenseService.createExpense(data);
        setExpenses(prev => [newExpense, ...prev]);
        setTotalAmount(prev => prev + newExpense.amount);
        return newExpense;
    }, []);

    const updateExpense = useCallback(async (id: string, data: Partial<ExpenseFormData>) => {
        const updatedExpense = await expenseService.updateExpense(id, data);
        setExpenses(prev =>
            prev.map(exp => exp._id === id ? updatedExpense : exp)
        );
        // Recalculate total if amount changed
        const oldExpense = expenses.find(exp => exp._id === id);
        if (oldExpense && oldExpense.amount !== updatedExpense.amount) {
            setTotalAmount(prev => prev - oldExpense.amount + updatedExpense.amount);
        }
        return updatedExpense;
    }, [expenses]);

    const deleteExpense = useCallback(async (id: string) => {
        const expense = expenses.find(exp => exp._id === id);
        if (expense) {
            await expenseService.deleteExpense(id);
            setExpenses(prev => prev.filter(exp => exp._id !== id));
            setTotalAmount(prev => prev - expense.amount);
        }
    }, [expenses]);

    useEffect(() => {
        if (autoFetch) {
            fetchExpenses();
        }
    }, [autoFetch, fetchExpenses]);

    return {
        expenses,
        loading,
        error,
        totalAmount,
        pagination,
        fetchExpenses,
        createExpense,
        updateExpense,
        deleteExpense,
    };
}