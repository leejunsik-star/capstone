import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import { OrderStatusBadge } from '../../components/common/StatusBadge';
import { formatPrice, formatEventDate } from '../../utils/formatters';
import { CreditCard, RotateCcw, ShieldCheck, Search, CheckCircle2 } from 'lucide-react';

export const AdminPaymentsPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleOrdersChange = () => loadData();
    window.addEventListener('dropick_orders_changed', handleOrdersChange);
    return () => window.removeEventListener('dropick_orders_changed', handleOrdersChange);
  }, []);

  const handleRefund = async (orderId) => {
    if (window.confirm(`주문번호 '${orderId}'에 연결된 토스 결제건을 즉시 환불하시겠습니까?`)) {
      await paymentService.refundPayment(orderId, '관리자 토스 결제 취소');
      loadData();
      alert('토스페이먼츠 결제 취소 및 환불이 정상 처리되었습니다.');
    }
  };

  const filtered = orders.filter((o) =>
    !search ||
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    (o.paymentKey && o.paymentKey.toLowerCase().includes(search.toLowerCase())) ||
    o.buyerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-600" />
            <span>결제 및 환불 관리 (Toss Payments)</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            토스페이먼츠 승인 트랜잭션, 결제 수단 및 환불 취소 요청을 관리합니다.
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            placeholder="주문번호, PaymentKey, 회원명 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-white text-xs rounded-xl border border-gray-200 outline-hidden focus:border-purple-600 shadow-xs"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase text-[11px]">
                <th className="py-3.5 px-5">주문번호</th>
                <th className="py-3.5 px-4">토스 결제키 (PaymentKey)</th>
                <th className="py-3.5 px-4">회원명</th>
                <th className="py-3.5 px-4">결제 수단</th>
                <th className="py-3.5 px-4 text-right">결제 금액</th>
                <th className="py-3.5 px-4 text-center">결제 상태</th>
                <th className="py-3.5 px-5 text-right">환불 관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-purple-50/30 transition">
                  <td className="py-4 px-5 font-mono font-bold text-gray-900">
                    {ord.id}
                  </td>
                  <td className="py-4 px-4 font-mono text-[11px] text-purple-700">
                    {ord.paymentKey || 'toss_pay_simulated_key'}
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-700">
                    {ord.buyerName}
                  </td>
                  <td className="py-4 px-4 text-gray-600 font-medium">
                    {ord.paymentMethod || '토스페이'}
                  </td>
                  <td className="py-4 px-4 text-right font-black text-gray-900">
                    {formatPrice(ord.paidPrice)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <OrderStatusBadge status={ord.status} />
                  </td>
                  <td className="py-4 px-5 text-right">
                    {ord.status === 'PAID' ? (
                      <button
                        onClick={() => handleRefund(ord.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>환불 처리</span>
                      </button>
                    ) : (
                      <span className="text-gray-400 text-[11px]">처리 완료</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentsPage;
