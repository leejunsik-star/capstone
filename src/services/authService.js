import api, { USE_MOCK_API } from './api';
import { getStoredCurrentUser, setStoredCurrentUser, getStoredUsers } from './mockStorage';

export const authService = {
  // Login
  async login(email, password) {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const users = getStoredUsers();
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        // Create demo user if not found
        const newUser = {
          id: Date.now(),
          name: email.split('@')[0],
          email,
          role: email.includes('admin') ? 'ADMIN' : 'USER',
          phone: '010-0000-0000',
          joinDate: new Date().toISOString().slice(0, 10),
          orderCount: 0,
          totalSpent: 0,
          status: 'ACTIVE',
        };
        setStoredCurrentUser(newUser);
        localStorage.setItem('dropick_jwt_token', 'mock_jwt_token_' + Date.now());
        return { user: newUser, token: 'mock_jwt_token_' + Date.now() };
      }

      setStoredCurrentUser(user);
      localStorage.setItem('dropick_jwt_token', 'mock_jwt_token_' + user.id);
      return { user, token: 'mock_jwt_token_' + user.id };
    }

    // Real Spring Boot REST API
    const res = await api.post('/auth/login', { email, password });
    if (res.token) {
      localStorage.setItem('dropick_jwt_token', res.token);
    }
    return res;
  },

  // Signup
  async signup(userData) {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '010-1234-5678',
        role: 'USER',
        joinDate: new Date().toISOString().slice(0, 10),
        orderCount: 0,
        totalSpent: 0,
        status: 'ACTIVE',
      };
      setStoredCurrentUser(newUser);
      localStorage.setItem('dropick_jwt_token', 'mock_jwt_token_' + newUser.id);
      return { user: newUser, token: 'mock_jwt_token_' + newUser.id };
    }

    return await api.post('/auth/signup', userData);
  },

  // Get Current Logged-in User
  getCurrentUser() {
    if (USE_MOCK_API) {
      return getStoredCurrentUser();
    }
    return null;
  },

  // Logout
  logout() {
    localStorage.removeItem('dropick_jwt_token');
    setStoredCurrentUser(null);
  },

  // Quick switch role for testing
  switchAccount(role = 'USER') {
    const users = getStoredUsers();
    const target = users.find((u) => u.role === role) || users[0];
    setStoredCurrentUser(target);
    localStorage.setItem('dropick_jwt_token', 'mock_jwt_token_' + target.id);
    return target;
  }
};
