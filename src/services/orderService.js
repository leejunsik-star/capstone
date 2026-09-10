import api, { USE_MOCK_API } from './api';
import {
  getStoredOrders,
  getStoredOrderById,
  createStoredOrder,
  updateStoredOrderStatus
} from './mockStorage';

export const orderService = {
  // Get all orders (or filtered for current user)
  async getOrders(params = {}) {
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
    return await api.get('/orders', { params });
  },

  // Get order by ID
  async getOrderById(orderId) {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return getStoredOrderById(orderId);
    }
    return await api.get(`/orders/${orderId}`);
  },

  // Create new order
  async createOrder(orderData) {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return createStoredOrder(orderData);
    }
    return await api.post('/orders', orderData);
  },

  // Cancel / Request refund for an order
  async cancelOrder(orderId, reason = '사용자 취소 요청') {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return updateStoredOrderStatus(orderId, 'REFUNDED');
    }
    return await api.post(`/orders/${orderId}/cancel`, { reason });
  }
};
