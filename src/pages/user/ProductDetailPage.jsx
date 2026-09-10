import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { useDutchAuction } from '../../hooks/useDutchAuction';
import { useWishlist } from '../../context/WishlistContext';
import DutchAuctionPanel from '../../components/auction/DutchAuctionPanel';
import SeatModal from '../../components/common/SeatModal';
import { ProductStatusBadge } from '../../components/common/StatusBadge';
import { formatPrice, formatEventDate } from '../../utils/formatters';
import {
  Calendar,
  MapPin,
  Heart,
  Share2,
  ChevronLeft,
  Eye,
  ShieldCheck,
  Zap,
  Info,
  QrCode,
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  const { isWishlisted, toggleWishlist } = useWishlist();

  const loadProduct = async () => {
    try {
      const data = await productService.getProductById(id);
      if (data) {
        setProduct(data);
      } else {
        navigate('/products');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
    const handleStorageChange = () => loadProduct();
    window.addEventListener('dropick_products_changed', handleStorageChange);
    return () => window.removeEventListener('dropick_products_changed', handleStorageChange);
  }, [id]);

  const auctionState = useDutchAuction(product);

  if (loading || !product || !auctionState) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-gray-500">더치옥션 실시간 티켓 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  const wished = isWishlisted(product.id);

  const handleBuyClick = () => {
    navigate(`/checkout/${product.id}`);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('공유 링크가 클립보드에 복사되었습니다.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Back Button & Top Action Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/products"
          className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-purple-600 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>티켓 목록으로 돌아가기</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`p-2.5 rounded-full border transition flex items-center gap-1.5 text-xs font-semibold ${
              wished
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${wished ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{wished ? '찜 완료' : '찜하기'}</span>
          </button>

          <button
            onClick={handleShare}
            aria-label="링크 공유하기"
            className="p-2.5 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-full transition"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Details & Right Dutch Auction Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Images, Seat preview & Event details) - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Info */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-bold">
                {product.categoryLabel || product.category}
              </span>
              <ProductStatusBadge status={auctionState.status} />
              {product.remainingSeats !== undefined && (
                <span className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold">
                  잔여 {product.remainingSeats}석
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              {product.title}
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {product.subtitle || product.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-gray-700 font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>{formatEventDate(product.eventDate)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span>{product.venue}</span>
              </div>
            </div>
          </div>

          {/* Image & Interactive Seat Map Trigger */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-slate-900 group">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full aspect-16/10 object-cover opacity-90 group-hover:opacity-100 transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Floating Seat Details Box */}
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-xl flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-purple-700 font-bold uppercase block">
                  지정 좌석 정보
                </span>
                <p className="text-base font-extrabold text-gray-900">
                  {product.seat}
                </p>
                <span className="text-xs text-gray-500 font-medium">
                  {product.seatGrade}
                </span>
              </div>

              <button
                onClick={() => setIsSeatModalOpen(true)}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/25 transition flex items-center gap-1.5 shrink-0 active:scale-95"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>좌석 배치도 보기</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation for Detailed Info */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              {[
                { id: 'info', label: '공연 및 티켓 정보' },
                { id: 'transfer', label: '양도 및 QR 수령' },
                { id: 'refund', label: '취소/환불 안내' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Info */}
            {activeTab === 'info' && (
              <div className="space-y-4 text-xs leading-relaxed text-gray-600 animate-fadeIn">
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 text-sm">공연 상세 소개</h4>
                  <p>{product.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 block text-[11px]">공식 판매처 인증</span>
                    <b className="text-gray-800 text-xs">{product.sellerName} (평점 {product.sellerRating}★)</b>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 block text-[11px]">관람 등급</span>
                    <b className="text-gray-800 text-xs">만 7세 이상 관람가</b>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Transfer & QR */}
            {activeTab === 'transfer' && (
              <div className="space-y-4 text-xs leading-relaxed text-gray-600 animate-fadeIn">
                <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
                  <h4 className="font-bold text-purple-900 text-sm flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-purple-600" />
                    <span>모바일 QR코드 스마트 티켓 발권 안내</span>
                  </h4>
                  <p className="text-gray-700">
                    결제 완료 즉시 마이페이지 및 예매 완료 화면에서 모바일 QR 티켓이 발권됩니다.
                    공연 당일 현장 매표소 방문 없이 게이트 전용 스캐너에 QR 코드를 태그하여 바로 입장하실 수 있습니다.
                  </p>
                </div>

                <div className="space-y-1">
                  <p>• 양도 가능 일시: <b>{product.transferableDate}</b></p>
                  <p>• 티켓 형태: <b>{product.ticketType}</b></p>
                </div>
              </div>
            )}

            {/* Tab 3: Refund Policy */}
            {activeTab === 'refund' && (
              <div className="space-y-3 text-xs leading-relaxed text-gray-600 animate-fadeIn">
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1.5">
                  <h4 className="font-bold text-sm flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>더치옥션 특성 및 취소/환불 규정</span>
                  </h4>
                  <p className="text-xs leading-relaxed">
                    더치옥션(가격 하락 경매)의 특성상 결제 완료 후에는 다른 구매자의 기회비용 보호를 위해
                    공연 시작 24시간 전까지만 취소 및 전액 환불이 가능합니다.
                  </p>
                </div>
                <ul className="space-y-1 pl-3 list-disc text-gray-500">
                  <li>공연 24시간 전: 100% 전액 환불 가능 (마이페이지에서 원클릭 취소)</li>
                  <li>공연 당일 취소: 환불 불가</li>
                  <li>주최 측의 사정으로 공연 취소 시: 플랫폼 전액 무조건 자동 환불</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dutch Auction Panel (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <DutchAuctionPanel
            product={product}
            auctionState={auctionState}
            onBuyClick={handleBuyClick}
          />
        </div>
      </div>

      {/* Seat Interactive Modal */}
      <SeatModal
        isOpen={isSeatModalOpen}
        onClose={() => setIsSeatModalOpen(false)}
        product={product}
      />
    </div>
  );
};

export default ProductDetailPage;
