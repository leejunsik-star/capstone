import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { OrderStatusBadge } from '../../components/common/StatusBadge';
import OrderDetailModal from '../../components/admin/OrderDetailModal';
import { formatPrice, formatEventDate } from '../../utils/formatters';
import {
  ShoppingBag,
  Search,
  Download,
  Calendar,
  Eye,
  CheckCircle2,
  RefreshCw,
  RotateCcw
} from 'lucide-react';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const handleOrdersChange = () => loadOrders();
    window.addEventListener('dropick_orders_changed', handleOrdersChange);
    return () => window.removeEventListener('dropick_orders_changed', handleOrdersChange);
  }, []);

  const handleRefund = async (orderId) => {
    if (window.confirm(`주문번호 '${orderId}' 건을 즉시 관리자 전액 환불 승인하시겠습니까?`)) {
      await orderService.cancelOrder(orderId, '관리자 즉시 환불');
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: 'REFUNDED' }));
      }
      alert('환불 처리가 완료되었습니다.');
    }
  };

  const handleExportCSV = () => {
    alert('전체 주문 및 결제 내역 엑셀(CSV) 파일 다운로드를 시작합니다.');
  };

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchSearch =
      !searchQuery ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.buyerName && o.buyerName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-purple-600" />
            <span>주문 및 예매 관리</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            더치옥션 낙찰 주문 내역, 구매자 정보 및 토스 결제 상태를 모니터링합니다.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold border border-gray-200 transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>엑셀 다운로드</span>
        </button>
      </div>

      {/* Filter Bar (Matches PDF Page 11 mockup) */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'ALL', label: '전체' },
            { id: 'PAID', label: '결제 완료' },
            { id: 'PENDING', label: '결제 대기' },
            { id: 'REFUNDED', label: '취소/환불' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="주문번호 / 회원명 / 상품명 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-gray-50 text-xs rounded-xl border border-gray-200 outline-hidden focus:border-purple-600"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase text-[11px]">
                <th className="py-3.5 px-5">주문번호</th>
                <th className="py-3.5 px-4">상품명</th>
                <th className="py-3.5 px-4">회원명</th>
                <th className="py-3.5 px-4">주문일시</th>
                <th className="py-3.5 px-4 text-right">결제금액</th>
                <th className="py-3.5 px-4 text-center">상태</th>
                <th className="py-3.5 px-5 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    주문 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-purple-50/30 transition">
                    <td className="py-4 px-5 font-mono font-bold text-purple-700">
                      {ord.id}
                    </td>
                    <td className="py-4 px-4 font-bold text-gray-900 max-w-xs truncate">
                      {ord.productTitle}
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-700">
                      {ord.buyerName}
                    </td>
                    <td className="py-4 px-4 text-gray-500">
                      {ord.orderDate ? ord.orderDate.slice(0, 16).replace('T', ' ') : '2026.09.02'}
                    </td>
                    <td className="py-4 px-4 text-right font-black text-gray-900">
                      {formatPrice(ord.paidPrice)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <OrderStatusBadge status={ord.status} />
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>상세보기</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
          onRefund={handleRefund}
        />
      )}
    </div>
  );
};

export default AdminOrdersPage;
