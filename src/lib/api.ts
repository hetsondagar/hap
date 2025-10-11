// API configuration for HAP FlashCard App
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },
  
  // Flashcards
  FLASHCARDS: {
    BASE: `${API_BASE_URL}/flashcards`,
    BY_DEPARTMENT: (dept: string) => `${API_BASE_URL}/flashcards/department/${dept}`,
    USER: `${API_BASE_URL}/flashcards/user`,
    SEARCH: `${API_BASE_URL}/flashcards/search`,
    BY_ID: (id: string) => `${API_BASE_URL}/flashcards/${id}`,
  },
  
  // Quizzes
  QUIZZES: {
    GENERATE: `${API_BASE_URL}/quizzes/generate`,
    SUBMIT: `${API_BASE_URL}/quizzes/submit`,
    RESULTS: (userId: string) => `${API_BASE_URL}/quizzes/results/${userId}`,
    BY_ID: (id: string) => `${API_BASE_URL}/quizzes/${id}`,
  },
  
  // Community
  COMMUNITY: {
    DECKS: `${API_BASE_URL}/community/decks`,
    DECK_BY_ID: (id: string) => `${API_BASE_URL}/community/decks/${id}`,
    LIKE_DECK: (id: string) => `${API_BASE_URL}/community/decks/${id}/like`,
    COMMENT_DECK: (id: string) => `${API_BASE_URL}/community/decks/${id}/comment`,
    FOLLOW_USER: (id: string) => `${API_BASE_URL}/community/follow/${id}`,
    USER_DECKS: (userId: string) => `${API_BASE_URL}/community/users/${userId}/decks`,
    POSTS: `${API_BASE_URL}/community/posts`,
    POST_BY_ID: (id: string) => `${API_BASE_URL}/community/posts/${id}`,
    LIKE_POST: (id: string) => `${API_BASE_URL}/community/posts/${id}/like`,
    COMMENT_POST: (id: string) => `${API_BASE_URL}/community/posts/${id}/comment`,
  },
  
  // Analytics
  ANALYTICS: {
    USER: (userId: string) => `${API_BASE_URL}/analytics/${userId}`,
    LEADERBOARD: `${API_BASE_URL}/analytics/leaderboard`,
    DEPARTMENT: (dept: string) => `${API_BASE_URL}/analytics/departments/${dept}`,
    WEEKLY_GOAL: (userId: string) => `${API_BASE_URL}/analytics/${userId}/weekly-goal`,
    PROGRESS: (userId: string) => `${API_BASE_URL}/analytics/${userId}/progress`,
  },
  
  // Dashboard
  DASHBOARD: {
    BASE: `${API_BASE_URL}/dashboard`,
    CHANGE_PASSWORD: `${API_BASE_URL}/dashboard/change-password`,
    CHANGE_USERNAME: `${API_BASE_URL}/dashboard/change-username`,
    LIKE_FLASHCARD: (id: string) => `${API_BASE_URL}/dashboard/like/flashcard/${id}`,
    LIKE_DECK: (id: string) => `${API_BASE_URL}/dashboard/like/deck/${id}`,
    LIKED_FLASHCARDS: `${API_BASE_URL}/dashboard/liked/flashcards`,
    LIKED_DECKS: `${API_BASE_URL}/dashboard/liked/decks`,
  },
};

// API utility functions
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response;
};

