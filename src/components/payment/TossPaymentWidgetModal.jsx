import React, { useEffect, useRef, useState } from 'react';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
import { X, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { USE_MOCK_API } from '../../services/api';

const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

export const TossPaymentWidgetModal = ({
  isOpen,
  onClose,
  orderData,
  onPaymentSuccess,
  onPaymentFail,
}) => {
  const { user } = useAuth();
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const paymentWidgetRef = useRef(null);
  const paymentMethodsWidgetRef = useRef(null);

  // Initialize and render payment widget ONCE when modal opens
  useEffect(() => {
    if (!isOpen || !orderData) {
      setIsWidgetReady(false);
      paymentWidgetRef.current = null;
      paymentMethodsWidgetRef.current = null;
      return;
    }

    let isSubscribed = true;
    setIsWidgetReady(false);

    const initWidget = async () => {
      try {
        const customerKey = user?.id ? `user_${user.id}` : `ANON_${orderData.id.slice(-8)}`;
        const widget = await loadPaymentWidget(clientKey, customerKey);

        if (!isSubscribed) return;
        paymentWidgetRef.current = widget;

        // Render payment methods
        const methodsWidget = widget.renderPaymentMethods(
          '#payment-widget',
          { value: orderData.paidPrice },
          { variantKey: 'DEFAULT' }
        );
        paymentMethodsWidgetRef.current = methodsWidget;

        // Render agreement
        widget.renderAgreement(
          '#agreement',
          { variantKey: 'AGREEMENT' }
        );

        // Listen for ready event from Toss
        if (methodsWidget && typeof methodsWidget.on === 'function') {
          methodsWidget.on('ready', () => {
            if (isSubscribed) {
              setIsWidgetReady(true);
            }
          });
        }

        // Fallback: If ready event doesn't fire within 2.5s, enable ready state
        setTimeout(() => {
          if (isSubscribed) {
            setIsWidgetReady(true);
          }
        }, 2500);

      } catch (error) {
        console.error("토스 결제위젯 로딩 에러:", error);
        if (isSubscribed) {
          setIsWidgetReady(true);
        }
      }
    };

    initWidget();

    return () => {
      isSubscribed = false;
    };
  }, [isOpen, orderData?.id]);

  const handlePaymentRequest = async () => {
    if (isProcessing) return;

    if (!paymentWidgetRef.current && !USE_MOCK_API) {
      alert('결제 모듈을 불러오는 중입니다. 잠시만 기다려주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      if (USE_MOCK_API) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const paymentResult = {
          paymentKey: `toss_pay_key_${Date.now()}_mock`,
          orderId: orderData.id,
          amount: orderData.paidPrice,
          method: '간편결제',
          status: 'PAID',
        };
        onPaymentSuccess(paymentResult);
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

  if (!isOpen || !orderData) return null;

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
          {/* Loading state indicator */}
          {!isWidgetReady && (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-gray-500">
                토스페이먼츠 보안 결제창을 준비하고 있습니다...
              </p>
            </div>
          )}

          {/* 토스 결제위젯이 마운트될 DOM 요소 */}
          <div id="payment-widget" className={`w-full ${!isWidgetReady ? 'hidden' : ''}`} />
          {/* 토스 약관동의가 마운트될 DOM 요소 */}
          <div id="agreement" className={`w-full mt-2 ${!isWidgetReady ? 'hidden' : ''}`} />
        </div>

        {/* Submit Button */}
        <div className="p-5 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handlePaymentRequest}
            disabled={!isWidgetReady || isProcessing}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>결제창 여는 중...</span>
              </>
            ) : !isWidgetReady ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>결제 UI 로딩 중...</span>
              </>
            ) : (
              `${orderData.paidPrice.toLocaleString()}원 결제하기`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TossPaymentWidgetModal;
