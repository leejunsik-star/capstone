import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import PriceDropChart from '../../components/admin/PriceDropChart';
import { CATEGORIES } from '../../utils/constants';
import {
  PackagePlus,
  ChevronLeft,
  Calendar,
  DollarSign,
  TrendingDown,
  Clock,
  MapPin,
  Ticket,
  Image,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const AdminProductCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State with realistic default Dutch Auction setup
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'CONCERT',
    categoryLabel: '콘서트',
    venue: '',
    eventDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16),
    seat: '1층 R석 10열 15번',
    seatGrade: 'R석 일반석',
    remainingSeats: 1,
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    description: '',
    startPrice: 120000,
    minPrice: 50000,
    dropAmount: 5000,
    dropInterval: 600, // 10분 = 600초
    auctionStartTime: new Date().toISOString().slice(0, 16),
    auctionEndTime: new Date(Date.now() + 48 * 3600 * 1000).toISOString().slice(0, 16),
    status: 'ACTIVE',
    sellerName: '공식파트너_인증',
    ticketType: '모바일 티켓 (QR코드)',
    transferableDate: '즉시 양도 가능',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      const found = CATEGORIES.find(c => c.id === value);
      setFormData(prev => ({
        ...prev,
        category: value,
        categoryLabel: found ? found.label : value,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name.includes('Price') || name.includes('Amount') || name.includes('Interval') || name === 'remainingSeats'
          ? Number(value) || 0
          : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.venue) {
      alert('상품명과 공연 장소를 입력해주세요.');
      return;
    }
    if (formData.startPrice <= formData.minPrice) {
      alert('시작 가격은 최저 가격보다 높아야 합니다.');
      return;
    }

    setLoading(true);
    try {
      await productService.createProduct({
        ...formData,
        auctionStartTime: new Date(formData.auctionStartTime).toISOString(),
        auctionEndTime: new Date(formData.auctionEndTime).toISOString(),
        eventDate: new Date(formData.eventDate).toISOString(),
      });
      alert('더치옥션 상품이 성공적으로 등록되었습니다!');
      navigate('/admin/products');
    } catch (err) {
      alert('등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-purple-600 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>상품 목록으로 돌아가기</span>
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <PackagePlus className="w-6 h-6 text-purple-600" />
          <span>신규 Dutch Auction 상품 등록</span>
        </h1>
        <p className="text-xs text-gray-500">
          소멸성 티켓의 더치옥션 가격 하락 규칙을 설정하고 실시간 시뮬레이션을 확인합니다.
        </p>
      </div>

      {/* Form & Simulator Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Basic Product Info */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">
              1. 기본 공연 및 티켓 정보
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">공연/행사명 (상품명) *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="예: Coldplay 내한공연 [Music of the Spheres]"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">카테고리 *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                  >
                    {CATEGORIES.filter(c => c.id !== 'ALL').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">공연 장소 *</label>
                  <input
                    type="text"
                    name="venue"
                    placeholder="예: 고척스카이돔"
                    value={formData.venue}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">공연 일시 *</label>
                  <input
                    type="datetime-local"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">배정 좌석 정보 *</label>
                  <input
                    type="text"
                    name="seat"
                    placeholder="예: 2층 E구역 14열 23번"
                    value={formData.seat}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">포스터/상품 이미지 URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">공연 상세 설명</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="공연 설명 및 관람 유의사항을 입력하세요..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* 2. Dutch Auction Settings */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-purple-600" />
              <span>2. Dutch Auction (더치옥션) 가격 하락 조건 설정</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">경매 시작 가격 (원) *</label>
                  <input
                    type="number"
                    name="startPrice"
                    step="1000"
                    value={formData.startPrice}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-bold text-purple-700"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">최저 한계 가격 (원) *</label>
                  <input
                    type="number"
                    name="minPrice"
                    step="1000"
                    value={formData.minPrice}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-bold text-rose-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">1회 하락 금액 (원) *</label>
                  <input
                    type="number"
                    name="dropAmount"
                    step="500"
                    value={formData.dropAmount}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">하락 주기 (초 단위) *</label>
                  <select
                    name="dropInterval"
                    value={formData.dropInterval}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-bold"
                  >
                    <option value="60">1분마다 (테스트용 빠른 하락)</option>
                    <option value="180">3분마다</option>
                    <option value="300">5분마다</option>
                    <option value="600">10분마다 (표준)</option>
                    <option value="1800">30분마다</option>
                    <option value="3600">1시간마다</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">경매 시작 일시 *</label>
                  <input
                    type="datetime-local"
                    name="auctionStartTime"
                    value={formData.auctionStartTime}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">경매 마감 일시 *</label>
                  <input
                    type="datetime-local"
                    name="auctionEndTime"
                    value={formData.auctionEndTime}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-purple-600/30 transition cursor-pointer"
          >
            {loading ? '등록 처리 중...' : 'Dutch Auction 상품 등록 완료'}
          </button>
        </div>

        {/* Right Live Simulation Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <PriceDropChart
            config={{
              startPrice: formData.startPrice,
              minPrice: formData.minPrice,
              dropAmount: formData.dropAmount,
              dropInterval: formData.dropInterval,
              auctionStartTime: formData.auctionStartTime,
              auctionEndTime: formData.auctionEndTime,
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default AdminProductCreatePage;
