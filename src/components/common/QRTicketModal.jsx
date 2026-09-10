import React, { useState, useEffect } from 'react';
import { X, QrCode, ShieldCheck, RefreshCw, Calendar, MapPin, Ticket, AlertCircle } from 'lucide-react';
import { formatEventDate, formatPrice } from '../../utils/formatters';

export const QRTicketModal = ({ isOpen, onClose, order }) => {
  const [secLeft, setSecLeft] = useState(60);

  useEffect(() => {
    if (!isOpen) return;
    setSecLeft(60);
    const interval = setInterval(() => {
      setSecLeft((prev) => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-purple-100 animate-scaleUp">
        {/* Ticket Top Purple Header */}
        <div className="bg-gradient-to-br from-purple-700 to-indigo-800 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 mb-2 text-purple-200 text-xs font-semibold">
            <Ticket className="w-4 h-4" />
            <span>DROPICK SMART TICKET</span>
          </div>

          <h3 className="font-bold text-lg leading-snug line-clamp-2">
            {order.productTitle}
          </h3>

          <div className="mt-3 space-y-1 text-xs text-purple-100">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-300" />
              <span>{formatEventDate(order.eventDate)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-300" />
              <span>{order.venue}</span>
            </div>
          </div>
        </div>

        {/* Ticket Perforation Notch */}
        <div className="relative flex items-center justify-between px-3 -my-3 z-10">
          <div className="w-6 h-6 rounded-full bg-slate-950 -ml-6" />
          <div className="flex-1 border-b-2 border-dashed border-gray-200 mx-2" />
          <div className="w-6 h-6 rounded-full bg-slate-950 -mr-6" />
        </div>

        {/* QR Section */}
        <div className="p-6 text-center space-y-4">
          <div className="inline-block p-4 bg-purple-50/70 rounded-2xl border-2 border-purple-200 shadow-inner relative group">
            {/* SVG Simulated QR Code */}
            <svg viewBox="0 0 100 100" className="w-44 h-44 mx-auto">
              <rect width="100" height="100" fill="#FFFFFF" rx="4" />
              {/* Corner squares */}
              <rect x="10" y="10" width="24" height="24" fill="#6D28D9" rx="2" />
              <rect x="14" y="14" width="16" height="16" fill="#FFFFFF" rx="1" />
              <rect x="18" y="18" width="8" height="8" fill="#6D28D9" rx="1" />

              <rect x="66" y="10" width="24" height="24" fill="#6D28D9" rx="2" />
              <rect x="70" y="14" width="16" height="16" fill="#FFFFFF" rx="1" />
              <rect x="74" y="18" width="8" height="8" fill="#6D28D9" rx="1" />

              <rect x="10" y="66" width="24" height="24" fill="#6D28D9" rx="2" />
              <rect x="14" y="70" width="16" height="16" fill="#FFFFFF" rx="1" />
              <rect x="18" y="74" width="8" height="8" fill="#6D28D9" rx="1" />

              {/* Data pattern */}
              <rect x="40" y="14" width="6" height="6" fill="#4C1D95" />
              <rect x="50" y="14" width="6" height="12" fill="#4C1D95" />
              <rect x="40" y="26" width="16" height="6" fill="#4C1D95" />
              
              <rect x="14" y="40" width="12" height="6" fill="#4C1D95" />
              <rect x="30" y="40" width="6" height="6" fill="#4C1D95" />
              <rect x="42" y="40" width="16" height="16" fill="#6D28D9" />
              <rect x="64" y="40" width="8" height="6" fill="#4C1D95" />
              <rect x="78" y="40" width="8" height="14" fill="#4C1D95" />

              <rect x="14" y="52" width="6" height="8" fill="#4C1D95" />
              <rect x="26" y="50" width="10" height="6" fill="#4C1D95" />

              <rect x="40" y="64" width="8" height="12" fill="#4C1D95" />
              <rect x="54" y="64" width="6" height="6" fill="#4C1D95" />
              <rect x="66" y="64" width="20" height="6" fill="#4C1D95" />
              <rect x="54" y="76" width="14" height="10" fill="#4C1D95" />
              <rect x="74" y="76" width="12" height="10" fill="#4C1D95" />
            </svg>

            {/* Dynamic Security Line Animation */}
            <div className="absolute left-6 right-6 top-6 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" />
          </div>

          {/* Seat details */}
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs">
            <span className="text-gray-500 block text-[11px]">배정 좌석</span>
            <span className="font-extrabold text-purple-700 text-sm">{order.seat || '자유석'}</span>
            <div className="mt-1 flex items-center justify-between text-[11px] text-gray-600 pt-1 border-t border-gray-200">
              <span>예매자: {order.buyerName}</span>
              <span>결제금액: {formatPrice(order.paidPrice)}</span>
            </div>
          </div>

          {/* Refresh Timer */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <RefreshCw className="w-3.5 h-3.5 text-purple-600 animate-spin" style={{ animationDuration: '4s' }} />
            <span>캡처 방지 보안코드 갱신까지 </span>
            <b className="text-purple-700 font-mono">{secLeft}초</b>
          </div>

          <div className="text-[11px] text-gray-400 bg-purple-50/50 p-2.5 rounded-lg flex items-start gap-1.5 text-left">
            <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <span>입장 게이트에서 스캐너에 위 QR 코드를 태그하여 즉시 입장하실 수 있습니다.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRTicketModal;
