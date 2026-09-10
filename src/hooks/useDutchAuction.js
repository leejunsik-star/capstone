import { useState, useEffect, useRef } from 'react';
import { calculateAuctionState } from '../utils/auctionPrice';
import { getEffectiveCurrentTime } from '../services/mockStorage';

/**
 * Custom hook to run a real-time 1-second ticking Dutch Auction calculator for a product.
 */
export const useDutchAuction = (product) => {
  const [nowMs, setNowMs] = useState(getEffectiveCurrentTime());
  const prevPriceRef = useRef(product?.currentPrice || product?.startPrice);
  const [hasPriceDropped, setHasPriceDropped] = useState(false);

  useEffect(() => {
    // 1-second interval tick
    const interval = setInterval(() => {
      setNowMs(getEffectiveCurrentTime());
    }, 1000);

    // Listen to manual time simulation changes
    const handleTimeChange = () => {
      setNowMs(getEffectiveCurrentTime());
    };
    window.addEventListener('dropick_time_changed', handleTimeChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('dropick_time_changed', handleTimeChange);
    };
  }, []);

  const state = calculateAuctionState(product, nowMs);

  // Detect price drop event for animation triggers
  useEffect(() => {
    if (state && state.currentPrice < prevPriceRef.current) {
      setHasPriceDropped(true);
      const timer = setTimeout(() => setHasPriceDropped(false), 1200);
      prevPriceRef.current = state.currentPrice;
      return () => clearTimeout(timer);
    }
    if (state) {
      prevPriceRef.current = state.currentPrice;
    }
  }, [state?.currentPrice]);

  return {
    ...state,
    hasPriceDropped,
  };
};
