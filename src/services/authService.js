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
    const payload = res?.token ? res : (res?.data || res);
    if (!payload) {
      throw new Error('로그인 처리 중 문제가 발생했습니다.');
    }
    if (payload.token) {
      localStorage.setItem('dropick_jwt_token', payload.token);
    }
    if (payload.user) {
      localStorage.setItem('dropick_current_user', JSON.stringify(payload.user));
    }
    return payload;
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
        role: userData.email.includes('admin') ? 'ADMIN' : 'USER',
        joinDate: new Date().toISOString().slice(0, 10),
        orderCount: 0,
        totalSpent: 0,
        status: 'ACTIVE',
      };
      setStoredCurrentUser(newUser);
      localStorage.setItem('dropick_jwt_token', 'mock_jwt_token_' + newUser.id);
      return { user: newUser, token: 'mock_jwt_token_' + newUser.id };
    }

    const res = await api.post('/auth/signup', userData);
    const payload = res?.token ? res : (res?.data || res);
    if (!payload) {
      throw new Error('회원가입 처리 중 문제가 발생했습니다.');
    }
    if (payload.token) {
      localStorage.setItem('dropick_jwt_token', payload.token);
    }
    if (payload.user) {
      localStorage.setItem('dropick_current_user', JSON.stringify(payload.user));
    }
    return payload;
  },

  // Get Current Logged-in User
  getCurrentUser() {
    try {
      const saved = localStorage.getItem('dropick_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
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
