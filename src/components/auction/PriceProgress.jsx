import React from 'react';
import { formatPrice } from '../../utils/formatters';
import { TrendingDown } from 'lucide-react';

export const PriceProgress = ({
  startPrice,
  currentPrice,
  minPrice,
  progressPercent = 0,
  variant = 'default', // 'default' | 'detailed'
}) => {
  const safePercent = Math.min(100, Math.max(0, progressPercent));

  if (variant === 'detailed') {
    return (
      <div className="space-y-2">
        {/* Top Labels */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <div className="flex flex-col">
            <span className="text-[11px] text-gray-400">시작가</span>
            <span className="text-gray-700">{formatPrice(startPrice)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-purple-600 font-bold flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3" /> 하락 진행률 {safePercent}%
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[11px] text-gray-400">최저 보장가</span>
            <span className="text-purple-700 font-bold">{formatPrice(minPrice)}</span>
          </div>
        </div>

        {/* Progress Track */}
        <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-rose-500 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${safePercent}%` }}
          />
        </div>

        {/* Bottom Current Pointer */}
        <div className="flex justify-between text-[11px] text-gray-400">
          <span>경매 시작</span>
          <span className="text-purple-700 font-semibold">
            현재 {formatPrice(currentPrice)} ({safePercent}% 할인율 도달)
          </span>
          <span>마감 한계가</span>
        </div>
      </div>
    );
  }

  // Compact bar for cards
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
        <span>하락 진행도</span>
        <span className="text-purple-700 font-bold">{safePercent}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-300"
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
};

export default PriceProgress;
