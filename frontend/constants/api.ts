// API Configuration and Authentication Services
// Backend URL - Change this to your computer's IP address for mobile testing

// For web testing (localhost)
const API_BASE_URL = 'http://127.0.0.1:8000';

// For mobile testing (uncomment and use your computer's IP)
// const API_BASE_URL = 'http://192.168.x.x:8000';

export interface SignupData {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface UserData {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    shipping_address?: string;
}

export interface ApiResponse<T = any> {
    message?: string;
    error?: string;
    user?: T;
    role?: 'admin' | 'user';
}

/**
 * Register a new user
 */
export async function signup(data: SignupData): Promise<ApiResponse<UserData>> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/signup/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Signup failed');
        }

        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Network error. Please check your connection.');
    }
}

/**
 * Login with email and password
 */
export async function login(data: LoginData): Promise<ApiResponse<UserData>> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Login failed');
        }

        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Network error. Please check your connection.');
    }
}

export interface UpdateUserProfileData {
    user_id: number;
    first_name: string;
    last_name: string;
    shipping_address: string;
}

export interface UpdateAdminProfileData {
    admin_id: number;
    first_name: string;
    last_name: string;
}

export interface ChangePasswordData {
    user_id: number;
    role: 'user' | 'admin';
    current_password: string;
    new_password: string;
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: UpdateUserProfileData): Promise<ApiResponse<UserData>> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/update-user-profile/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Update failed');
        }

        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Network error. Please check your connection.');
    }
}

/**
 * Update admin profile
 */
export async function updateAdminProfile(data: UpdateAdminProfileData): Promise<ApiResponse<UserData>> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/update-admin-profile/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Update failed');
        }

        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Network error. Please check your connection.');
    }
}

/**
 * Change password for user or admin
 */
export async function changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/change-password/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Password change failed');
        }

        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Network error. Please check your connection.');
    }
}

export interface DashboardStats {
    total_users: number;
    total_orders: number;
    total_revenue: number;
    low_stock_count: number;
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard-stats/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch stats');
        }

        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Network error. Please check your connection.');
    }
}
