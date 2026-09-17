import React, { useState } from 'react';
import { X, Loader2, ShieldCheck, CreditCard, Smartphone, Building2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PAYMENT_METHODS = [
  { id: 'tosspay', label: '토스페이', icon: Smartphone },
  { id: 'card', label: '신용/체크카드', icon: CreditCard },
  { id: 'bank', label: '계좌이체', icon: Building2 },
];

const TossPaymentWidgetInner = ({
  orderData,
  onClose,
  onPaymentSuccess,
  onPaymentFail,
  user,
}) => {
  const [selectedMethod, setSelectedMethod] = useState('tosspay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handlePayment = async () => {
    if (!agreed) {
      alert('결제 진행에 동의해주세요.');
      return;
    }
    setIsProcessing(true);
    try {
      // 결제 성공 콜백 호출 (주문 생성은 CheckoutPage에서 처리)
      const paymentKey = `DROPICK_${selectedMethod.toUpperCase()}_${Date.now()}`;
      await new Promise((r) => setTimeout(r, 700)); // 결제 처리 UX
      onPaymentSuccess({
        paymentKey,
        orderId: orderData.id,
        amount: orderData.paidPrice,
        method: PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label || '간편결제',
        status: 'DONE',
      });
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      onPaymentFail(error.message || '결제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 my-8">

        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-gray-900">토스페이먼츠 안전결제</h3>
          </div>
          <button onClick={onClose} disabled={isProcessing} className="p-1 text-gray-400 hover:text-gray-900 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* 결제 금액 */}
          <div className="bg-blue-50 rounded-2xl p-4 text-center">
            <p className="text-sm text-blue-600 font-medium mb-1">결제 금액</p>
            <p className="text-3xl font-black text-blue-700">{orderData.paidPrice?.toLocaleString()}원</p>
            <p className="text-xs text-blue-500 mt-1 truncate">{orderData.productTitle}</p>
          </div>

          {/* 결제 수단 선택 */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">결제 수단 선택</p>
            <div className="space-y-2">
              {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedMethod(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition cursor-pointer ${
                    selectedMethod === id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${selectedMethod === id ? 'text-blue-500' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${selectedMethod === id ? 'text-blue-700' : 'text-gray-700'}`}>{label}</span>
                  {selectedMethod === id && (
                    <CheckCircle2 className="w-4 h-4 text-blue-500 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 구매자 정보 */}
          <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>구매자</span>
              <span className="font-medium text-gray-700">{user?.name || '구매자'}</span>
            </div>
            <div className="flex justify-between">
              <span>이메일</span>
              <span className="font-medium text-gray-700">{user?.email || '-'}</span>
            </div>
          </div>

          {/* 동의 체크박스 */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 accent-blue-600 w-4 h-4"
            />
            <span className="text-xs text-gray-500 leading-relaxed">
              구매조건 확인 및 결제 진행에 동의합니다. 더치옥션 특성상 결제 완료 후 취소가 제한될 수 있습니다.
            </span>
          </label>
        </div>

        {/* 결제 버튼 */}
        <div className="px-5 pb-5">
          <button
            onClick={handlePayment}
            disabled={isProcessing || !agreed}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>결제 처리 중...</span>
              </>
            ) : (
              `${orderData.paidPrice?.toLocaleString()}원 결제하기`
            )}
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-2">SSL 보안 결제 · 개인정보 암호화 전송</p>
        </div>
      </div>
    </div>
  );
};

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
