import React, { useState } from 'react';
import { X, ShieldCheck, Check, CreditCard, Smartphone, Building2, Lock, AlertCircle } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

// 실제 토스페이먼츠 연동 시 필요한 패키지:
// npm install @tosspayments/tosspayment-widget-sdk
// import { loadPaymentWidget } from '@tosspayments/tosspayment-widget-sdk';
import { USE_MOCK_API } from '../../services/api';

export const TossPaymentWidgetModal = ({
  isOpen,
  onClose,
  orderData,
  onPaymentSuccess,
  onPaymentFail,
}) => {
  const [selectedMethod, setSelectedMethod] = useState('toss_pay');
  const [selectedCard, setSelectedCard] = useState('현대카드');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !orderData) return null;

  const paymentMethods = [
    { id: 'toss_pay', name: '토스페이 (Toss Pay)', icon: Smartphone, badge: '최대 2% 적립' },
    { id: 'card', name: '신용·체크카드', icon: CreditCard, badge: '무이자할부' },
    { id: 'kakao_pay', name: '카카오페이 (KakaoPay)', icon: Smartphone, badge: '' },
    { id: 'vbank', name: '가상계좌 (무통장입금)', icon: Building2, badge: '' },
  ];

  const cards = ['현대카드', '신한카드', '삼성카드', 'KB국민카드', '토스뱅크', '롯데카드', '우리카드'];

  const handlePay = async () => {
    if (!agreeTerms) {
      alert('결제 이용약관에 동의해주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      if (USE_MOCK_API) {
        // [시뮬레이션] 토스페이먼츠 연동 UI
        await new Promise((resolve) => setTimeout(resolve, 900));
        const paymentResult = {
          paymentKey: `toss_pay_key_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          orderId: orderData.id,
          amount: orderData.paidPrice,
          method: selectedMethod === 'card' ? `신용카드 (${selectedCard})` : paymentMethods.find(m => m.id === selectedMethod)?.name || '간편결제',
          status: 'PAID',
        };
        onPaymentSuccess(paymentResult);
      } else {
        // [실제 연동] 토스페이먼츠 SDK 호출
        // const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
        // const customerKey = 'user_abc123'; // 실제 연동 시 로그인한 유저 ID
        // const paymentWidget = await loadPaymentWidget(clientKey, customerKey);
        //
        // await paymentWidget.requestPayment(selectedMethod === 'card' ? '카드' : '토스페이', {
        //   orderId: orderData.id,
        //   orderName: orderData.productTitle,
        //   successUrl: `${window.location.origin}/payment/success?orderId=${orderData.id}`,
        //   failUrl: `${window.location.origin}/payment/fail?orderId=${orderData.id}`,
        // });
        
        alert('실제 토스 결제 위젯을 띄우는 구간입니다. (.env의 VITE_USE_MOCK_API=true 로 변경하여 진행해주세요)');
        setIsProcessing(false);
      }
    } catch (err) {
      onPaymentFail(err.message || '결제 승인 중 오류가 발생했습니다.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 animate-scaleUp">
        {/* Toss Payments Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center font-bold text-white text-xs">
              T
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">토스페이먼츠 안전결제</h3>
              <p className="text-[10px] text-slate-400">DROPICK 공식 결제 서비스</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Amount Bar */}
        <div className="p-5 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">결제 상품</span>
            <span className="font-bold text-slate-900 text-sm line-clamp-1">{orderData.productTitle}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">최종 결제금액</span>
            <span className="text-lg font-black text-blue-600">{formatPrice(orderData.paidPrice)}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Method Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">결제 수단 선택</label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-1 transition ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                      {method.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                          {method.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 mt-1">{method.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card Select if Card chosen */}
          {selectedMethod === 'card' && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="text-xs font-bold text-slate-700 block">카드사 선택</label>
              <select
                value={selectedCard}
                onChange={(e) => setSelectedCard(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 outline-hidden focus:border-blue-500"
              >
                {cards.map((c) => (
                  <option key={c} value={c}>
                    {c} (일시불 / 무이자 혜택)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Terms Agreement */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span>[필수] 결제서비스 이용약관 및 개인정보 제공 동의</span>
            </label>
            <p className="text-[11px] text-gray-500 leading-relaxed pl-6">
              전자상거래법에 의거하여 결제 정보는 암호화 처리되며 안전하게 전송됩니다.
            </p>
          </div>

          {/* Secure Guarantee */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <Lock className="w-3.5 h-3.5 text-blue-500" />
            <span>256-bit SSL 암호화 결제 보안 모듈 가동 중</span>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/25 transition active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>토스 결제 승인 요청 중...</span>
              </>
            ) : (
              <>
                <span>{formatPrice(orderData.paidPrice)} 결제하기</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TossPaymentWidgetModal;