// Authentication API
export const authAPI = {
  signup: async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    const response = await apiRequest(API_ENDPOINTS.AUTH.SIGNUP, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.json();
  },
  
  login: async (credentials: {
    email: string;
    password: string;
  }) => {
    const response = await apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.json();
  },
  
  getProfile: async () => {
    const response = await apiRequest(API_ENDPOINTS.AUTH.PROFILE);
    return response.json();
  },
  
  updateProfile: async (data: { bio?: string }) => {
    const response = await apiRequest(API_ENDPOINTS.AUTH.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Flashcard API
export const flashcardAPI = {
  create: async (flashcard: {
    front: string;
    back: string;
    department: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
  }) => {
    const response = await apiRequest(API_ENDPOINTS.FLASHCARDS.BASE, {
      method: 'POST',
      body: JSON.stringify(flashcard),
    });
    return response.json();
  },
  
  getByDepartment: async (department: string, params?: {
    page?: number;
    limit?: number;
    difficulty?: string;
    tags?: string[];
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }
    
    const url = `${API_ENDPOINTS.FLASHCARDS.BY_DEPARTMENT(department)}?${searchParams}`;
    const response = await apiRequest(url);
    return response.json();
  },
  
  getUserFlashcards: async (params?: {
    page?: number;
    limit?: number;
    department?: string;
    difficulty?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.FLASHCARDS.USER}?${searchParams}`;
    const response = await apiRequest(url);
    return response.json();
  },
  
  search: async (params: {
    q?: string;
    department?: string;
    year?: string;
    subjectId?: string;
    difficulty?: string;
    tags?: string[];
    public?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    
    const url = `${API_ENDPOINTS.FLASHCARDS.SEARCH}?${searchParams}`;
    const response = await apiRequest(url);
    return response.json();
  },
  
  getById: async (id: string) => {
    const response = await apiRequest(API_ENDPOINTS.FLASHCARDS.BY_ID(id));
    return response.json();
  },
  
  update: async (id: string, data: {
    front?: string;
    back?: string;
    department?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
  }) => {
    const response = await apiRequest(API_ENDPOINTS.FLASHCARDS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  delete: async (id: string) => {
    const response = await apiRequest(API_ENDPOINTS.FLASHCARDS.BY_ID(id), {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Quiz API
export const quizAPI = {
  generate: async (params?: {
    department?: string;
    difficulty?: string;
    limit?: number;
    deckId?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.QUIZZES.GENERATE}?${searchParams}`;
    const response = await apiRequest(url);
    return response.json();
  },
  
  submit: async (quizData: {
    questions: any[];
    timeSpent: number;
    deckId?: string;
  }) => {
    const response = await apiRequest(API_ENDPOINTS.QUIZZES.SUBMIT, {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
    return response.json();
  },
  
  getResults: async (userId: string, params?: {
    page?: number;
    limit?: number;
    department?: string;
    difficulty?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.QUIZZES.RESULTS(userId)}?${searchParams}`;
    const response = await apiRequest(url);
    return response.json();
  },
  
  getById: async (id: string) => {
    const response = await apiRequest(API_ENDPOINTS.QUIZZES.BY_ID(id));
    return response.json();
  },
};

// Community API
export const communityAPI = {
  getDecks: async (params?: {
    page?: number;
    limit?: number;
    department?: string;
    difficulty?: string;
    tags?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }
    
    const url = `${API_ENDPOINTS.COMMUNITY.DECKS}?${searchParams}`;
    const response = await apiRequest(url);
    return response.json();
  },
  
  createDeck: async (deckData: {
    title: string;
    description: string;
    flashcards: string[];
    department: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    tags?: string[];
  }) => {
    const response = await apiRequest(API_ENDPOINTS.COMMUNITY.DECKS, {
      method: 'POST',
      body: JSON.stringify(deckData),
    });
    return response.json();
  },
  
  getDeck: async (id: string) => {
    const response = await apiRequest(API_ENDPOINTS.COMMUNITY.DECK_BY_ID(id));
    return response.json();
  },
  
  likeDeck: async (id: string) => {
    const response = await apiRequest(API_ENDPOINTS.COMMUNITY.LIKE_DECK(id), {
      method: 'PUT',
    });
    return response.json();
  },
  
  commentDeck: async (id: string, comment: { text: string }) => {
    const response = await apiRequest(API_ENDPOINTS.COMMUNITY.COMMENT_DECK(id), {
      method: 'POST',
      body: JSON.stringify(comment),
    });
    return response.json();
  },
  
  followUser: async (id: string) => {
    const response = await apiRequest(API_ENDPOINTS.COMMUNITY.FOLLOW_USER(id), {
      method: 'POST',
    });
    return response.json();
  },
  
  getUserDecks: async (userId: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.COMMUNITY.USER_DECKS(userId)}?${searchParams}`;
    const response = await apiRequest(url);
    return response.json();
  },
  
  searchDecks: async (params: {
    q?: string;
    department?: string;
    difficulty?: string;
    tags?: string[];
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    
    const url = `${API_ENDPOINTS.COMMUNITY.DECKS}/search?${searchParams}`;
    const response = await apiRequest(url);
    return response.json();
  },

  // ========== POST/DISCUSSION FUNCTIONS ==========
  getPosts: async (params?: {
    page?: number;
    limit?: number;
    department?: string;
    year?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_ENDPOINTS.COMMUNITY.POSTS}?${searchParams}`;
    const response = await apiRequest(url);
    return response.json();
  },

  createPost: async (postData: {
    title: string;
    content: string;
    department?: string;
    year?: string;
    tags?: string[];
  }) => {
    const response = await apiRequest(API_ENDPOINTS.COMMUNITY.POSTS, {
      method: 'POST',
      body: JSON.stringify(postData),
    });
    return response.json();
  },

  getPost: async (id: string) => {
    const response = await apiRequest(API_ENDPOINTS.COMMUNITY.POST_BY_ID(id));
    return response.json();
  },

  likePost: async (id: string) => {
    const response = await apiRequest(API_ENDPOINTS.COMMUNITY.LIKE_POST(id), {
      method: 'PUT',
    });
    return response.json();
  },

  commentPost: async (id: string, comment: { text: string }) => {
    const response = await apiRequest(API_ENDPOINTS.COMMUNITY.COMMENT_POST(id), {
      method: 'POST',
      body: JSON.stringify(comment),
    });
    return response.json();
  },

  deletePost: async (id: string) => {
    const response = await apiRequest(API_ENDPOINTS.COMMUNITY.POST_BY_ID(id), {
      method: 'DELETE',
    });
    return response.json();
  },

  searchPosts: async (params: {
    q?: string;
    department?: string;
    year?: string;
    tags?: string[];
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    
    const url = `${API_ENDPOINTS.COMMUNITY.POSTS}/search?${searchParams}`;
    const response = await apiRequest(url);
    return response.json();
  },
};

// Analytics API
export const analyticsAPI = {
  getUserAnalytics: async (userId: string) => {
    const response = await apiRequest(API_ENDPOINTS.ANALYTICS.USER(userId));
    return response.json();
  },
  
  getLeaderboard: async (type: 'studied' | 'accuracy' | 'streaks' = 'studied', limit = 50) => {
    const response = await apiRequest(`${API_ENDPOINTS.ANALYTICS.LEADERBOARD}?type=${type}&limit=${limit}`);
    return response.json();
  },
  
  getDepartmentStats: async (department: string) => {
    const response = await apiRequest(API_ENDPOINTS.ANALYTICS.DEPARTMENT(department));
    return response.json();
  },
  
  updateWeeklyGoal: async (userId: string, weeklyGoal: number) => {
    const response = await apiRequest(API_ENDPOINTS.ANALYTICS.WEEKLY_GOAL(userId), {
      method: 'PUT',
      body: JSON.stringify({ weeklyGoal }),
    });
    return response.json();
  },
  
  getProgressTracking: async (userId: string, period: 'week' | 'month' | 'year' = 'week') => {
    const response = await apiRequest(`${API_ENDPOINTS.ANALYTICS.PROGRESS(userId)}?period=${period}`);
    return response.json();
  },
};

// Dashboard API
export const dashboardAPI = {
  getDashboardData: async () => {
    const response = await apiRequest(API_ENDPOINTS.DASHBOARD.BASE);
    return response.json();
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiRequest(API_ENDPOINTS.DASHBOARD.CHANGE_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return response.json();
  },
  
  changeUsername: async (newUsername: string) => {
    const response = await apiRequest(API_ENDPOINTS.DASHBOARD.CHANGE_USERNAME, {
      method: 'POST',
      body: JSON.stringify({ newUsername }),
    });
    return response.json();
  },
  
  toggleLikeFlashcard: async (flashcardId: string) => {
    const response = await apiRequest(API_ENDPOINTS.DASHBOARD.LIKE_FLASHCARD(flashcardId), {
      method: 'POST',
    });
    return response.json();
  },
  
  toggleLikeDeck: async (deckId: string) => {
    const response = await apiRequest(API_ENDPOINTS.DASHBOARD.LIKE_DECK(deckId), {
      method: 'POST',
    });
    return response.json();
  },
  
  getLikedFlashcards: async () => {
    const response = await apiRequest(API_ENDPOINTS.DASHBOARD.LIKED_FLASHCARDS);
    return response.json();
  },
  
  getLikedDecks: async () => {
    const response = await apiRequest(API_ENDPOINTS.DASHBOARD.LIKED_DECKS);
    return response.json();
  },
};

export default API_BASE_URL;
