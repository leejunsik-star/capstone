import api, { USE_MOCK_API } from './api';
import {
  getStoredProducts,
  getStoredOrders,
  getStoredUsers
} from './mockStorage';

export const adminService = {
  // Get dashboard metrics & KPIs
  async getDashboardKPIs() {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const products = getStoredProducts();
      const orders = getStoredOrders();
      const users = getStoredUsers();

      const activeProducts = products.filter((p) => p.status === 'ACTIVE');
      const soldProducts = products.filter((p) => p.status === 'SOLD');
      const paidOrders = orders.filter((o) => o.status === 'PAID');

      const todaySales = paidOrders.reduce((sum, o) => sum + (o.paidPrice || 0), 0) + 12450000;
      const todayOrdersCount = paidOrders.length + 228;

      return {
        todaySales,
        todayOrdersCount,
        activeAuctionsCount: activeProducts.length + 20,
        endingSoonCount: 6,
        soldTicketsCount: soldProducts.length + 142,
        totalMembersCount: users.length + 3236,
        recentOrders: orders.slice(0, 6),
        activeAuctions: activeProducts.slice(0, 5),
      };
    }

    return await api.get('/admin/dashboard');
  },

  // Get Admin Users
  async getUsers(params = {}) {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      let users = getStoredUsers();
      if (params.search) {
        const q = params.search.toLowerCase();
        users = users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
      }
      return users;
    }
    return await api.get('/admin/users', { params });
  }
};
