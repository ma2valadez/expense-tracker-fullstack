export const EXPENSE_CATEGORIES = [
    'Food',
    'Transportation',
    'Housing',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Education',
    'Utilities',
    'Other'
] as const;

export const RECURRING_INTERVALS = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
    Food: '#FF6384',
    Transportation: '#36A2EB',
    Housing: '#FFCE56',
    Entertainment: '#4BC0C0',
    Healthcare: '#9966FF',
    Shopping: '#FF9F40',
    Education: '#FF6384',
    Utilities: '#C9CBCF',
    Other: '#969696',
};

export const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];