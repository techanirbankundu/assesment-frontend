const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  industryType: 'tour' | 'travel' | 'logistics' | 'other';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  industryType?: 'tour' | 'travel' | 'logistics' | 'other';
}

export interface DashboardData {
  dashboard: {
    metrics?: Record<string, string | number>;
    recentBookings?: Array<{ title?: string; date?: string; status?: string }>;
    upcomingTours?: Array<{ title?: string; date?: string; status?: string }>;
    upcomingTravels?: Array<{ title?: string; date?: string; status?: string }>;
    activeShipments?: Array<{ title?: string; date?: string; status?: string }>;
  };
  navigation: unknown[];
  dashboardRoute: string;
  industryType: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  provider: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include', // Important for cookies
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterData): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request('/auth/me', {
      method: 'GET',
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Dashboard endpoints
  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    return this.request('/dashboard', {
      method: 'GET',
    });
  }

  async getIndustryDashboard(industryType: string): Promise<ApiResponse<DashboardData>> {
    return this.request(`/dashboard/${industryType}`, {
      method: 'GET',
    });
  }

  async getIndustryProfile(): Promise<ApiResponse<{ industryProfile: unknown; industryType: string }>> {
    return this.request('/dashboard/profile', {
      method: 'GET',
    });
  }

  async updateIndustryProfile(profileData: unknown): Promise<ApiResponse<{ profile: unknown }>> {
    return this.request('/dashboard/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getNavigation(): Promise<ApiResponse<{ navigation: unknown[]; industryType: string }>> {
    return this.request('/dashboard/navigation', {
      method: 'GET',
    });
  }

  // Payments
  async getPaymentOptions(): Promise<ApiResponse<{ methods: PaymentMethod[] }>> {
    return this.request('/dashboard/payments/options', { method: 'GET' });
  }

  async createPaymentIntent(payload: { amount: number; currency?: string; methodId: string }): Promise<ApiResponse<unknown>> {
    return this.request('/dashboard/payments/intent', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
