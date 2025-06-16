import * as yup from 'yup';
import { EXPENSE_CATEGORIES } from './constants';

export const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email('Invalid email address')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

export const registerSchema = yup.object().shape({
    name: yup
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters')
        .required('Name is required'),
    email: yup
        .string()
        .email('Invalid email address')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
});

export const expenseSchema = yup.object().shape({
    title: yup
        .string()
        .max(100, 'Title cannot exceed 100 characters')
        .required('Title is required'),
    amount: yup
        .number()
        .positive('Amount must be positive')
        .required('Amount is required'),
    category: yup
        .string()
        .oneOf(EXPENSE_CATEGORIES as unknown as string[])
        .required('Category is required'),
    date: yup
        .string()
        .required('Date is required'),
    description: yup
        .string()
        .max(500, 'Description cannot exceed 500 characters'),
    isRecurring: yup.boolean().required(),
    recurringInterval: yup
        .string()
        .when('isRecurring', {
            is: true,
            then: (schema) => schema.required('Recurring interval is required'),
        }),
    tags: yup.array().of(yup.string().required()).required()
});

export const updatePasswordSchema = yup.object().shape({
    currentPassword: yup
        .string()
        .required('Current password is required'),
    newPassword: yup
        .string()
        .min(6, 'New password must be at least 6 characters')
        .required('New password is required'),
    confirmNewPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Passwords must match')
        .required('Please confirm your new password'),
});