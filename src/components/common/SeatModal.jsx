import React from 'react';
import { X, MapPin, Eye, CheckCircle2 } from 'lucide-react';

export const SeatModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-100 animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-purple-50/50">
          <div>
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <span>좌석 배치도 및 상세 정보</span>
            </h3>
            <p className="text-xs text-purple-700 font-medium">
              {product.venue} · {product.seatGrade}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Seat Card Highlight */}
          <div className="p-4 rounded-xl bg-purple-600 text-white shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs text-purple-200 font-medium block">예매 대상 좌석</span>
              <p className="text-xl font-extrabold tracking-wide">{product.seat}</p>
              <span className="text-xs text-purple-100 bg-purple-700/60 px-2 py-0.5 rounded-md mt-1 inline-block">
                {product.seatGrade}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-purple-200 block">잔여 수량</span>
              <p className="text-2xl font-black text-amber-300">
                {product.remainingSeats !== undefined ? `${product.remainingSeats}석` : '1석'}
              </p>
            </div>
          </div>

          {/* Seat Map Visual representation */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-slate-900 p-4 text-center">
            <div className="w-48 mx-auto py-1.5 bg-purple-500/30 border border-purple-400 text-purple-200 text-xs font-bold rounded-lg mb-6 uppercase tracking-widest shadow-inner">
              STAGE (무대)
            </div>

            {/* Simulated Seating Chart SVG */}
            <div className="relative py-4 flex flex-col items-center justify-center">
              <svg viewBox="0 0 400 200" className="w-full max-w-sm mx-auto">
                {/* Stage arc */}
                <path d="M 50 40 Q 200 10 350 40" fill="none" stroke="#A855F7" strokeWidth="4" strokeDasharray="6,4" />
                
                {/* VIP Zone */}
                <path d="M 90 70 Q 200 45 310 70" fill="none" stroke="#8B5CF6" strokeWidth="12" strokeLinecap="round" opacity="0.6" />
                <text x="200" y="74" fill="#DDD6FE" fontSize="10" fontWeight="bold" textAnchor="middle">VIP Zone (1층 전면)</text>

                {/* R Zone (Highlighted for current seat) */}
                <path d="M 60 110 Q 200 75 340 110" fill="none" stroke="#EC4899" strokeWidth="14" strokeLinecap="round" opacity="0.8" />
                <text x="200" y="114" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">★ 해당 티켓 구역 (E구역 14열)</text>

                {/* S Zone */}
                <path d="M 40 150 Q 200 105 360 150" fill="none" stroke="#64748B" strokeWidth="10" strokeLinecap="round" opacity="0.5" />
                <text x="200" y="154" fill="#CBD5E1" fontSize="10" textAnchor="middle">S Zone (2층/3층)</text>
              </svg>
            </div>

            <p className="text-[11px] text-slate-400 mt-2">
              ※ 실제 공연장 무대 시야 및 각도는 연출 상황에 따라 다소 상이할 수 있습니다.
            </p>
          </div>

          {/* Seat Features */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <b className="text-gray-800">무대 시야 확보</b>
                <p className="text-gray-500 text-[11px] mt-0.5">난간/기둥 시야 방해 없는 중앙 블록</p>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <b className="text-gray-800">음향 최적화 존</b>
                <p className="text-gray-500 text-[11px] mt-0.5">메인 PA 스피커 직관 입체 음향 구역</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            확인 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatModal;
