import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';
import { SimulationProvider } from './context/SimulationContext';

// Common Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import MobileNav from './components/common/MobileNav';
import SimulationBar from './components/common/SimulationBar';
import NotificationDrawer from './components/common/NotificationDrawer';

// Admin Components
import AdminSidebar from './components/admin/AdminSidebar';
import AdminHeader from './components/admin/AdminHeader';

// User Pages
import HomePage from './pages/user/HomePage';
import ProductsPage from './pages/user/ProductsPage';
import ProductDetailPage from './pages/user/ProductDetailPage';
import SellTicketPage from './pages/user/SellTicketPage';
import CheckoutPage from './pages/user/CheckoutPage';
import PaymentSuccessPage from './pages/user/PaymentSuccessPage';
import PaymentFailPage from './pages/user/PaymentFailPage';
import WishlistPage from './pages/user/WishlistPage';
import MyPage from './pages/user/MyPage';
import LoginPage from './pages/user/LoginPage';
import SignupPage from './pages/user/SignupPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductCreatePage from './pages/admin/AdminProductCreatePage';
import AdminProductEditPage from './pages/admin/AdminProductEditPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

// User Layout wrapper
const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/70 text-gray-900 selection:bg-purple-600 selection:text-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <NotificationDrawer />
      <SimulationBar />
    </div>
  );
};

// Admin Layout wrapper
const AdminLayout = () => {
  const location = useLocation();

  const getPageTitle = (pathname) => {
    if (pathname === '/admin') return '관리자 운영 대시보드';
    if (pathname.startsWith('/admin/products/new')) return '관리자 테스트 상품 등록';
    if (pathname.includes('/edit')) return '경매 상품 수정';
    if (pathname.startsWith('/admin/products')) return '등록 상품 모니터링 & 검수 관리';
    if (pathname.startsWith('/admin/orders')) return '전체 주문 및 예매 거래 모니터링';
    if (pathname.startsWith('/admin/payments')) return '결제 및 환불 관리 (Toss Payments)';
    if (pathname.startsWith('/admin/users')) return '회원 및 권한 관리';
    if (pathname.startsWith('/admin/analytics')) return '통계 및 매출 분석';
    return 'DROPICK 관리자 센터';
  };

  return (
    <div className="min-h-screen flex bg-slate-100 selection:bg-purple-600 selection:text-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title={getPageTitle(location.pathname)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <SimulationBar />
    </div>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <NotificationProvider>
            <SimulationProvider>
              <Routes>
                {/* User Portal Routes */}
                <Route element={<UserLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/sell" element={<SellTicketPage />} />
                  <Route path="/checkout/:id" element={<CheckoutPage />} />
                  <Route path="/payment/success" element={<PaymentSuccessPage />} />
                  <Route path="/payment/fail" element={<PaymentFailPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/mypage" element={<MyPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                </Route>

                {/* Admin Portal Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="products/new" element={<AdminProductCreatePage />} />
                  <Route path="products/:id/edit" element={<AdminProductEditPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="payments" element={<AdminPaymentsPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="analytics" element={<AdminAnalyticsPage />} />
                </Route>

                {/* Fallback 404 Route */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </SimulationProvider>
          </NotificationProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
