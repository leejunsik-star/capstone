import React, { useEffect, useRef, useState } from 'react';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { USE_MOCK_API } from '../../services/api';

// [중요] 토스페이먼츠 공개 테스트 클라이언트 키입니다. 
// 실제 연동 시 발급받은 키로 변경하세요 (현재는 기본 테스트키로 렌더링되게 처리됨)
const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

export const TossPaymentWidgetModal = ({
  isOpen,
  onClose,
  orderData,
  onPaymentSuccess,
  onPaymentFail,
}) => {
  const { user } = useAuth();
  const [paymentWidget, setPaymentWidget] = useState(null);
  const paymentMethodsWidgetRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen || !orderData) return;

    const fetchPaymentWidget = async () => {
      try {
        // 회원인 경우 유저 ID, 비회원인 경우 'ANONYMOUS'
        const customerKey = user?.id ? `user_${user.id}` : 'ANONYMOUS';
        const widget = await loadPaymentWidget(clientKey, customerKey);
        setPaymentWidget(widget);
      } catch (error) {
        console.error("토스 결제위젯 렌더링 에러:", error);
      }
    };

    fetchPaymentWidget();
  }, [isOpen, orderData, user]);

  useEffect(() => {
    if (paymentWidget == null || !orderData) return;

    // 가격 및 결제 UI 렌더링
    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      '#payment-widget',
      { value: orderData.paidPrice },
      { variantKey: 'DEFAULT' }
    );

    // 약관 동의 UI 렌더링
    paymentWidget.renderAgreement(
      '#agreement',
      { variantKey: 'AGREEMENT' }
    );

    paymentMethodsWidgetRef.current = paymentMethodsWidget;
  }, [paymentWidget, orderData]);

  const handlePaymentRequest = async () => {
    if (!paymentWidget) return;
    setIsProcessing(true);

    try {
      if (USE_MOCK_API) {
        // [Mock 모드] 실제 PG창 호출 안하고 성공 처리 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 900));
        const paymentResult = {
          paymentKey: `toss_pay_key_${Date.now()}_mock`,
          orderId: orderData.id,
          amount: orderData.paidPrice,
          method: '간편결제',
          status: 'PAID',
        };
        onPaymentSuccess(paymentResult);
      } else {
        // [실제 연동 모드] 토스페이먼츠 결제창 띄우기
        // 결제 완료 후 successUrl로 자동 리다이렉트 됩니다.
        await paymentWidget.requestPayment({
          orderId: orderData.id,
          orderName: orderData.productTitle,
          customerName: user?.name || '익명 구매자',
          customerEmail: user?.email || 'dropick@example.com',
          customerMobilePhone: user?.phone?.replace(/-/g, '') || '01012341234',
          successUrl: `${window.location.origin}/payment/success?orderId=${orderData.id}`,
          failUrl: `${window.location.origin}/payment/fail?orderId=${orderData.id}`,
        });
        // 참고: 창이 전환되므로 이 아래 코드는 실행되지 않습니다.
      }
    } catch (error) {
      console.error(error);
      onPaymentFail(error.message || '결제 중 오류가 발생했습니다.');
      setIsProcessing(false);
    }
  };

  if (!isOpen || !orderData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-lg text-gray-900">결제하기</h3>
          <button onClick={onClose} disabled={isProcessing} className="p-1 text-gray-400 hover:text-gray-900 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toss Payment UI Areas */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {/* 토스 결제위젯이 마운트될 DOM 요소 */}
          <div id="payment-widget" className="w-full" />
          {/* 토스 약관동의가 마운트될 DOM 요소 */}
          <div id="agreement" className="w-full mt-4" />
          
          {USE_MOCK_API && (
            <div className="mx-4 mt-2 p-3 bg-rose-50 text-rose-600 text-xs rounded-xl font-bold border border-rose-100">
              현재 VITE_USE_MOCK_API=true 상태이므로 결제하기 버튼을 누르면 실제 창이 뜨지 않고 테스트 성공 처리됩니다. 
              진짜 결제창을 보려면 .env 파일에서 false로 변경하세요.
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handlePaymentRequest}
            disabled={isProcessing}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isProcessing ? '결제 요청 중...' : `${orderData.paidPrice.toLocaleString()}원 결제하기`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TossPaymentWidgetModal;
