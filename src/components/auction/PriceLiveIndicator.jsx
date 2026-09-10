import React from 'react';
import { TrendingDown, Sparkles } from 'lucide-react';
import { calculateDropPercent } from '../../utils/formatters';

export const PriceLiveIndicator = ({ startPrice, currentPrice, hasPriceDropped = false }) => {
  const percent = calculateDropPercent(startPrice, currentPrice);

  if (percent <= 0) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-black transition-all duration-300 ${
        hasPriceDropped
          ? 'bg-rose-500 text-white scale-110 shadow-lg shadow-rose-500/30'
          : 'bg-rose-50 text-rose-600 border border-rose-200'
      }`}
    >
      <TrendingDown className="w-3 h-3 animate-bounce" />
      <span>-{percent}% DROP</span>
    </span>
  );
};

export default PriceLiveIndicator;
