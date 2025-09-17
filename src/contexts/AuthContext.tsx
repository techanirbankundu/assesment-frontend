'use client';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { apiService, User, LoginCredentials, RegisterData } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    industryType: string | null;
    loading: boolean;
    error: string | null;
    clearError: () => void;
    initialized: boolean;
    reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [industryType, setIndustryType] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [initialized, setInitialized] = useState<boolean>(false);

    // Hydrate session from cookie via /auth/me
    useEffect(() => {
        reloadUser().finally(() => setInitialized(true));
    }, []);

    const reloadUser = async () => {
        try {
            const resp = await apiService.getCurrentUser();
            if (resp.success && resp.data?.user) {
                setUser(resp.data.user);
                setIndustryType(resp.data.user.industryType);
            } else {
                setUser(null);
                setIndustryType(null);
            }
        } catch (err) {
            // 401 "Not authenticated" is expected for unauthenticated users, don't log it as error
            if (err instanceof Error && !err.message.includes('Not authenticated')) {
                console.error('Auth error:', err);
            }
            setUser(null);
            setIndustryType(null);
        }
    };

    const login = async (credentials: LoginCredentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.login(credentials);

            if (response.success && response.data) {
                const { user: backendUser, accessToken: token, refreshToken: refresh } = response.data;
                setUser(backendUser);
                setAccessToken(token || null);
                setRefreshToken(refresh || null);
                setIndustryType(backendUser.industryType);
                setInitialized(true);
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.register(data);

            if (response.success && response.data) {
                const { user: backendUser, accessToken: token, refreshToken: refresh } = response.data;
                setUser(backendUser);
                setAccessToken(token || null);
                setRefreshToken(refresh || null);
                setIndustryType(backendUser.industryType);
                setInitialized(true);
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await apiService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear state regardless of API call success
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            setIndustryType(null);
            setError(null);
            setInitialized(true);
        }
    };

    const clearError = () => {
        setError(null);
    };

    const authContextValue: AuthContextType = {
        user,
        accessToken,
        refreshToken,
        login,
        register,
        logout,
        industryType,
        loading,
        error,
        clearError,
        initialized,
        reloadUser,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}