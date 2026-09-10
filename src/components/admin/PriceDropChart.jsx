import React from 'react';
import { generatePriceSchedule } from '../../utils/auctionPrice';
import { formatPrice, formatInterval, formatEventDate } from '../../utils/formatters';
import { TrendingDown, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const PriceDropChart = ({ config }) => {
  const schedule = generatePriceSchedule(config);

  const startPrice = Number(config.startPrice) || 100000;
  const minPrice = Number(config.minPrice) || 40000;
  const dropAmount = Number(config.dropAmount) || 5000;
  const dropInterval = Number(config.dropInterval) || 600;

  const totalSteps = Math.max(1, Math.ceil((startPrice - minPrice) / (dropAmount || 1)));
  const totalSecondsToMin = totalSteps * dropInterval;

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 border border-purple-500/30 space-y-5">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-600 text-white">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-purple-200">더치옥션 가격 하락 시뮬레이션</h4>
            <p className="text-[11px] text-slate-400">설정한 규칙에 따른 예상 가격 하락 궤적</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="bg-purple-950 text-purple-300 px-2.5 py-1 rounded-lg border border-purple-800">
            총 {totalSteps}단계 하락
          </span>
          <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
            최저가 도달: {formatInterval(totalSecondsToMin)} 후
          </span>
        </div>
      </div>

      {/* Visual SVG Price Step-down Chart */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-hidden">
        <div className="text-[11px] text-slate-400 mb-2 flex items-center justify-between">
          <span>시작가 {formatPrice(startPrice)}</span>
          <span className="text-purple-400 font-bold">계단식 가격 하락 곡선</span>
          <span>최저가 {formatPrice(minPrice)}</span>
        </div>

        <svg viewBox="0 0 500 120" className="w-full h-24 overflow-visible">
          {/* Background grid lines */}
          <line x1="0" y1="20" x2="500" y2="20" stroke="#334155" strokeDasharray="3,3" strokeWidth="0.5" />
          <line x1="0" y1="60" x2="500" y2="60" stroke="#334155" strokeDasharray="3,3" strokeWidth="0.5" />
          <line x1="0" y1="100" x2="500" y2="100" stroke="#334155" strokeDasharray="3,3" strokeWidth="0.5" />

          {/* Stepped line coordinates */}
          {(() => {
            const count = Math.min(schedule.length, 15);
            if (count <= 1) return null;

            const points = [];
            const stepW = 500 / (count - 1);

            for (let i = 0; i < count; i++) {
              const item = schedule[i];
              const ratio = (startPrice - item.price) / (startPrice - minPrice || 1);
              const y = 20 + ratio * 80;
              const x = i * stepW;

              if (i > 0) {
                const prevX = (i - 1) * stepW;
                const prevY = points[points.length - 1].y;
                points.push({ x, y: prevY, isStep: true });
              }
              points.push({ x, y, price: item.price });
            }

            const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

            return (
              <>
                {/* Area fill */}
                <path
                  d={`${pathD} L 500 120 L 0 120 Z`}
                  fill="url(#purpleGrad)"
                  opacity="0.3"
                />
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Line */}
                <path d={pathD} fill="none" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" />

                {/* Key dots */}
                {points.filter(p => !p.isStep).map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={i === 0 || i === count - 1 ? 5 : 3.5}
                    fill={i === count - 1 ? '#EF4444' : '#C084FC'}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                ))}
              </>
            );
          })()}
        </svg>
      </div>

      {/* Step-by-Step Timetable */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-300 block">하락 스케줄 타임라인</span>
        <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
          {schedule.slice(0, 10).map((step, idx) => (
            <div
              key={idx}
              className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between border ${
                step.isMin
                  ? 'bg-rose-950/40 border-rose-800 text-rose-200 font-bold'
                  : idx === 0
                  ? 'bg-purple-950/40 border-purple-800 text-purple-200 font-bold'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono">
                  {idx === 0 ? '시작' : step.isMin ? '최저' : `${idx}`}
                </span>
                <span className="text-[11px] text-slate-400">
                  {idx === 0 ? '경매 오픈 시점' : `+${formatInterval(idx * dropInterval)}`}
                </span>
              </div>

              <div className="flex items-center gap-3 font-mono">
                <span className="font-bold text-white">{formatPrice(step.price)}</span>
                {idx > 0 && (
                  <span className="text-[10px] text-rose-400">-{formatPrice(dropAmount)}</span>
                )}
              </div>
            </div>
          ))}

          {schedule.length > 10 && (
            <div className="text-center text-[11px] text-slate-500 py-1">
              ...외 {schedule.length - 10}단계 생략 (최저가 도달 시 유지)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceDropChart;
