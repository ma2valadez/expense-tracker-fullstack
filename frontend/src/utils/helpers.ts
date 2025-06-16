import { format, parseISO, startOfMonth, endOfMonth, isValid } from 'date-fns';

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const formatDate = (date: string | Date): string => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? format(parsedDate, 'MMM dd, yyyy') : '';
};

export const formatDateForInput = (date: string | Date): string => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-dd') : '';
};

export const getCurrentMonthRange = () => {
    const now = new Date();
    return {
        start: startOfMonth(now),
        end: endOfMonth(now),
    };
};

export const calculatePercentage = (value: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
};

export const groupExpensesByCategory = (expenses: any[]) => {
    return expenses.reduce((acc, expense) => {
        const category = expense.category;
        if (!acc[category]) {
            acc[category] = {
                total: 0,
                count: 0,
                expenses: [],
            };
        }
        acc[category].total += expense.amount;
        acc[category].count += 1;
        acc[category].expenses.push(expense);
        return acc;
    }, {});
};

export const generateExpenseCSV = (expenses: any[]): string => {
    const headers = ['Date', 'Title', 'Category', 'Amount', 'Description'];
    const rows = expenses.map(expense => [
        formatDate(expense.date),
        expense.title,
        expense.category,
        expense.amount.toString(),
        expense.description || '',
    ]);

    const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return csv;
};

export const downloadFile = (content: string, filename: string, type = 'text/csv') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};