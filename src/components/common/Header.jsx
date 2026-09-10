import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotification } from '../../context/NotificationContext';
import {
  Search,
  Heart,
  Bell,
  User as UserIcon,
  LogOut,
  Shield,
  Menu,
  X,
  Ticket,
  Sparkles,
  TrendingDown,
  PlusCircle,
  Tag
} from 'lucide-react';

export const Header = () => {
  const { user, isAdmin, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { unreadCount, toggleDrawer } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: '홈', path: '/' },
    { name: '티켓 탐색', path: '/products' },
    { name: '콘서트', path: '/products?category=CONCERT' },
    { name: '뮤지컬', path: '/products?category=MUSICAL' },
    { name: '연극', path: '/products?category=THEATER' },
    { name: '전시', path: '/products?category=EXHIBITION' },
    { name: '스포츠', path: '/products?category=SPORTS' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* Top micro banner */}
      <div className="bg-purple-900 text-purple-100 text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
        <TrendingDown className="w-3.5 h-3.5 text-purple-400 animate-bounce" />
        <span>시간이 지날수록 가격이 떨어지는 C2C 더치옥션 티켓마켓 <b>DROPICK</b></span>
        <span className="hidden md:inline text-purple-300">| 지금 바로 원하는 순간에 PICK하거나 내 티켓을 판매해보세요!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/25 group-hover:bg-purple-700 transition">
                <Ticket className="w-5 h-5 transform -rotate-12" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-purple-700 leading-none">
                  DROP<span className="text-gray-900">ICK</span>
                </span>
                <span className="text-[10px] font-semibold text-purple-600 tracking-wider">
                  더치옥션 티켓마켓
                </span>
              </div>
            </Link>
          </div>

          {/* Center Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="공연명, 아티스트, 장소 검색 (예: Coldplay, 고척돔)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 hover:bg-gray-100 focus:bg-white text-sm rounded-full border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-hidden transition"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-purple-600 text-white rounded-full text-xs font-semibold hover:bg-purple-700 transition"
              >
                검색
              </button>
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5">
            <Link
              to="/products"
              className={`text-sm font-semibold transition ${
                location.pathname === '/products'
                  ? 'text-purple-600 font-bold'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              티켓 탐색
            </Link>
            <Link
              to="/wishlist"
              className="relative text-sm font-semibold text-gray-700 hover:text-purple-600 transition flex items-center gap-1"
            >
              <Heart className="w-4 h-4 text-gray-500 hover:text-red-500" />
              <span>찜</span>
              {wishlistCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold text-white bg-red-500 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/mypage"
              className={`text-sm font-semibold transition ${
                location.pathname === '/mypage'
                  ? 'text-purple-600 font-bold'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              마이페이지
            </Link>
          </nav>

          {/* Right Action: "+ 티켓 판매하기" CTA & User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Ticket Selling CTA */}
            <Link
              to="/sell"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition active:scale-95 cursor-pointer"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>티켓 판매하기</span>
            </Link>

            {/* Notification Bell */}
            <button
              onClick={toggleDrawer}
              aria-label="알림 열기"
              className="relative p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-purple-600 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <Link
                  to="/mypage"
                  className="flex items-center gap-2 hover:opacity-80 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-xs">
                    {user.name.slice(0, 1)}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-gray-800">
                    {user.name} 님
                  </span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold hover:bg-purple-100 transition"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    운영 관리
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition"
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-50 rounded-lg transition"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm shadow-purple-500/20 transition"
                >
                  회원가입
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-purple-600 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-fadeIn">
          {/* Mobile Sell Ticket Button */}
          <Link
            to="/sell"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-500/20"
          >
            <Tag className="w-4 h-4" />
            <span>내 티켓 더치옥션 판매 등록하기</span>
          </Link>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="공연명, 장소 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 text-sm rounded-lg border border-gray-200 focus:border-purple-600 outline-hidden"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <Link
              to="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"
            >
              <Heart className="w-4 h-4 text-red-500" />
              찜한 목록 ({wishlistCount})
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold text-purple-700 flex items-center gap-1"
              >
                <Shield className="w-4 h-4" /> 관리자 센터
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
