import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import PriceDropChart from '../../components/admin/PriceDropChart';
import { CATEGORIES } from '../../utils/constants';
import { formatPrice, formatInterval } from '../../utils/formatters';
import {
  Tag,
  ChevronLeft,
  Calendar,
  DollarSign,
  TrendingDown,
  Clock,
  MapPin,
  Ticket,
  Image,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calculator
} from 'lucide-react';

export const SellTicketPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdId, setCreatedId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'CONCERT',
    categoryLabel: '콘서트',
    venue: '',
    eventDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().slice(0, 16),
    seat: '',
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
    ticketType: '모바일 티켓 (QR코드 즉시 발권)',
    transferableDate: '즉시 양도 가능',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      const found = CATEGORIES.find((c) => c.id === value);
      setFormData((prev) => ({
        ...prev,
        category: value,
        categoryLabel: found ? found.label : value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name.includes('Price') ||
          name.includes('Amount') ||
          name.includes('Interval') ||
          name === 'remainingSeats'
            ? Number(value) || 0
            : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('공연/행사명을 입력해주세요.');
      return;
    }
    if (!formData.venue.trim()) {
      alert('공연 장소를 입력해주세요.');
      return;
    }
    if (!formData.seat.trim()) {
      alert('좌석 정보를 상세히 입력해주세요 (예: 1층 A구역 5열 12번).');
      return;
    }
    if (formData.startPrice <= formData.minPrice) {
      alert('시작 가격은 최저 가격보다 높아야 합니다.');
      return;
    }
    if (formData.dropAmount <= 0) {
      alert('1회 하락 금액을 1,000원 이상으로 설정해주세요.');
      return;
    }

    setLoading(true);
    try {
      const sellerId = user?.id || 2;
      const sellerName = user?.name || '티켓판매회원';
      const sellerEmail = user?.email || 'user@dropick.com';

      const saved = await productService.createProduct({
        ...formData,
        sellerId,
        sellerName,
        sellerEmail,
        status: 'ACTIVE',
        auctionStartTime: new Date(formData.auctionStartTime).toISOString(),
        auctionEndTime: new Date(formData.auctionEndTime).toISOString(),
        eventDate: new Date(formData.eventDate).toISOString(),
      });

      setCreatedId(saved.id);
      setIsSuccess(true);
    } catch (err) {
      alert('티켓 판매 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/products"
          className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-purple-600 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>티켓 마켓으로 돌아가기</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-purple-700/40">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 text-xs font-bold border border-purple-400/30">
            <Tag className="w-3.5 h-3.5" />
            <span>DROPICK C2C 더치옥션 판매자 센터</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            내 소멸성 티켓 판매 등록하기
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 max-w-xl leading-relaxed">
            관람하지 못하는 공연/경기 티켓을 더치옥션(Dutch Auction)으로 등록하세요.
            시간이 지남에 따라 가격이 자동 하락하여 빠른 판매 성사를 돕습니다.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-xs space-y-1.5 text-center shrink-0">
          <div className="text-purple-200 font-semibold">플랫폼 중개 수수료</div>
          <div className="text-2xl font-black text-amber-300">0원 (0% 무료)</div>
          <span className="text-[10px] text-purple-300">오픈 기념 판매자 정산 100% 지급</span>
        </div>
      </div>

      {/* Main Registration Form & Simulation Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Ticket Info */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-purple-600" />
              <span>1. 판매할 티켓 및 공연 정보</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">공연/행사명 (정확한 타이틀) *</label>
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
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'ALL').map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">공연 장소 (공연장/경기장) *</label>
                  <input
                    type="text"
                    name="venue"
                    placeholder="예: 고척스카이돔, 블루스퀘어"
                    value={formData.venue}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">공연 관람 일시 *</label>
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
                  <label className="block text-gray-700 font-bold mb-1">보유 좌석 정보 (구역/열/번) *</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">좌석 등급</label>
                  <input
                    type="text"
                    name="seatGrade"
                    placeholder="예: VIP석, R석, 일반지정석"
                    value={formData.seatGrade}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">판매 티켓 수량</label>
                  <input
                    type="number"
                    name="remainingSeats"
                    min="1"
                    max="10"
                    value={formData.remainingSeats}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">포스터 또는 티켓 이미지 URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">티켓 상세 설명 및 양도 안내</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="구매자에게 전달할 추가 정보나 티켓 수령 안내를 작성해주세요."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* 2. Dutch Auction Conditions */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-purple-600" />
                <span>2. Dutch Auction (가격 하락 경매) 조건 설정</span>
              </h3>
              <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-md">
                판매자 직접 설정
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
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
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-bold text-purple-700 text-sm"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">경매 시작 시 최초 판매가</span>
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
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-bold text-rose-600 text-sm"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">이 가격 이하로는 떨어지지 않음</span>
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
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-bold text-sm"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">주기마다 차감될 금액</span>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">가격 하락 주기 *</label>
                  <select
                    name="dropInterval"
                    value={formData.dropInterval}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-bold cursor-pointer text-sm"
                  >
                    <option value="60">1분마다 (시연/빠른 낙찰)</option>
                    <option value="180">3분마다</option>
                    <option value="300">5분마다</option>
                    <option value="600">10분마다 (추천 표준)</option>
                    <option value="1800">30분마다</option>
                    <option value="3600">1시간마다</option>
                  </select>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">가격이 떨어지는 시간 간격</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">경매 시작 시간 *</label>
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
                  <label className="block text-gray-700 font-bold mb-1">경매 마감 시간 *</label>
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-black text-base shadow-xl shadow-purple-600/30 transition transform active:scale-99 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>더치옥션 경매 등록 처리 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>내 티켓 더치옥션 등록하기 (무료)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Preview & Simulation (5 cols) */}
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

          {/* Seller Settlement Summary */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-gray-900 border-b border-gray-100 pb-2">
              <Calculator className="w-4 h-4 text-purple-600" />
              <span>판매 정산 혜택 안내</span>
            </div>

            <div className="space-y-1.5 text-gray-600">
              <div className="flex justify-between">
                <span>예상 낙찰 시작가:</span>
                <span className="font-bold text-gray-900">{formatPrice(formData.startPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>보장 최저 정산액:</span>
                <span className="font-bold text-rose-600">{formatPrice(formData.minPrice)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>DROPICK 플랫폼 수수료:</span>
                <span>0원 (0% 프로모션)</span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between font-bold text-sm text-purple-700">
                <span>판매자 최종 수령액:</span>
                <span>낙찰가 100% 전액 입금</span>
              </div>
            </div>

            <div className="p-3 bg-purple-50 rounded-xl text-[11px] text-purple-900 leading-relaxed">
              🛡️ 구매자가 토스페이먼츠로 결제 완료 시, 실시간 알림과 함께 판매자의 등록 계좌로 익일 즉시 자동 정산됩니다.
            </div>
          </div>
        </div>
      </form>

      {/* Success Modal */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl border border-purple-100 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                경매 등록 완료
              </span>
              <h3 className="text-xl font-black text-gray-900">
                티켓이 마켓에 정상 등록되었습니다!
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                설정하신 더치옥션 규칙에 따라 지금부터 실시간 가격 하락 경매가 시작됩니다.
              </p>
            </div>

            <div className="space-y-2">
              <Link
                to={`/products/${createdId}`}
                className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/25 transition flex items-center justify-center gap-1.5"
              >
                <Ticket className="w-4 h-4" />
                <span>내가 등록한 경매 티켓 확인하기</span>
              </Link>
              <Link
                to="/mypage"
                className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold border border-gray-200 transition block"
              >
                마이페이지 판매 내역으로 이동
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellTicketPage;
