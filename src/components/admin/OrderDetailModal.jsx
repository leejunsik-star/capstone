import React from 'react';
import { X, ShoppingBag, User, CreditCard, Calendar, MapPin, Ticket, ShieldCheck, RotateCcw } from 'lucide-react';
import { formatPrice, formatEventDate } from '../../utils/formatters';
import { OrderStatusBadge } from '../common/StatusBadge';

export const OrderDetailModal = ({ isOpen, onClose, order, onRefund }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-4 bg-purple-50 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-600 text-white rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">주문 및 결제 상세 정보</h3>
              <p className="text-xs text-purple-700 font-mono">{order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Status & Price Banner */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 block">주문 상태</span>
              <div className="mt-1">
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block">최종 결제 금액</span>
              <span className="text-xl font-black text-purple-700">{formatPrice(order.paidPrice)}</span>
              {order.savedPrice > 0 && (
                <span className="text-[10px] text-emerald-600 block font-semibold">
                  (시작가 대비 {formatPrice(order.savedPrice)} 절약)
                </span>
              )}
            </div>
          </div>

          {/* Ticket Information */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-purple-600" />
              티켓 상품 정보
            </h4>
            <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-100 space-y-2 text-xs">
              <p className="font-bold text-gray-900 text-sm">{order.productTitle}</p>
              <div className="grid grid-cols-2 gap-2 text-gray-600">
                <div>
                  <span className="text-gray-400 block text-[11px]">공연 일시</span>
                  <span>{formatEventDate(order.eventDate)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">공연 장소</span>
                  <span>{order.venue}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">배정 좌석</span>
                  <span className="font-bold text-purple-700">{order.seat || '자유석'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">좌석 등급</span>
                  <span>{order.seatGrade || '일반석'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Buyer & Payment Information */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-600" />
              구매자 및 결제 승인 정보
            </h4>
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2">
              <div className="grid grid-cols-2 gap-3 text-gray-700">
                <div>
                  <span className="text-gray-400 block text-[11px]">구매자 성함</span>
                  <span className="font-semibold">{order.buyerName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">연락처</span>
                  <span>{order.buyerPhone}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">이메일</span>
                  <span>{order.buyerEmail}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">결제 수단</span>
                  <span className="font-semibold">{order.paymentMethod || '토스페이'}</span>
                </div>
              </div>

              {order.paymentKey && (
                <div className="pt-2 border-t border-gray-200 text-[11px]">
                  <span className="text-gray-400 block">토스페이먼츠 승인 키 (PaymentKey)</span>
                  <span className="font-mono text-purple-700">{order.paymentKey}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div>
            {order.status === 'PAID' && (
              <button
                onClick={() => onRefund(order.id)}
                className="px-3.5 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                관리자 즉시 환불 처리
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
