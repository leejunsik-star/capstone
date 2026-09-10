import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, User } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export const MobileNav = () => {
  const { wishlistCount } = useWishlist();

  const tabs = [
    { label: '홈', path: '/', icon: Home },
    { label: '검색', path: '/products', icon: Search },
    { label: '찜', path: '/wishlist', icon: Heart, badge: wishlistCount },
    { label: '마이페이지', path: '/mypage', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1.5 shadow-lg">
      <div className="grid grid-cols-4 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 relative transition-colors ${
                  isActive ? 'text-purple-600 font-bold' : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
