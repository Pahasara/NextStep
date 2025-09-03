// Use backend service name for container-to-container communication in Azure
// Use Vite environment variable if set, otherwise default to backend service name
const API_BASE_URL = "http://localhost:7010/api";

console.log("API_BASE_URL:", API_BASE_URL);
console.log(
  "Environment variable VITE_BACKEND_URL:",
  import.meta.env.VITE_BACKEND_URL
);

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    role: string;
    profileData?: any;
  };
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const responseText = await response.text();
    console.log("API Response:", {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      body: responseText,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = {
          message: responseText || `HTTP error! status: ${response.status}`,
        };
      }
      throw new Error(
        errorData.message ||
          errorData.title ||
          `HTTP error! status: ${response.status}`
      );
    }

    try {
      return JSON.parse(responseText);
    } catch {
      throw new Error("Invalid JSON response from server");
    }
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(credentials),
    });
    return this.handleResponse<LoginResponse>(response);
  }

  async register(
    userData: RegisterRequest
  ): Promise<ApiResponse<LoginResponse>> {
    const response = await fetch(`${API_BASE_URL}/Auth/register`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse<LoginResponse>(response);
  }

  // Courses
  async getCourses(
    level?: string,
    category?: string
  ): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (level) params.append("level", level);
    if (category) params.append("category", category);

    const response = await fetch(`${API_BASE_URL}/Courses?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getCourse(courseId: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Courses/${courseId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async enrollInCourse(courseId: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Courses/${courseId}/enroll`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async updateCourseProgress(
    courseId: number,
    progress: number
  ): Promise<ApiResponse<any>> {
    const response = await fetch(
      `${API_BASE_URL}/Courses/${courseId}/progress`,
      {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ progress }),
      }
    );
    return this.handleResponse<any>(response);
  }

  async completeCourse(courseId: number): Promise<ApiResponse<any>> {
    const response = await fetch(
      `${API_BASE_URL}/Courses/${courseId}/complete`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse<any>(response);
  }

  // Profile
  async getMyProfile(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Profiles/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async updateMyProfile(profileData: any): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Profiles/me`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return this.handleResponse<any>(response);
  }

  async getPublicProfile(userId: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Profiles/${userId}/public`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async getStudentProfiles(
    page = 1,
    pageSize = 20
  ): Promise<ApiResponse<any[]>> {
    const response = await fetch(
      `${API_BASE_URL}/Profiles/students?page=${page}&pageSize=${pageSize}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse<any[]>(response);
  }

  // Projects
  async getProjects(userId?: number): Promise<ApiResponse<any[]>> {
    const params = userId ? `?userId=${userId}` : "";
    const response = await fetch(`${API_BASE_URL}/Projects${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getAllProjects(): Promise<ApiResponse<any[]>> {
    const response = await fetch(`${API_BASE_URL}/Projects/all`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getMyProjects(): Promise<ApiResponse<any[]>> {
    const response = await fetch(`${API_BASE_URL}/Projects/my`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getProject(projectId: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Projects/${projectId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async createProject(projectData: any): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Projects`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    return this.handleResponse<any>(response);
  }

  async updateProject(
    projectId: number,
    projectData: any
  ): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Projects/${projectId}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    return this.handleResponse<any>(response);
  }

  async deleteProject(projectId: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Projects/${projectId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  // Leaderboard
  async getLeaderboard(page = 1, pageSize = 50): Promise<ApiResponse<any[]>> {
    const response = await fetch(
      `${API_BASE_URL}/Leaderboard?page=${page}&pageSize=${pageSize}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse<any[]>(response);
  }

  async getMyRank(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Leaderboard/my-rank`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async logActivity(activityData: {
    activityType: string;
    description?: string;
    points: number;
    metadata?: string;
  }): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Leaderboard/activity`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(activityData),
    });
    return this.handleResponse<any>(response);
  }

  async getMyActivities(page = 1, pageSize = 20): Promise<ApiResponse<any[]>> {
    const response = await fetch(
      `${API_BASE_URL}/Leaderboard/activities?page=${page}&pageSize=${pageSize}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse<any[]>(response);
  }

  async incrementProfileView(userId: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Leaderboard/profile-view/${userId}`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  // Subscription
  async subscribe(subscriptionData: {
    email: string;
    fullName?: string;
    serviceType?: string;
  }): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Subscription/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscriptionData),
    });
    return this.handleResponse<any>(response);
  }

  async unsubscribe(unsubscribeData: {
    email: string;
    serviceType?: string;
  }): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Subscription/unsubscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(unsubscribeData),
    });
    return this.handleResponse<any>(response);
  }

  // Generic HTTP methods for easier API calls
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  // Rating endpoints
  async createRating(data: any): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Ratings`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<any>(response);
  }

  async updateRating(ratingId: number, data: any): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Ratings/${ratingId}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<any>(response);
  }

  async deleteRating(ratingId: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Ratings/${ratingId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async getStudentRatings(studentId: number, page = 1, pageSize = 20): Promise<ApiResponse<any[]>> {
    const response = await fetch(
      `${API_BASE_URL}/Ratings/student/${studentId}?page=${page}&pageSize=${pageSize}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse<any[]>(response);
  }

  async getStudentRatingStats(studentId: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Ratings/student/${studentId}/stats`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async getExpertRatingForStudent(studentId: number, category?: string): Promise<ApiResponse<any>> {
    const url = category
      ? `${API_BASE_URL}/Ratings/expert/student/${studentId}?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/Ratings/expert/student/${studentId}`;
    
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async getMyRatings(page = 1, pageSize = 20): Promise<ApiResponse<any[]>> {
    const response = await fetch(
      `${API_BASE_URL}/Ratings/expert/my-ratings?page=${page}&pageSize=${pageSize}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse<any[]>(response);
  }

  // Achievement endpoints
  async getAchievements(): Promise<ApiResponse<any[]>> {
    const response = await fetch(`${API_BASE_URL}/Achievements`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getMyAchievements(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Achievements/my`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async getUserAchievements(userId: number): Promise<ApiResponse<any[]>> {
    const response = await fetch(`${API_BASE_URL}/Achievements/user/${userId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async checkAndAwardAchievements(): Promise<ApiResponse<any[]>> {
    const response = await fetch(`${API_BASE_URL}/Achievements/check-and-award`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async manualAwardAchievement(achievementId: number, notes?: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Achievements/manual-award`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ achievementId, notes }),
    });
    return this.handleResponse<any>(response);
  }
}

export const apiService = new ApiService();
export default apiService;
