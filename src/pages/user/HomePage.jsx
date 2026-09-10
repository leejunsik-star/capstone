import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import ProductCard from '../../components/product/ProductCard';
import {
  Sparkles,
  TrendingDown,
  ArrowRight,
  Flame,
  Clock,
  ShieldCheck,
  Zap,
  Ticket,
  BellRing,
  CheckCircle2
} from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products', err);
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

  const featuredAuctions = products.filter((p) => p.isFeatured && p.status === 'ACTIVE').slice(0, 4);
  const trendingAuctions = products.filter((p) => p.status === 'ACTIVE').slice(0, 8);
  const filteredProducts = selectedCategory === 'ALL'
    ? trendingAuctions
    : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-2xl border border-purple-900/40">
        {/* Stage lighting gradients */}
        <div className="absolute inset-0 bg-radial from-purple-900/40 via-slate-950/80 to-slate-950 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-6 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold shadow-inner">
              <Flame className="w-4 h-4 text-purple-400" />
              <span>국내 최초 Dutch Auction 티켓 거래 플랫폼</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              시간이 지날수록<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-200 to-indigo-300">
                가격이 떨어지는
              </span><br />
              티켓 마켓
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              공연, 콘서트, 뮤지컬, 전시, 스포츠 티켓의 가치가 소멸하기 전에!
              실시간으로 가격이 Drop되는 순간, 원하는 타이밍에 <b>PICK</b>하세요.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <Link
                to="/products"
                className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black text-base shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-all transform active:scale-95 flex items-center gap-2"
              >
                <span>지금 하락 경매 참여하기</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#how-it-works"
                className="px-6 py-4 bg-slate-900/80 hover:bg-slate-800 text-purple-200 border border-slate-700/80 rounded-2xl font-bold text-sm transition"
              >
                더치옥션 원리 보기
              </a>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-center md:text-left">
              <div>
                <span className="text-xl sm:text-2xl font-black text-white">최대 70%</span>
                <p className="text-xs text-slate-400">평균 가격 하락률</p>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-purple-400">실시간</span>
                <p className="text-xs text-slate-400">초단위 자동 하락</p>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-emerald-400">100%</span>
                <p className="text-xs text-slate-400">안심 QR 티켓 발권</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Preview Card */}
          {featuredAuctions.length > 0 && (
            <div className="w-full max-w-sm shrink-0">
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-300 animate-bounce" />
                <span>HOT 지금 주목받는 티켓</span>
              </div>
              <ProductCard product={featuredAuctions[0]} />
            </div>
          )}
        </div>
      </section>

      {/* 2. Category Quick Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/25 scale-102'
                    : 'bg-white text-gray-700 border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 shadow-xs'
                }`}
              >
                <span className="text-sm font-bold">{cat.label}</span>
                <span className={`text-[10px] ${isSelected ? 'text-purple-200' : 'text-gray-400'}`}>
                  {cat.id === 'ALL' ? '전체 보기' : `${cat.label} 티켓`}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Section: "지금 인기있는 하락 경매" (Matches PDF Page 8 & 10) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                <Flame className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                지금 인기있는 하락 경매
              </h2>
            </div>
            <p className="text-xs text-gray-500">
              가격이 실시간으로 떨어지고 있습니다. 원하는 최저 가격 타이밍을 놓치지 마세요!
            </p>
          </div>

          <Link
            to="/products"
            className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 group"
          >
            <span>전체보기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <Ticket className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-semibold">해당 카테고리의 진행 중인 티켓이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Price Drop Notification Promo Banner (Matches PDF Page 10) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
            <BellRing className="w-64 h-64" />
          </div>

          <div className="space-y-2 text-center sm:text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-purple-100 text-xs font-bold">
              <BellRing className="w-3.5 h-3.5 text-amber-300" />
              <span>실시간 목표가 알림 서비스</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              가격 하락 알림을 받아보세요!
            </h3>
            <p className="text-xs sm:text-sm text-purple-100 max-w-lg">
              관심 있는 공연을 찜하면 가격이 떨어질 때마다 푸시 및 브라우저 알림을 실시간으로 보내드립니다.
            </p>
          </div>

          <Link
            to="/wishlist"
            className="px-6 py-3.5 bg-white text-purple-700 hover:bg-purple-50 rounded-2xl text-xs font-black shadow-md transition transform active:scale-95 whitespace-nowrap z-10"
          >
            찜 목록 및 알림 설정 가기 →
          </Link>
        </div>
      </section>

      {/* 5. How Dutch Auction Works (Visual explainer) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
              HOW DROPICK WORKS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              DROPICK 더치 옥션(가격 하락 경매)이란?
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              일반적인 경매(입찰가 상승)와 달리, 시간이 지남에 따라 가격이 사전에 정해진 규칙대로 내려가는 역경매 시스템입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-lg">
                1
              </div>
              <h4 className="font-bold text-gray-900 text-base">일정 주기마다 가격 자동 Drop</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                판매자가 설정한 시작 가격에서 시작하여 10분, 5분 등 설정된 주기마다 가격이 자동으로 5,000원씩 떨어집니다.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-lg">
                2
              </div>
              <h4 className="font-bold text-gray-900 text-base">내가 원하는 가격 순간에 PICK</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                가격이 더 떨어질 때까지 기다릴 수도 있고, 지금 가격이 합리적이라고 생각될 때 즉시 구매 버튼을 눌러 확정합니다.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-lg">
                3
              </div>
              <h4 className="font-bold text-gray-900 text-base">단 1명 선착순 안심 즉시 발권</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                다른 사람이 먼저 결제하면 즉시 품절! 결제 완료 시 모바일 QR 코드가 즉시 발권되어 안전하게 입장합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
