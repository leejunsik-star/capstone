import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { orderService } from '../../services/orderService';
import QRTicketModal from '../../components/common/QRTicketModal';
import { formatPrice, formatEventDate } from '../../utils/formatters';
import {
  CheckCircle2,
  QrCode,
  Calendar,
  MapPin,
  Ticket,
  ArrowRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

export const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7C3AED', '#4F46E5', '#EC4899', '#38BDF8'],
      });
    } catch (e) {
      // confetti fallback safe
    }

    const loadOrder = async () => {
      if (orderId) {
        const data = await orderService.getOrderById(orderId);
        setOrder(data);
      }
      setLoading(false);
    };

    loadOrder();
  }, [orderId]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      {/* Success Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl text-center space-y-6">
        {/* Animated Check Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-scaleUp">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
            더치옥션 낙찰 및 결제 완료
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            티켓 구매가 완료되었습니다!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            주문번호: <b className="text-purple-700 font-mono">{orderId || 'ORD-20260902-1082'}</b>
          </p>
        </div>

        {/* Order details summary if loaded */}
        {order && (
          <div className="bg-purple-50/50 rounded-2xl p-5 border border-purple-100 text-left space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-purple-100">
              <Ticket className="w-4 h-4 text-purple-600" />
              <span className="font-bold text-xs text-purple-900">{order.productTitle}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-gray-700">
              <div>
                <span className="text-gray-400 block text-[11px]">공연 일시</span>
                <span className="font-medium">{formatEventDate(order.eventDate)}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">공연 장소</span>
                <span className="font-medium">{order.venue}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">배정 좌석</span>
                <span className="font-bold text-purple-700">{order.seat}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">최종 결제 금액</span>
                <span className="font-bold text-gray-900">{formatPrice(order.paidPrice)}</span>
              </div>
            </div>

            {order.savedPrice > 0 && (
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center justify-between">
                <span>더치옥션 가격 하락 절약 혜택:</span>
                <span>+{formatPrice(order.savedPrice)} 할인</span>
              </div>
            )}
          </div>
        )}

        {/* Big QR Button */}
        <div className="pt-2">
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-purple-600/25 transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <QrCode className="w-5 h-5" />
            <span>모바일 QR 스마트 티켓 열기</span>
          </button>
          <p className="text-[11px] text-gray-400 mt-2">
            ※ 마이페이지의 '내 티켓'에서도 언제든지 QR 코드를 확인하실 수 있습니다.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-100">
          <Link
            to="/mypage"
            className="w-full sm:w-1/2 py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-xl border border-gray-200 transition flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>주문 및 예매내역 확인</span>
          </Link>
          <Link
            to="/"
            className="w-full sm:w-1/2 py-3 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 transition flex items-center justify-center gap-1.5"
          >
            <span>홈으로 이동</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* QR Ticket Modal */}
      {order && (
        <QRTicketModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          order={order}
        />
      )}
    </div>
  );
};

export default PaymentSuccessPage;
