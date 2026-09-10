import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { useDutchAuction } from '../../hooks/useDutchAuction';
import TossPaymentWidgetModal from '../../components/payment/TossPaymentWidgetModal';
import { formatPrice, formatEventDate } from '../../utils/formatters';
import {
  ChevronLeft,
  ShieldCheck,
  Ticket,
  Calendar,
  MapPin,
  Lock,
  User,
  Phone,
  Mail,
  Zap,
  AlertTriangle
} from 'lucide-react';

export const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Buyer details form
  const [buyerName, setBuyerName] = useState(user?.name || '김태극');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '010-3849-2910');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || 'taegeuk.kim@dropick.com');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const loadProduct = async () => {
    try {
      const data = await productService.getProductById(id);
      if (data) {
        setProduct(data);
      } else {
        navigate('/products');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const auctionState = useDutchAuction(product);

  if (loading || !product || !auctionState) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-gray-500">주문서 정보를 준비하고 있습니다...</p>
      </div>
    );
  }

  const { currentPrice, status } = auctionState;

  // Handle Checkout Click -> Verify Product Availability & Price first
  const handleProceedToPayment = async () => {
    if (!agreeTerms) {
      alert('티켓 예매 및 취소/환불 규정에 동의해주세요.');
      return;
    }

    setIsVerifying(true);
    try {
      const verifyResult = await productService.verifyProductAvailability(product.id);
      if (!verifyResult.available) {
        navigate(`/payment/fail?reason=${encodeURIComponent(verifyResult.message || '구매 불가')}`);
        return;
      }

      // Open Toss Payments Widget Modal
      setIsPaymentModalOpen(true);
    } catch (err) {
      alert(err.message || '구매 가능 여부 확인 중 오류가 발생했습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePaymentSuccess = async (paymentResult) => {
    try {
      const orderPayload = {
        productId: product.id,
        productTitle: product.title,
        category: product.category,
        venue: product.venue,
        eventDate: product.eventDate,
        seat: product.seat,
        seatGrade: product.seatGrade,
        imageUrl: product.imageUrl,
        paidPrice: currentPrice,
        startPrice: product.startPrice,
        savedPrice: product.startPrice - currentPrice,
        buyerName,
        buyerPhone,
        buyerEmail,
        paymentMethod: paymentResult.method,
        paymentKey: paymentResult.paymentKey,
      };

      const savedOrder = await orderService.createOrder(orderPayload);
      setIsPaymentModalOpen(false);
      navigate(`/payment/success?orderId=${savedOrder.id}`);
    } catch (err) {
      console.error('Order creation error', err);
      navigate(`/payment/fail?reason=${encodeURIComponent('주문 생성 중 오류가 발생했습니다.')}`);
    }
  };

  const handlePaymentFail = (errorMsg) => {
    setIsPaymentModalOpen(false);
    navigate(`/payment/fail?reason=${encodeURIComponent(errorMsg)}`);
  };

  const orderDataForWidget = {
    id: `ORD-${Date.now()}`,
    productTitle: product.title,
    paidPrice: currentPrice,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Link
        to={`/products/${product.id}`}
        className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-purple-600 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>상품 상세로 돌아가기</span>
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          주문 및 결제서 (Checkout)
        </h1>
        <p className="text-xs text-gray-500">
          실시간 더치옥션 낙찰 가격을 확인하시고 안전하게 예매를 완료하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Buyer & Verification - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          {/* Ticket Summary Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-700 pb-2 border-b border-gray-100">
              <Ticket className="w-4 h-4" />
              <span>예매 티켓 정보</span>
            </div>

            <div className="flex gap-4">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-24 h-24 rounded-2xl object-cover shrink-0 shadow-xs"
              />
              <div className="space-y-1 flex-1">
                <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                  {product.categoryLabel || product.category}
                </span>
                <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                  {product.title}
                </h3>
                <div className="space-y-0.5 text-xs text-gray-500 pt-1">
                  <p className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span>{formatEventDate(product.eventDate)}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span>{product.venue}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Seat Badge */}
            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 flex items-center justify-between text-xs">
              <span className="text-gray-600">지정 배정 좌석:</span>
              <span className="font-bold text-purple-900">{product.seat} ({product.seatGrade})</span>
            </div>
          </div>

          {/* Buyer Information Form */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900 pb-2 border-b border-gray-100">
              <User className="w-4 h-4 text-purple-600" />
              <span>예매자 정보 입력 (QR 티켓 수령자)</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">성함</label>
                <div className="relative">
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    required
                    className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                  />
                  <User className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">휴대폰 번호 (모바일 티켓 알림톡 발송)</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    required
                    className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                  />
                  <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">이메일 주소</label>
                <div className="relative">
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    required
                    className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                  />
                  <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Agreements */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-xs space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
              />
              <span>[필수] 더치옥션 즉시 거래 및 취소/환불 규정에 동의합니다.</span>
            </label>
            <p className="text-[11px] text-gray-500 pl-6 leading-relaxed">
              더치옥션은 구매 확정 시 실시간 재고가 즉시 차감되며 결제 승인과 동시에 QR 티켓이 발권됩니다.
            </p>
          </div>
        </div>

        {/* Right Form: Price Calculation & CTA - 5 cols */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-purple-500/30 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                최종 결제 금액
              </span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                실시간 낙찰가
              </span>
            </div>

            {/* Price breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>정상 티켓 시작가</span>
                <span className="line-through">{formatPrice(product.startPrice)}</span>
              </div>

              <div className="flex items-center justify-between text-rose-400 font-bold">
                <span>더치옥션 가격 하락 할인</span>
                <span>-{formatPrice(product.startPrice - currentPrice)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span>DROPICK 플랫폼 수수료</span>
                <span className="text-emerald-400 font-bold">0원 (오픈 프로모션 무료)</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-200">최종 결제 금액</span>
                <span className="text-2xl font-black text-purple-400">
                  {formatPrice(currentPrice)}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleProceedToPayment}
              disabled={isVerifying}
              className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-black text-base shadow-xl shadow-blue-500/25 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>구매 가능 여부 확인 중...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>토스페이먼츠로 결제하기</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>토스페이먼츠 안전 결제 에스크로 적용</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toss Payments Interactive Modal */}
      <TossPaymentWidgetModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderData={orderDataForWidget}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFail={handlePaymentFail}
      />
    </div>
  );
};

export default CheckoutPage;
