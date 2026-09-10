import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingDown,
  Clock,
  Zap,
  AlertTriangle,
  ShieldCheck,
  Flame,
  ArrowDownRight,
  Info
} from 'lucide-react';
import { formatPrice, formatSecondsToTimer, formatInterval } from '../../utils/formatters';
import AuctionTimer from './AuctionTimer';
import PriceProgress from './PriceProgress';
import PriceLiveIndicator from './PriceLiveIndicator';

export const DutchAuctionPanel = ({ product, auctionState, onBuyClick }) => {
  const navigate = useNavigate();

  if (!product || !auctionState) return null;

  const {
    currentPrice,
    nextPrice,
    remainingToNextDrop,
    totalRemainingSec,
    progressPercent,
    isAtMinPrice,
    status,
    hasPriceDropped,
  } = auctionState;

  const isSold = status === 'SOLD' || (product.remainingSeats !== undefined && product.remainingSeats <= 0);
  const isEnded = status === 'ENDED';
  const isScheduled = status === 'SCHEDULED';
  const canBuy = !isSold && !isEnded && !isScheduled;

  const formattedTotalRemaining = formatSecondsToTimer(totalRemainingSec);

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-500/30 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header Badge */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              실시간 더치옥션 (Dutch Auction)
            </span>
            <PriceLiveIndicator
              startPrice={product.startPrice}
              currentPrice={currentPrice}
              hasPriceDropped={hasPriceDropped}
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>경매 마감: </span>
            <span className="font-mono text-slate-200 font-semibold">{formattedTotalRemaining}</span>
          </div>
        </div>

        {/* Big Live Price Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Current Price Box */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                현재 구매 가능 가격
              </span>
              {hasPriceDropped && (
                <span className="text-xs font-bold text-rose-400 animate-bounce">
                  🔻 가격 하락 완료!
                </span>
              )}
            </div>
            <div
              className={`text-4xl sm:text-5xl font-black tracking-tight text-white transition-all duration-300 ${
                hasPriceDropped ? 'scale-105 text-purple-400' : ''
              }`}
            >
              {formatPrice(currentPrice)}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 pt-1">
              <span className="line-through text-slate-500">
                시작가 {formatPrice(product.startPrice)}
              </span>
              <span className="text-emerald-400 font-semibold">
                {formatPrice(product.startPrice - currentPrice)} 절약 중
              </span>
            </div>
          </div>

          {/* Next Drop Countdown Clock */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80">
            <AuctionTimer
              remainingSeconds={remainingToNextDrop}
              nextPrice={nextPrice}
              isAtMinPrice={isAtMinPrice}
              variant="large"
              label="다음 가격 하락까지 남은 시간"
            />
            {!isAtMinPrice && (
              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">하락 예정가</span>
                <span className="text-purple-300 font-bold flex items-center gap-1">
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                  {formatPrice(nextPrice)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Drop Rules & Stats Strip */}
        <div className="grid grid-cols-3 gap-3 bg-slate-950/50 rounded-2xl p-3.5 border border-slate-800 text-center text-xs">
          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">하락 주기</span>
            <b className="text-slate-200">{formatInterval(product.dropInterval || 600)}</b>
          </div>
          <div className="border-x border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-0.5">1회 하락 금액</span>
            <b className="text-purple-300">-{formatPrice(product.dropAmount || 5000)}</b>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">최저 한계 가격</span>
            <b className="text-rose-300">{formatPrice(product.minPrice || 40000)}</b>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <PriceProgress
            startPrice={product.startPrice}
            currentPrice={currentPrice}
            minPrice={product.minPrice}
            progressPercent={progressPercent}
            variant="detailed"
          />
        </div>

        {/* Urgency warning banner */}
        <div className="bg-amber-500/15 border border-amber-500/30 rounded-2xl p-3.5 flex items-start gap-3 text-amber-200 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <b className="text-amber-300 font-bold block">
              가격은 계속 내려가지만 다른 사용자가 먼저 구매할 수 있습니다.
            </b>
            <p className="text-[11px] text-amber-200/80 leading-relaxed">
              더치옥션 특성상 가장 먼저 결제한 1명에게 티켓이 배정되며, 실시간으로 품절될 수 있습니다.
            </p>
          </div>
        </div>

        {/* Big CTA Action Button */}
        <div>
          {canBuy ? (
            <button
              onClick={onBuyClick}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 transform active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Zap className="w-5 h-5 text-amber-300 group-hover:animate-bounce" />
              <span>지금 구매하기 ({formatPrice(currentPrice)})</span>
            </button>
          ) : isSold ? (
            <button
              disabled
              className="w-full py-4 px-6 rounded-2xl bg-slate-800 text-slate-500 font-bold text-base cursor-not-allowed border border-slate-700"
            >
              다른 사용자가 먼저 구매하여 판매 완료되었습니다
            </button>
          ) : isScheduled ? (
            <button
              disabled
              className="w-full py-4 px-6 rounded-2xl bg-slate-800 text-blue-300 font-bold text-base cursor-not-allowed border border-blue-900/50"
            >
              경매 시작 대기 중인 상품입니다
            </button>
          ) : (
            <button
              disabled
              className="w-full py-4 px-6 rounded-2xl bg-slate-800 text-red-400 font-bold text-base cursor-not-allowed border border-red-900/50"
            >
              경매가 종료된 티켓입니다
            </button>
          )}
        </div>

        {/* Escrow & Trust Footer */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            토스페이먼츠 100% 안전결제
          </span>
          <span>•</span>
          <span>모바일 QR 즉시 발권</span>
          <span>•</span>
          <span>공식 인증 판매자</span>
        </div>
      </div>
    </div>
  );
};

export default DutchAuctionPanel;
