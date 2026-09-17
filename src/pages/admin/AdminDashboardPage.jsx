import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { settlementService } from '../../services/settlementService';
import KPICard from '../../components/admin/KPICard';
import { ProductStatusBadge, OrderStatusBadge } from '../../components/common/StatusBadge';
import { formatPrice, formatEventDate, formatSecondsToTimer } from '../../utils/formatters';
import {
  DollarSign,
  ShoppingBag,
  Package,
  CheckCircle2,
  Users,
  Flame,
  ArrowRight,
  TrendingDown,
  Clock,
  Plus,
  Banknote,
  BadgeCheck
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await adminService.getDashboardKPIs();
      setMetrics(data);

      const settlementData = await settlementService.getSettlements();
      setSettlements(Array.isArray(settlementData) ? settlementData : []);
    } catch (err) {
      console.error('Failed to load admin metrics', err);
      // API 없어도 기본값으로 렌더링
      setMetrics({
        todaySales: 0,
        todayOrdersCount: 0,
        activeAuctionsCount: 0,
        endingSoonCount: 0,
        soldTicketsCount: 0,
        totalMembersCount: 0,
        recentOrders: [],
        activeAuctions: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleStorageChange = () => loadData();
    window.addEventListener('dropick_products_changed', handleStorageChange);
    window.addEventListener('dropick_orders_changed', handleStorageChange);
    return () => {
      window.removeEventListener('dropick_products_changed', handleStorageChange);
      window.removeEventListener('dropick_orders_changed', handleStorageChange);
    };
  }, []);

  if (loading || !metrics) {
    return (
      <div className="p-8 text-center text-gray-500 text-xs">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        대시보드 지표를 불러오는 중입니다...
      </div>
    );
  }

  // Calculate settlement summaries
  const pendingSettlements = settlements.filter(s => s.status === 'SETTLEMENT_PENDING');
  const pendingTotal = pendingSettlements.reduce((sum, s) => sum + s.sellerSettlementAmount, 0);
  const doneSettlements = settlements.filter(s => s.status === 'SETTLEMENT_DONE');
  const doneTotal = doneSettlements.reduce((sum, s) => sum + s.sellerSettlementAmount, 0);

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Top KPI Metric Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="오늘 결제 금액"
          value={formatPrice(metrics.todaySales)}
          trend="어제 대비 10.2% ↑"
          icon={DollarSign}
          color="purple"
        />
        <KPICard
          title="오늘 주문 건수"
          value={`${metrics.todayOrdersCount}건`}
          trend="어제 대비 15.4% ↑"
          icon={ShoppingBag}
          color="blue"
        />
        <KPICard
          title="진행 중 경매"
          value={`${metrics.activeAuctionsCount}개`}
          subtext={`종료 예정 ${metrics.endingSoonCount}개`}
          icon={Flame}
          color="amber"
        />
        <KPICard
          title="판매 완료"
          value={`${metrics.soldTicketsCount}건`}
          trend="어제 대비 12.5% ↑"
          icon={CheckCircle2}
          color="emerald"
        />
        <KPICard
          title="전체 회원 수"
          value={`${metrics.totalMembersCount.toLocaleString()}명`}
          trend="어제 대비 8.7% ↑"
          icon={Users}
          color="indigo"
        />
      </div>

      {/* 2. C2C 정산 현황 섹션 */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <Banknote className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-gray-900 text-base">💳 C2C 판매자 정산 현황</h3>
              <p className="text-xs text-gray-500">구매자가 수령 확인 시 판매자에게 자동 정산(입금)됩니다. (수수료 3% 제외)</p>
            </div>
          </div>
          <div className="flex gap-4 text-right">
            <div>
              <span className="text-[10px] text-gray-400 font-bold block">정산 대기 합계 (수령 확인 전)</span>
              <span className="text-lg font-black text-amber-600">{formatPrice(pendingTotal)}</span>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold block">오늘 정산 완료 금액</span>
              <span className="text-lg font-black text-emerald-600">{formatPrice(doneTotal)}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-semibold bg-gray-50">
                <th className="py-2.5 px-3 rounded-tl-lg">주문번호</th>
                <th className="py-2.5 px-3">상품명</th>
                <th className="py-2.5 px-3 text-center">구매자</th>
                <th className="py-2.5 px-3 text-center">판매자</th>
                <th className="py-2.5 px-3 text-right">결제 금액</th>
                <th className="py-2.5 px-3 text-right">수수료 (3%)</th>
                <th className="py-2.5 px-3 text-right text-emerald-700 font-bold">판매자 정산액 (97%)</th>
                <th className="py-2.5 px-3 text-center rounded-tr-lg">정산 상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {settlements.map((item) => (
                <tr key={item.orderId} className="hover:bg-gray-50/50 transition">
                  <td className="py-3 px-3 font-mono text-[10px] text-gray-500">{item.orderId}</td>
                  <td className="py-3 px-3 font-bold text-gray-800 line-clamp-1">{item.productTitle}</td>
                  <td className="py-3 px-3 text-center text-gray-600">{item.buyerName}</td>
                  <td className="py-3 px-3 text-center text-purple-700 font-bold">{item.sellerName}</td>
                  <td className="py-3 px-3 text-right text-gray-600">{formatPrice(item.paidPrice)}</td>
                  <td className="py-3 px-3 text-right text-rose-500 text-[11px]">- {formatPrice(item.platformFee)}</td>
                  <td className="py-3 px-3 text-right font-black text-gray-900">{formatPrice(item.sellerSettlementAmount)}</td>
                  <td className="py-3 px-3 text-center">
                    {item.status === 'SETTLEMENT_DONE' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                        <BadgeCheck className="w-3 h-3" /> 정산 완료
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px]">
                        <Clock className="w-3 h-3" /> 정산 대기
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {settlements.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-400">결제/정산 내역이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Main Tables Grid: Live Auctions (Left) & Recent Orders (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 진행 중 경매 목록 (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                <Flame className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-gray-900 text-base">진행 중 경매 모니터링</h3>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/admin/products/new"
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>상품 수동 등록</span>
              </Link>
              <Link
                to="/admin/products"
                className="text-xs text-purple-600 font-bold hover:underline"
              >
                전체 모니터링 &gt;
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                  <th className="pb-3">상품명</th>
                  <th className="pb-3 text-right">시작가</th>
                  <th className="pb-3 text-right">현재가</th>
                  <th className="pb-3 text-center">하락 금액</th>
                  <th className="pb-3 text-center">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {metrics.activeAuctions.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.imageUrl}
                          alt={prod.title}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-gray-900 leading-tight line-clamp-1">{prod.title}</p>
                          <span className="text-[11px] text-gray-400">{prod.venue}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-right font-medium text-gray-400 line-through">
                      {formatPrice(prod.startPrice)}
                    </td>
                    <td className="py-3.5 text-right font-bold text-purple-700">
                      {formatPrice(prod.currentPrice || prod.startPrice)}
                    </td>
                    <td className="py-3.5 text-center text-[11px] text-rose-500 font-semibold">
                      ▼ {formatPrice(prod.dropAmount || 5000)}
                    </td>
                    <td className="py-3.5 text-center">
                      <ProductStatusBadge status={prod.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: 최근 주문 내역 (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <ShoppingBag className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-gray-900 text-base">최근 주문 내역</h3>
            </div>

            <Link
              to="/admin/orders"
              className="text-xs text-purple-600 font-bold hover:underline"
            >
              전체보기 &gt;
            </Link>
          </div>

          <div className="space-y-3">
            {metrics.recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-center justify-between gap-3 hover:bg-purple-50/50 hover:border-purple-200 transition"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-400 font-mono block">
                    주문번호: {ord.id} · {ord.orderDate ? ord.orderDate.slice(11, 16) : '11:23'}
                  </span>
                  <p className="font-bold text-gray-900 text-xs line-clamp-1">{ord.productTitle}</p>
                  <span className="text-[11px] text-purple-700 font-semibold">
                    {formatPrice(ord.paidPrice)}
                  </span>
                </div>

                <OrderStatusBadge status={ord.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
