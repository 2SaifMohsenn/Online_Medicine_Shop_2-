// Simple user storage for maintaining logged-in user state
// This stores the current logged-in user/admin data

export interface StoredUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    shipping_address?: string;
    role: 'user' | 'admin';
}

// In-memory storage (will reset on app reload)
let currentUser: StoredUser | null = null;

/**
 * Save user data after successful login
 */
export function saveUser(user: StoredUser): void {
    currentUser = user;
}

/**
 * Get the current logged-in user
 */
export function getUser(): StoredUser | null {
    return currentUser;
}

/**
 * Clear user data on logout
 */
export function clearUser(): void {
    currentUser = null;
}

/**
 * Check if a user is logged in
 */
export function isLoggedIn(): boolean {
    return currentUser !== null;
}
