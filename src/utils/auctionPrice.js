/**
 * Dutch Auction Pricing Engine Utility
 * Implements the core mathematical formulas from DROPICK system specification.
 */

/**
 * Calculate dynamic Dutch auction state for a given product at a specific timestamp.
 * 
 * @param {Object} product 
 * @param {number} currentTimeMs - Current timestamp in milliseconds (defaults to Date.now())
 * @returns {Object} Calculated auction state
 */
export const calculateAuctionState = (product, currentTimeMs = Date.now()) => {
  if (!product) return null;

  const {
    startPrice = 100000,
    minPrice = 40000,
    dropAmount = 5000,
    dropInterval = 600, // in seconds (e.g. 600s = 10m)
    auctionStartTime,
    auctionEndTime,
    status = 'ACTIVE'
  } = product;

  const startMs = new Date(auctionStartTime).getTime();
  const endMs = new Date(auctionEndTime).getTime();
  const dropIntervalMs = (dropInterval || 600) * 1000;

  // If already sold or manually marked
  if (status === 'SOLD') {
    return {
      status: 'SOLD',
      currentPrice: product.currentPrice || minPrice,
      isSold: true,
      isEnded: false,
      isScheduled: false,
      isActive: false,
      nextPrice: minPrice,
      remainingToNextDrop: 0,
      totalRemainingSec: 0,
      dropCount: 0,
      progressPercent: 100,
      isAtMinPrice: true,
    };
  }

  // Not started yet
  if (currentTimeMs < startMs) {
    const remainingToStart = Math.max(0, Math.floor((startMs - currentTimeMs) / 1000));
    return {
      status: 'SCHEDULED',
      currentPrice: startPrice,
      isSold: false,
      isEnded: false,
      isScheduled: true,
      isActive: false,
      nextPrice: Math.max(minPrice, startPrice - dropAmount),
      remainingToNextDrop: remainingToStart,
      totalRemainingSec: Math.floor((endMs - currentTimeMs) / 1000),
      dropCount: 0,
      progressPercent: 0,
      isAtMinPrice: false,
    };
  }

  // Ended
  if (currentTimeMs >= endMs || status === 'ENDED') {
    return {
      status: 'ENDED',
      currentPrice: minPrice,
      isSold: false,
      isEnded: true,
      isScheduled: false,
      isActive: false,
      nextPrice: minPrice,
      remainingToNextDrop: 0,
      totalRemainingSec: 0,
      dropCount: Math.floor((endMs - startMs) / dropIntervalMs),
      progressPercent: 100,
      isAtMinPrice: true,
    };
  }

  // Active Dutch Auction
  const elapsedMs = currentTimeMs - startMs;
  const dropCount = Math.floor(elapsedMs / dropIntervalMs);
  const calculatedPrice = Math.max(minPrice, startPrice - (dropCount * dropAmount));
  const isAtMinPrice = calculatedPrice <= minPrice;

  // Next Drop Calculation
  const nextDropPrice = isAtMinPrice ? minPrice : Math.max(minPrice, calculatedPrice - dropAmount);
  const msIntoCurrentInterval = elapsedMs % dropIntervalMs;
  const remainingToNextDrop = isAtMinPrice ? 0 : Math.max(0, Math.floor((dropIntervalMs - msIntoCurrentInterval) / 1000));
  const totalRemainingSec = Math.max(0, Math.floor((endMs - currentTimeMs) / 1000));

  // Progress percentage (0% at startPrice, 100% at minPrice)
  const priceRange = Math.max(1, startPrice - minPrice);
  const droppedAmount = startPrice - calculatedPrice;
  const progressPercent = Math.min(100, Math.max(0, Math.round((droppedAmount / priceRange) * 100)));

  return {
    status: 'ACTIVE',
    currentPrice: calculatedPrice,
    isSold: false,
    isEnded: false,
    isScheduled: false,
    isActive: true,
    nextPrice: nextDropPrice,
    remainingToNextDrop,
    totalRemainingSec,
    dropCount,
    progressPercent,
    isAtMinPrice,
  };
};

/**
 * Generate full simulation schedule table for Admin / Preview
 */
export const generatePriceSchedule = (config) => {
  const {
    startPrice = 100000,
    minPrice = 40000,
    dropAmount = 5000,
    dropInterval = 600, // seconds
    auctionStartTime = new Date().toISOString(),
    auctionEndTime
  } = config;

  const startMs = new Date(auctionStartTime).getTime();
  const endMs = auctionEndTime ? new Date(auctionEndTime).getTime() : startMs + 24 * 3600 * 1000;
  const intervalMs = dropInterval * 1000;

  const steps = [];
  let currentPrice = startPrice;
  let currentMs = startMs;
  let stepIndex = 0;

  while (currentMs <= endMs && currentPrice >= minPrice) {
    steps.push({
      step: stepIndex,
      time: new Date(currentMs).toISOString(),
      price: currentPrice,
      isMin: currentPrice === minPrice
    });

    if (currentPrice === minPrice) break;

    stepIndex++;
    currentMs += intervalMs;
    currentPrice = Math.max(minPrice, currentPrice - dropAmount);
  }

  return steps;
};
