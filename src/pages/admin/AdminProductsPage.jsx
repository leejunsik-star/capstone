import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { ProductStatusBadge } from '../../components/common/StatusBadge';
import { formatPrice, formatEventDate, formatInterval } from '../../utils/formatters';
import {
  ShieldAlert,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  Clock,
  Eye,
  CheckCircle2,
  PowerOff,
  User,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    const handleProductsChange = () => loadProducts();
    window.addEventListener('dropick_products_changed', handleProductsChange);
    return () => window.removeEventListener('dropick_products_changed', handleProductsChange);
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`'${title}' 상품을 플랫폼에서 강제 삭제하시겠습니까?`)) {
      await productService.deleteProduct(id);
      loadProducts();
    }
  };

  const handleToggleStatus = async (prod) => {
    const isStopping = prod.status === 'ACTIVE';
    const msg = isStopping
      ? `'${prod.title}' 티켓의 판매를 즉시 중지(강제 마감) 처리하시겠습니까?`
      : `'${prod.title}' 티켓 경매를 다시 활성화하시겠습니까?`;

    if (window.confirm(msg)) {
      const nextStatus = isStopping ? 'ENDED' : 'ACTIVE';
      await productService.updateProduct(prod.id, { ...prod, status: nextStatus });
      loadProducts();
      alert(isStopping ? '판매 중지 처리가 완료되었습니다.' : '경매가 다시 진행 중으로 변경되었습니다.');
    }
  };

  const filtered = products.filter((p) => {
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sellerName && p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-purple-600" />
            <span>등록 상품 모니터링 & 검수 관리</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            일반 회원(판매자)이 등록한 더치옥션 티켓을 실시간 모니터링하고, 허위/부적절 상품에 대해 판매 중지 조치를 취합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/sell"
            className="px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>+ 사용자 판매 등록 테스트</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'ALL', label: '전체' },
            { id: 'ACTIVE', label: '진행 중' },
            { id: 'SCHEDULED', label: '예정' },
            { id: 'SOLD', label: '판매 완료' },
            { id: 'ENDED', label: '종료/중지' },
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
            placeholder="상품명, 공연장, 판매자명 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-gray-50 text-xs rounded-xl border border-gray-200 outline-hidden focus:border-purple-600"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase text-[11px]">
                <th className="py-3.5 px-5">등록 상품명 / 공연장</th>
                <th className="py-3.5 px-4">등록 판매자</th>
                <th className="py-3.5 px-4">카테고리</th>
                <th className="py-3.5 px-4 text-right">시작가</th>
                <th className="py-3.5 px-4 text-right">현재가</th>
                <th className="py-3.5 px-4 text-center">하락 규칙</th>
                <th className="py-3.5 px-4 text-center">상태</th>
                <th className="py-3.5 px-5 text-right">검수 및 중지</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-400">
                    모니터링 대상 상품이 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-purple-50/30 transition">
                    {/* Thumbnail & Title */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.imageUrl}
                          alt={prod.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-2xs"
                        />
                        <div className="space-y-0.5">
                          <Link
                            to={`/products/${prod.id}`}
                            className="font-bold text-gray-900 hover:text-purple-600 line-clamp-1 text-xs"
                          >
                            {prod.title}
                          </Link>
                          <span className="text-[11px] text-gray-400 block">
                            {formatEventDate(prod.eventDate)} · {prod.venue}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Seller */}
                    <td className="py-4 px-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>{prod.sellerName || '일반회원'}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 font-semibold text-gray-700">
                      {prod.categoryLabel || prod.category}
                    </td>

                    {/* Start Price */}
                    <td className="py-4 px-4 text-right font-medium text-gray-500 line-through">
                      {formatPrice(prod.startPrice)}
                    </td>

                    {/* Current Price */}
                    <td className="py-4 px-4 text-right font-bold text-purple-700 text-sm">
                      {formatPrice(prod.currentPrice || prod.startPrice)}
                    </td>

                    {/* Drop Settings */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block bg-purple-50 text-purple-700 px-2 py-1 rounded-lg text-[10px] font-bold border border-purple-100">
                        {formatInterval(prod.dropInterval || 600)} / -{formatPrice(prod.dropAmount || 5000)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <ProductStatusBadge status={prod.status} />
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/products/${prod.id}`}
                          className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                          title="상세 경매 페이지 보기"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(prod)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                            prod.status === 'ACTIVE'
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                          title={prod.status === 'ACTIVE' ? '부정 상품 즉시 판매 중지' : '판매 재개'}
                        >
                          <PowerOff className="w-3 h-3" />
                          <span>{prod.status === 'ACTIVE' ? '판매 중지' : '재개'}</span>
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.title)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="완전 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;
