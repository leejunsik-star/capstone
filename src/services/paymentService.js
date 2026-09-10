import api, { USE_MOCK_API } from './api';
import { updateStoredOrderStatus, getStoredOrders } from './mockStorage';

export const paymentService = {
  /**
   * Request Payment with Toss Payments API
   * When integrating real Toss SDK: loadTossPayments(clientKey).then(toss => toss.requestPayment(...))
   */
  async requestTossPayment(paymentInfo) {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      // Simulate random network or concurrent failure check (99% success)
      return {
        success: true,
        paymentKey: `toss_live_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        orderId: paymentInfo.orderId,
        amount: paymentInfo.amount,
        method: paymentInfo.method || '토스페이',
      };
    }

    return await api.post('/payments/request', paymentInfo);
  },

  /**
   * Confirm Payment (Spring Boot Server-side verification step)
   */
  async confirmPayment({ paymentKey, orderId, amount }) {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      updateStoredOrderStatus(orderId, 'PAID');
      return {
        status: 'DONE',
        orderId,
        paymentKey,
        approvedAt: new Date().toISOString(),
      };
    }

    return await api.post('/payments/confirm', { paymentKey, orderId, amount });
  },

  /**
   * Refund / Cancel Payment
   */
  async refundPayment(orderId, reason = '관리자 승인 환불') {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const updated = updateStoredOrderStatus(orderId, 'REFUNDED');
      return {
        success: true,
        orderId,
        refundedAt: new Date().toISOString(),
        order: updated,
      };
    }

    return await api.post(`/payments/${orderId}/cancel`, { reason });
  }
};
