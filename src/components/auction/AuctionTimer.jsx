import React from 'react';
import { Clock, TrendingDown, AlertCircle } from 'lucide-react';
import { formatSecondsToTimer, formatPrice } from '../../utils/formatters';

export const AuctionTimer = ({
  remainingSeconds,
  nextPrice,
  isAtMinPrice,
  variant = 'compact', // 'compact' | 'badge' | 'large'
  label = '다음 가격 하락까지',
}) => {
  const formatted = formatSecondsToTimer(remainingSeconds);

  if (isAtMinPrice) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>최저 가격 도달 (마지막 구매 기회!)</span>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 shadow-xs">
        <Clock className="w-3.5 h-3.5 text-purple-600 animate-spin" style={{ animationDuration: '8s' }} />
        <span className="font-mono tracking-wider">{formatted}</span>
        {nextPrice !== undefined && (
          <span className="text-purple-900 font-normal">
            후 <b className="text-purple-700">{formatPrice(nextPrice)}</b>으로 하락
          </span>
        )}
      </div>
    );
  }

  if (variant === 'large') {
    const [hh, mm, ss] = formatted.split(':');
    return (
      <div className="space-y-1.5">
        <span className="text-xs text-purple-200 font-medium block">{label}</span>
        <div className="flex items-center gap-1 font-mono">
          <div className="bg-slate-900/90 border border-purple-500/40 text-white px-2.5 py-1.5 rounded-lg text-lg font-black shadow-inner">
            {hh}
          </div>
          <span className="text-purple-300 font-bold text-lg">:</span>
          <div className="bg-slate-900/90 border border-purple-500/40 text-white px-2.5 py-1.5 rounded-lg text-lg font-black shadow-inner">
            {mm}
          </div>
          <span className="text-purple-300 font-bold text-lg">:</span>
          <div className="bg-slate-900/90 border border-purple-500/40 text-white px-2.5 py-1.5 rounded-lg text-lg font-black shadow-inner text-amber-300 animate-pulse">
            {ss}
          </div>
        </div>
      </div>
    );
  }

  // Default compact format
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-700">
      <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
      <span className="font-mono bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">{formatted}</span>
      {nextPrice !== undefined && (
        <span className="text-slate-600 text-[11px]">
          후 {formatPrice(nextPrice)} 하락
        </span>
      )}
    </div>
  );
};

export default AuctionTimer;
