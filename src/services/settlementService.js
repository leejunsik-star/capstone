import api, { USE_MOCK_API } from './api';
import {
  getStoredCurrentUser,
  setStoredCurrentUser,
  getStoredOrders,
  updateStoredOrderStatus
} from './mockStorage';

// 지원 은행 목록 (실명 인증 시 사용)
export const BANK_LIST = [
  { code: '004', name: '국민은행' },
  { code: '088', name: '신한은행' },
  { code: '020', name: '우리은행' },
  { code: '081', name: '하나은행' },
  { code: '003', name: 'IBK기업은행' },
  { code: '011', name: 'NH농협은행' },
  { code: '090', name: '카카오뱅크' },
  { code: '089', name: '케이뱅크' },
  { code: '092', name: '토스뱅크' },
  { code: '023', name: 'SC제일은행' },
  { code: '032', name: '부산은행' },
  { code: '031', name: '대구은행' },
];

export const settlementService = {
  /**
   * [판매자] 정산 계좌 등록
   * 실제 연동: POST /api/sellers/settlement-account
   * 토스 계좌 실명조회 API 선행 필요
   */
  async registerSettlementAccount(accountData) {
    if (USE_MOCK_API) {
      await new Promise(r => setTimeout(r, 800));
      // 계좌 인증 성공 시뮬레이션
      const currentUser = getStoredCurrentUser();
      const updatedUser = {
        ...currentUser,
        settlementAccount: {
          bankCode: accountData.bankCode,
          bankName: accountData.bankName,
          accountNumber: accountData.accountNumber,
          accountHolder: accountData.accountHolder,
          isVerified: true,
          registeredAt: new Date().toISOString(),
        }
      };
      setStoredCurrentUser(updatedUser);
      return { success: true, message: '계좌 인증 및 등록이 완료되었습니다.' };
    }
    // 실제: 토스 계좌 실명조회 후 Spring Boot에 등록
    return await api.post('/sellers/settlement-account', accountData);
  },

  /**
   * [판매자] 정산 계좌 조회
   */
  async getSettlementAccount() {
    if (USE_MOCK_API) {
      const currentUser = getStoredCurrentUser();
      return currentUser?.settlementAccount || null;
    }
    return await api.get('/sellers/settlement-account');
  },

  /**
   * [구매자] 티켓 수령 확인 → 판매자 정산 트리거
   * 실제 연동: POST /api/orders/{orderId}/confirm-receipt
   * Spring Boot → 토스페이먼츠 정산 API 호출 (판매자 계좌 자동 이체)
   */
  async confirmReceipt(orderId) {
    if (USE_MOCK_API) {
      await new Promise(r => setTimeout(r, 600));
      const updated = updateStoredOrderStatus(orderId, 'RECEIPT_CONFIRMED');
      // Mock: 수령 확인 시 정산 스케줄 등록 시뮬레이션
      const orders = getStoredOrders();
      const order = orders.find(o => o.id === orderId);
      return {
        success: true,
        orderId,
        settlementScheduled: true,
        settlementDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // 익일 정산
        message: '수령이 확인되었습니다. 판매자에게 익일 자동 정산됩니다.',
      };
    }
    // 실제: Spring Boot에서 토스 정산 API 호출
    return await api.post(`/orders/${orderId}/confirm-receipt`);
  },

  /**
   * [관리자] 전체 정산 현황 조회
   */
  async getSettlements(params = {}) {
    if (USE_MOCK_API) {
      const orders = getStoredOrders();
      return orders.filter(o => o.status === 'PAID' || o.status === 'RECEIPT_CONFIRMED').map(o => ({
        orderId: o.id,
        productTitle: o.productTitle,
        buyerName: o.buyerName,
        paidPrice: o.paidPrice,
        sellerName: o.sellerName || '판매자',
        sellerSettlementAmount: Math.floor((o.paidPrice || 0) * 0.97), // 수수료 3% 차감
        platformFee: Math.floor((o.paidPrice || 0) * 0.03),
        status: o.status === 'RECEIPT_CONFIRMED' ? 'SETTLEMENT_DONE' : 'SETTLEMENT_PENDING',
        settledAt: o.status === 'RECEIPT_CONFIRMED' ? new Date().toISOString() : null,
      }));
    }
    return await api.get('/admin/settlements', { params });
  },

  /**
   * 토스페이먼츠 계좌 실명조회 API 호출
   * 실제 연동: Spring Boot 경유 (시크릿 키는 절대 프론트에 노출 금지)
   * POST /api/toss/verify-account
   */
  async verifyBankAccount({ bankCode, accountNumber, holderName }) {
    if (USE_MOCK_API) {
      await new Promise(r => setTimeout(r, 1000));
      // 시뮬레이션: 항상 인증 성공
      return {
        verified: true,
        accountHolder: holderName,
        bankName: BANK_LIST.find(b => b.code === bankCode)?.name || '알 수 없음',
      };
    }
    // 실제: 시크릿 키는 Spring Boot에서만 사용
    return await api.post('/toss/verify-account', { bankCode, accountNumber, holderName });
  },
};
