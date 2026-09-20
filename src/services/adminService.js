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
      const validOrders = orders.filter((o) => o.status === 'PAID' || o.status === 'RECEIPT_CONFIRMED');

      const todaySales = validOrders.reduce((sum, o) => sum + (o.paidPrice || 0), 0);
      const todayOrdersCount = orders.length;

      return {
        todaySales,
        todayOrdersCount,
        activeAuctionsCount: activeProducts.length,
        endingSoonCount: activeProducts.filter(p => p.auctionEndTime && new Date(p.auctionEndTime) < new Date(Date.now() + 24*3600*1000)).length,
        soldTicketsCount: validOrders.length,
        totalMembersCount: users.length,
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
  },

  // Get All Orders for Admin
  async getAllOrders(params = {}) {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      let orders = getStoredOrders();
      if (params.status && params.status !== 'ALL') {
        orders = orders.filter((o) => o.status === params.status);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        orders = orders.filter(
          (o) =>
            o.id.toLowerCase().includes(q) ||
            o.productTitle.toLowerCase().includes(q) ||
            (o.buyerName && o.buyerName.toLowerCase().includes(q))
        );
      }
      return orders;
    }
    return await api.get('/admin/orders', { params });
  }
};
