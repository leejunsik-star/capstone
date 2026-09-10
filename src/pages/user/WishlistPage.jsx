import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { productService } from '../../services/productService';
import ProductCard from '../../components/product/ProductCard';
import { Heart, Bell, Ticket, Sparkles, ArrowRight } from 'lucide-react';

export const WishlistPage = () => {
  const { wishlist, wishlistCount } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlistedProducts = async () => {
    try {
      const all = await productService.getProducts();
      const wishlisted = all.filter((p) => wishlist.includes(Number(p.id)));
      setProducts(wishlisted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlistedProducts();
    const handleWishlistChanged = () => loadWishlistedProducts();
    window.addEventListener('dropick_wishlist_changed', handleWishlistChanged);
    return () => window.removeEventListener('dropick_wishlist_changed', handleWishlistChanged);
  }, [wishlist]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            <span>찜한 티켓 목록 ({wishlistCount})</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            관심 있는 공연의 실시간 가격 하락 알림을 받아보고 원하는 가격에 PICK하세요.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-50 px-3.5 py-2 rounded-xl border border-purple-200">
          <Bell className="w-4 h-4 text-purple-600 animate-bounce" />
          <span>찜한 모든 티켓 가격 하락 푸시 알림 ON</span>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-80 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-gray-700 text-base">찜한 티켓이 없습니다.</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              관심 있는 콘서트, 뮤지컬, 경기 티켓을 찜하고 실시간 가격 하락 혜택을 누려보세요.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-purple-600/25 transition"
          >
            <Ticket className="w-4 h-4" />
            <span>진행 중인 티켓 둘러보기</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
