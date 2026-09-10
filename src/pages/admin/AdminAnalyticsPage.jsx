import React from 'react';
import { BarChart3, TrendingUp, DollarSign, PieChart, Users, Zap } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export const AdminAnalyticsPage = () => {
  const categoryStats = [
    { category: '콘서트', sales: 6850000, count: 54, dropRate: '42%' },
    { category: '뮤지컬', sales: 3420000, count: 28, dropRate: '38%' },
    { category: '스포츠', sales: 1890000, count: 19, dropRate: '45%' },
    { category: '전시', sales: 640000, count: 42, dropRate: '52%' },
    { category: '연극', sales: 420000, count: 18, dropRate: '48%' },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-600" />
          <span>통계 및 매출 분석 (Analytics)</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          카테고리별 더치옥션 낙찰 성향 및 가격 하락 속도, 전체 플랫폼 매출 통계입니다.
        </p>
      </div>

      {/* Grid of charts and metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Revenue Table & Bar */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-purple-600" />
              <span>카테고리별 경매 매출 비중</span>
            </h3>
            <span className="text-xs text-purple-600 font-bold">총 ₩13,220,000</span>
          </div>

          <div className="space-y-3">
            {categoryStats.map((item) => (
              <div key={item.category} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-800">{item.category} ({item.count}건)</span>
                  <span className="text-purple-700">{formatPrice(item.sales)}</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                    style={{ width: `${(item.sales / 6850000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dutch Auction Velocity & Efficiency */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>더치옥션 낙찰 효율 지표</span>
          </h3>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-1">
              <span className="text-xs text-purple-700 font-medium">평균 낙찰 하락률</span>
              <p className="text-2xl font-black text-purple-900">41.8%</p>
              <span className="text-[10px] text-purple-600">시작가 대비 평균 할인</span>
            </div>

            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-1">
              <span className="text-xs text-indigo-700 font-medium">평균 체결 소요시간</span>
              <p className="text-2xl font-black text-indigo-900">38분</p>
              <span className="text-[10px] text-indigo-600">경매 시작 후 체결까지</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-600 space-y-1">
            <b className="text-gray-900 block">💡 플랫폼 분석 인사이트</b>
            <p className="text-[11px] leading-relaxed">
              콘서트와 스포츠 카테고리는 시작 후 2~3단계 하락 시점에서 85% 이상 즉시 매진되며,
              전시 및 연극 상품은 최저가에 근접할수록 구매 전환율이 3.2배 급증합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
