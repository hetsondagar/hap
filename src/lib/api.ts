// API client for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData: {
    username: string;
    email: string;
    password: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // User endpoints
  async getUserProfile(userId: string) {
    return this.request(`/users/${userId}`);
  }

  async updateUserProfile(userId: string, data: any) {
    return this.request(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getUserStats(userId: string) {
    return this.request(`/users/${userId}/stats`);
  }

  async getUserNotifications(userId: string) {
    return this.request(`/users/${userId}/notifications`);
  }

  // Event endpoints
  async getEvents(params?: {
    category?: string;
    lat?: number;
    lng?: number;
    radius?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.lat) searchParams.append('lat', params.lat.toString());
    if (params?.lng) searchParams.append('lng', params.lng.toString());
    if (params?.radius) searchParams.append('radius', params.radius.toString());
    
    const queryString = searchParams.toString();
    return this.request(`/events${queryString ? `?${queryString}` : ''}`);
  }

  async getEventById(eventId: string) {
    return this.request(`/events/${eventId}`);
  }

  async createEvent(eventData: any) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(eventId: string, eventData: any) {
    return this.request(`/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(eventId: string) {
    return this.request(`/events/${eventId}`, {
      method: 'DELETE',
    });
  }

  async joinEvent(eventId: string) {
    return this.request(`/events/${eventId}/join`, {
      method: 'POST',
    });
  }

  async checkinEvent(eventId: string) {
    return this.request(`/events/${eventId}/checkin`, {
      method: 'POST',
    });
  }

  // Map & Discovery endpoints
  async getNearbyEvents(lat: number, lng: number, radius = 10) {
    return this.request(`/map/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
  }

  async getTrendingEvents() {
    return this.request('/map/trending');
  }

  // Group endpoints
  async createGroup(groupData: any) {
    return this.request('/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  }

  async joinGroup(groupId: string) {
    return this.request(`/groups/${groupId}/join`, {
      method: 'POST',
    });
  }

  async getGroup(groupId: string) {
    return this.request(`/groups/${groupId}`);
  }

  async updateGroup(groupId: string, groupData: any) {
    return this.request(`/groups/${groupId}`, {
      method: 'PATCH',
      body: JSON.stringify(groupData),
    });
  }

  // Leaderboard endpoints
  async getLeaderboard() {
    return this.request('/leaderboard');
  }

  async getUserAchievements(userId: string) {
    return this.request(`/leaderboard/users/${userId}/achievements`);
  }

  // Rewards endpoints
  async getRewards() {
    return this.request('/rewards');
  }

  async redeemReward(rewardId: string) {
    return this.request(`/rewards/${rewardId}/redeem`, {
      method: 'POST',
    });
  }

  // Wallet endpoints
  async getWallet(userId: string) {
    return this.request(`/wallet/${userId}`);
  }

  async addPoints(userId: string, points: number) {
    return this.request(`/wallet/${userId}/add`, {
      method: 'POST',
      body: JSON.stringify({ points }),
    });
  }

  // Notification endpoints
  async getNotifications(userId: string) {
    return this.request(`/notifications/${userId}`);
  }

  async markNotificationRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  // Chat endpoints
  async getChatMessages(eventId: string) {
    return this.request(`/chat/${eventId}`);
  }

  async sendChatMessage(eventId: string, message: string) {
    return this.request(`/chat/${eventId}`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
