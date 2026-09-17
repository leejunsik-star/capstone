import React, { useEffect, useRef, useState } from 'react';
import { loadPaymentWidget, ANONYMOUS } from '@tosspayments/payment-widget-sdk';
import { X, Loader2, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { USE_MOCK_API } from '../../services/api';

const rawKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
const clientKey = (rawKey && !rawKey.includes('여기에') && rawKey.startsWith('test_ck_'))
  ? rawKey
  : 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

// 실제로 렌더링되는 내부 컴포넌트 (항상 마운트됨 → DOM에 #payment-widget 존재 보장)
const TossPaymentWidgetInner = ({
  orderData,
  onClose,
  onPaymentSuccess,
  onPaymentFail,
  user,
}) => {
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const paymentWidgetRef = useRef(null);
  const paymentMethodsWidgetRef = useRef(null);

  // DOM이 확실히 마운트된 후 위젯 초기화
  useEffect(() => {
    let isSubscribed = true;
    setIsWidgetReady(false);

    const initWidget = async () => {
      try {
        // DOM이 그려진 이후 실행 보장 (React paint 이후)
        await new Promise((r) => setTimeout(r, 100));
        if (!isSubscribed) return;

        const customerKey = user?.id ? `user_${user.id}` : ANONYMOUS;
        const widget = await loadPaymentWidget(clientKey, customerKey);

        if (!isSubscribed) return;
        paymentWidgetRef.current = widget;

        // #payment-widget div가 DOM에 실제로 존재하는지 확인
        const container = document.getElementById('payment-widget');
        if (!container) {
          console.error('❌ #payment-widget 컨테이너를 찾을 수 없습니다');
          return;
        }

        const methodsWidget = widget.renderPaymentMethods(
          '#payment-widget',
          { value: orderData.paidPrice }
        );
        paymentMethodsWidgetRef.current = methodsWidget;

        widget.renderAgreement('#agreement');

        if (methodsWidget && typeof methodsWidget.on === 'function') {
          methodsWidget.on('ready', () => {
            if (isSubscribed) setIsWidgetReady(true);
          });
        }

        // 3초 fallback
        setTimeout(() => {
          if (isSubscribed) setIsWidgetReady(true);
        }, 3000);

      } catch (error) {
        console.error('토스 결제위젯 로딩 에러:', error);
        if (isSubscribed) setIsWidgetReady(true);
      }
    };

    initWidget();
    return () => { isSubscribed = false; };
  }, [orderData?.id]);

  const handlePaymentRequest = async () => {
    if (isProcessing) return;

    if (!isWidgetReady && !USE_MOCK_API) {
      alert('토스 결제창이 아직 준비 중입니다. 잠시 후 다시 눌러주세요.');
      return;
    }

    if (!paymentWidgetRef.current && !USE_MOCK_API) {
      alert('토스 결제 모듈을 불러오는 중입니다. 1~2초 후 다시 시도해주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      if (USE_MOCK_API) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        onPaymentSuccess({
          paymentKey: `toss_pay_key_${Date.now()}_mock`,
          orderId: orderData.id,
          amount: orderData.paidPrice,
          method: '간편결제',
          status: 'PAID',
        });
      } else {
        await paymentWidgetRef.current.requestPayment({
          orderId: orderData.id,
          orderName: orderData.productTitle,
          customerName: user?.name || '구매자',
          customerEmail: user?.email || 'customer@dropick.com',
          customerMobilePhone: user?.phone?.replace(/-/g, '') || '01012345678',
          successUrl: `${window.location.origin}/payment/success?orderId=${orderData.id}`,
          failUrl: `${window.location.origin}/payment/fail?orderId=${orderData.id}`,
        });
      }
    } catch (error) {
      console.error('Payment request error:', error);
      setIsProcessing(false);
      onPaymentFail(error.message || '결제 진행 중 오류가 발생했습니다.');
    }
  };

  const handleQuickMockPayment = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onPaymentSuccess({
      paymentKey: `toss_simulated_${Date.now()}`,
      orderId: orderData.id,
      amount: orderData.paidPrice,
      method: '토스페이(테스트 승인)',
      status: 'PAID',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-gray-900">토스페이먼츠 안전결제</h3>
          </div>
          <button onClick={onClose} disabled={isProcessing} className="p-1 text-gray-400 hover:text-gray-900 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toss Payment UI Areas */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {!isWidgetReady && (
            <div className="flex flex-col items-center justify-center min-h-[260px] gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm">결제 수단을 불러오는 중...</p>
            </div>
          )}
          {/* 항상 DOM에 존재해야 함 - visibility로 토글 */}
          <div id="payment-widget" style={{ display: isWidgetReady ? 'block' : 'none' }} className="w-full min-h-[260px]" />
          <div id="agreement" style={{ display: isWidgetReady ? 'block' : 'none' }} className="w-full min-h-[90px] mt-2" />
        </div>

        {/* Submit Button */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-2.5">
          <button
            onClick={handlePaymentRequest}
            disabled={isProcessing || !isWidgetReady}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>결제창 연결 중...</span>
              </>
            ) : !isWidgetReady ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>결제 수단 로딩 중...</span>
              </>
            ) : (
              `${orderData.paidPrice.toLocaleString()}원 결제하기`
            )}
          </button>

          {/* 시연 및 테스트용 즉시 승인 백업 버튼 */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleQuickMockPayment}
              disabled={isProcessing}
              className="text-[11px] text-gray-400 hover:text-purple-600 font-medium transition cursor-pointer flex items-center justify-center gap-1 mx-auto"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>시연용 테스트 간편 결제 (즉시 승인)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 외부 컴포넌트: isOpen/orderData 가드 역할만 수행
export const TossPaymentWidgetModal = ({
  isOpen,
  onClose,
  orderData,
  onPaymentSuccess,
  onPaymentFail,
}) => {
  const { user } = useAuth();

  if (!isOpen || !orderData) return null;

  return (
    <TossPaymentWidgetInner
      orderData={orderData}
      onClose={onClose}
      onPaymentSuccess={onPaymentSuccess}
      onPaymentFail={onPaymentFail}
      user={user}
    />
  );
};

export default TossPaymentWidgetModal;
