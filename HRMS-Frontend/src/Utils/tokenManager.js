// Token management utility for handling JWT tokens and automatic refresh

const TOKEN_KEY = 'token'; // Match the existing application's token key
const USER_KEY = 'loggedUser'; // Match the existing application's user key

export class TokenManager {
  static getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  static setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  static removeToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  static getUser() {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  }

  static setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // Check if token is expired (basic check)
  static isTokenExpired(token) {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (e) {
      console.error('Error checking token expiration:', e);
      return true;
    }
  }

  // Refresh token using the backend endpoint
  static async refreshToken() {
    const currentToken = this.getToken();
    
    if (!currentToken) {
      throw new Error('No token to refresh');
    }

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://trowel-eldercare-scouting.ngrok-free.dev';
      const response = await fetch(`${apiBase}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      // Update stored token and user data
      this.setToken(data.token);
      
      const currentUser = this.getUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...data };
        this.setUser(updatedUser);
      }

      console.log('✅ Token refreshed successfully');
      return data.token;
      
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      // Clear invalid tokens
      this.removeToken();
      throw error;
    }
  }

  // Get valid token (refresh if needed)
  static async getValidToken() {
    const token = this.getToken();
    
    if (!token) {
      return null; // Don't throw error, just return null
    }

    // If token is expired, try to refresh it
    if (this.isTokenExpired(token)) {
      console.log('🔄 Token expired, attempting refresh...');
      try {
        return await this.refreshToken();
      } catch (error) {
        console.error('❌ Token refresh failed:', error);
        return null; // Return null instead of throwing
      }
    }

    return token;
  }

  // Setup automatic token refresh
  static setupAutoRefresh() {
    // Disabled for now to prevent aggressive redirects
    console.log('🔄 Auto-refresh setup disabled');
    return;
    
    const checkInterval = 5 * 60 * 1000; // Check every 5 minutes
    
    setInterval(async () => {
      const token = this.getToken();
      
      if (token && this.isTokenExpired(token)) {
        try {
          await this.refreshToken();
          console.log('🔄 Auto-refreshed expired token');
        } catch (error) {
          console.error('❌ Auto-refresh failed:', error);
          // Redirect to login or show notification
          window.location.href = '/';
        }
      }
    }, checkInterval);
  }
}

// Initialize auto-refresh when module loads
TokenManager.setupAutoRefresh();

export default TokenManager;