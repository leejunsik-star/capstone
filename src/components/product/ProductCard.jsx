import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, MapPin, Ticket, Zap } from 'lucide-react';
import { useDutchAuction } from '../../hooks/useDutchAuction';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice, formatEventDate } from '../../utils/formatters';
import { ProductStatusBadge } from '../common/StatusBadge';
import AuctionTimer from '../auction/AuctionTimer';
import PriceProgress from '../auction/PriceProgress';
import PriceLiveIndicator from '../auction/PriceLiveIndicator';

export const ProductCard = ({ product }) => {
  const auction = useDutchAuction(product);
  const { isWishlisted, toggleWishlist } = useWishlist();

  if (!product || !auction) return null;

  const {
    currentPrice,
    nextPrice,
    remainingToNextDrop,
    progressPercent,
    isAtMinPrice,
    status,
    hasPriceDropped,
  } = auction;

  const wished = isWishlisted(product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col flex-1"
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/10">
            {product.categoryLabel || product.category}
          </span>

          <button
            onClick={handleWishlistClick}
            aria-label="찜하기 토글"
            className="pointer-events-auto p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-white hover:text-red-500 text-white transition active:scale-90"
          >
            <Heart className={`w-4 h-4 ${wished ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Bottom Thumbnail Overlay: Drop Indicator & Seat Info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <PriceLiveIndicator
            startPrice={product.startPrice}
            currentPrice={currentPrice}
            hasPriceDropped={hasPriceDropped}
          />
          {product.remainingSeats !== undefined && (
            <span className="text-[11px] font-semibold bg-purple-600/90 backdrop-blur-xs px-2 py-0.5 rounded-md">
              잔여 {product.remainingSeats}석
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        {/* Title & Info */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-purple-700 font-semibold">{product.seatGrade}</span>
            <ProductStatusBadge status={status} />
          </div>

          <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-1 group-hover:text-purple-700 transition">
            {product.title}
          </h3>

          <div className="space-y-0.5 text-xs text-gray-500">
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{formatEventDate(product.eventDate)}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{product.venue}</span>
            </div>
          </div>
        </div>

        {/* Price & Countdown Section */}
        <div className="pt-3 border-t border-gray-100 space-y-2.5">
          {/* Price Strip */}
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] text-gray-400 block line-through">
                시작가 {formatPrice(product.startPrice)}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-bold text-purple-600">현재가</span>
                <span
                  className={`text-xl font-black text-gray-900 tracking-tight transition-colors ${
                    hasPriceDropped ? 'text-purple-600 animate-price-pulse' : ''
                  }`}
                >
                  {formatPrice(currentPrice)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-gray-400 block">최저 보장가</span>
              <span className="text-xs font-bold text-gray-600">{formatPrice(product.minPrice)}</span>
            </div>
          </div>

          {/* Next Drop Timer */}
          <div className="bg-purple-50/70 rounded-xl p-2 border border-purple-100 flex items-center justify-between">
            <AuctionTimer
              remainingSeconds={remainingToNextDrop}
              nextPrice={nextPrice}
              isAtMinPrice={isAtMinPrice}
              variant="compact"
            />
          </div>

          {/* Progress Bar */}
          <PriceProgress
            startPrice={product.startPrice}
            currentPrice={currentPrice}
            minPrice={product.minPrice}
            progressPercent={progressPercent}
            variant="default"
          />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
