import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  CreditCard,
  Users,
  BarChart3,
  Bell,
  ExternalLink,
  Ticket,
  ChevronRight
} from 'lucide-react';

export const AdminSidebar = () => {
  const menuItems = [
    { label: '대시보드', path: '/admin', icon: LayoutDashboard, end: true },
    { label: '상품 관리', path: '/admin/products', icon: Package },
    { label: '주문 관리', path: '/admin/orders', icon: ShoppingBag },
    { label: '결제/환불 관리', path: '/admin/payments', icon: CreditCard },
    { label: '회원 관리', path: '/admin/users', icon: Users },
    { label: '통계/분석', path: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between border-r border-slate-800 shrink-0">
      <div>
        {/* Logo Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
            <Ticket className="w-5 h-5 transform -rotate-12" />
          </div>
          <div>
            <h1 className="font-black text-lg text-white tracking-tight">
              DROP<span className="text-purple-400">ICK</span>
            </h1>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block -mt-1">
              관리자 페이지 (Admin)
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase px-3 mb-2 tracking-wider">
            운영 관리 메뉴
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Return to User Mall Link */}
      <div className="p-4 border-t border-slate-800">
        <Link
          to="/"
          className="flex items-center justify-between px-4 py-3 bg-slate-800/80 hover:bg-slate-800 text-purple-300 hover:text-white rounded-xl text-xs font-bold transition border border-slate-700/60 group"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>사용자 쇼핑몰 바로가기</span>
          </span>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
            Live
          </span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
