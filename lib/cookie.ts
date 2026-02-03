"use server";

import { cookies } from "next/headers";

interface UserData {
    id: string;
    name: string;
    email: string;
    phoneNo: string;
    country: string;
    username: string;
    role: string;
    [key: string]: any;
}

// Set authentication token
export const setAuthToken = async (token: string) => {
    const cookieStore = await cookies();
    cookieStore.set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
    });
};

// Get authentication token
export const getAuthToken = async () => {
    const cookieStore = await cookies();
    return cookieStore.get('auth_token')?.value || null;
};

// Set user data
export const setUserData = async (userData: UserData) => {
    const cookieStore = await cookies();
    cookieStore.set({
        name: 'user_data',
        value: JSON.stringify(userData),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
    });
};

// Get user data
export const getUserData = async (): Promise<UserData | null> => {
    const cookieStore = await cookies();
    const userData = cookieStore.get('user_data')?.value || null;
    return userData ? JSON.parse(userData) : null;
};

// Clear all auth cookies
export const clearAuthCookies = async () => {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    cookieStore.delete('user_data');
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
    const token = await getAuthToken();
    return !!token;
};