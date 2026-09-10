import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { settlementService, BANK_LIST } from '../../services/settlementService';
import { useWishlist } from '../../context/WishlistContext';
import { useNotification } from '../../context/NotificationContext';
import { OrderStatusBadge, ProductStatusBadge } from '../../components/common/StatusBadge';
import QRTicketModal from '../../components/common/QRTicketModal';
import { formatPrice, formatEventDate, formatInterval } from '../../utils/formatters';
import {
  User,
  ShoppingBag,
  Heart,
  Bell,
  Settings,
  QrCode,
  Calendar,
  MapPin,
  RotateCcw,
  ShieldCheck,
  Ticket,
  ChevronRight,
  Tag,
  Plus,
  Trash2,
  TrendingDown,
  Clock,
  Eye,
  DollarSign,
  Banknote,
  BadgeCheck,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyPage = () => {
  const { user } = useAuth();
  const { wishlistCount } = useWishlist();
  const { notifications, unreadCount } = useNotification();

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [mySales, setMySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState(null);

  // Settlement Account State
  const [settlementAccountData, setSettlementAccountData] = useState(null);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [bankCode, setBankCode] = useState('090');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountLoading, setAccountLoading] = useState(false);

  // Profile edit form state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '010-3849-2910');
  const [isSaved, setIsSaved] = useState(false);

  const loadData = async () => {
    try {
      const orderList = await orderService.getOrders();
      setOrders(orderList);

      const allProducts = await productService.getProducts();
      // Filter products where current user is the seller
      const currentUserId = user?.id || 2;
      const currentUserEmail = user?.email || 'user@dropick.com';
      const userSales = allProducts.filter(
        (p) => p.sellerId === currentUserId || p.sellerEmail === currentUserEmail || p.id === 1 || p.id === 4
      );
      setMySales(userSales);

      // Load Settlement Account
      const account = await settlementService.getSettlementAccount();
      setSettlementAccountData(account);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleOrdersChange = () => loadData();
    const handleProductsChange = () => loadData();
    window.addEventListener('dropick_orders_changed', handleOrdersChange);
    window.addEventListener('dropick_products_changed', handleProductsChange);
    return () => {
      window.removeEventListener('dropick_orders_changed', handleOrdersChange);
      window.removeEventListener('dropick_products_changed', handleProductsChange);
    };
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('정말 이 티켓 예매를 취소하고 전액 환불을 요청하시겠습니까?')) {
      await orderService.cancelOrder(orderId, '사용자 즉시 취소');
      loadData();
      alert('환불 처리가 완료되었습니다.');
    }
  };

  const handleConfirmReceipt = async (orderId) => {
    if (window.confirm('티켓을 정상 수령하셨나요? 수령 확인 후 판매자에게 자동 정산됩니다.')) {
      try {
        const result = await settlementService.confirmReceipt(orderId);
        alert(result.message || '수령이 확인되었습니다. 판매자에게 익일 자동 정산됩니다.');
        loadData();
      } catch (err) {
        alert('수령 확인 처리 중 오류가 발생했습니다.');
      }
    }
  };

  const handleCancelSelling = async (productId, title) => {
    if (window.confirm(`'${title}' 티켓 경매 판매를 취소하시겠습니까?`)) {
      await productService.deleteProduct(productId);
      loadData();
      alert('티켓 판매 등록이 취소되었습니다.');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleRegisterAccount = async (e) => {
    e.preventDefault();
    setAccountLoading(true);
    try {
      // 1. 계좌 실명조회
      const verifyResult = await settlementService.verifyBankAccount({
        bankCode,
        accountNumber,
        holderName: accountHolder,
      });

      if (verifyResult.verified) {
        // 2. 계좌 등록
        await settlementService.registerSettlementAccount({
          bankCode,
          bankName: verifyResult.bankName,
          accountNumber,
          accountHolder,
        });
        alert('정산 계좌 등록이 완료되었습니다.');
        setIsEditingAccount(false);
        loadData();
      } else {
        alert('계좌 실명 조회에 실패했습니다. 다시 확인해주세요.');
      }
    } catch (err) {
      alert('계좌 등록 중 오류가 발생했습니다.');
    } finally {
      setAccountLoading(false);
    }
  };

  const maskAccountNumber = (num) => {
    if (!num) return '';
    return num.slice(0, 4) + '-****-' + num.slice(-4);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Box */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-purple-800/40">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-purple-600 border-2 border-purple-300 flex items-center justify-center font-black text-2xl shadow-lg">
            {user?.name ? user.name.slice(0, 1) : 'U'}
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black">{user?.name || '회원'} 님</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-xs font-bold border border-purple-400/30">
                구매자 & 판매자 통합회원
              </span>
            </div>
            <p className="text-xs text-purple-200 mt-1">{user?.email || 'user@dropick.com'}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/10 text-center">
          <div>
            <span className="text-xs text-purple-200 block">구매 예매</span>
            <b className="text-xl font-black text-white">{orders.filter((o) => o.status === 'PAID').length}건</b>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <span className="text-xs text-purple-200 block">판매 등록</span>
            <b className="text-xl font-black text-amber-300">{mySales.length}건</b>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <span className="text-xs text-purple-200 block">찜한 티켓</span>
            <b className="text-xl font-black text-white">{wishlistCount}개</b>
          </div>
        </div>
      </div>

      {/* Main Container: Tabs */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Tab Strip */}
        <div className="flex items-center border-b border-gray-100 px-6 pt-4 gap-2 overflow-x-auto">
          {[
            { id: 'orders', label: '구매 티켓 내역', icon: ShoppingBag, count: orders.length },
            { id: 'sales', label: '내 판매 티켓 관리', icon: Tag, count: mySales.length },
            { id: 'settlement', label: '정산 계좌 관리', icon: Banknote },
            { id: 'wishlist', label: '찜 목록', icon: Heart, count: wishlistCount },
            { id: 'notifications', label: '알림 내역', icon: Bell, count: unreadCount },
            { id: 'profile', label: '회원정보 수정', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isCurrent
                    ? 'border-purple-600 text-purple-700'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isCurrent ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Orders (Purchases) */}
        {activeTab === 'orders' && (
          <div className="p-6 space-y-4">
            {loading ? (
              <div className="text-center py-12 text-gray-400">주문 내역을 불러오는 중...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-gray-400 space-y-3">
                <ShoppingBag className="w-10 h-10 mx-auto opacity-30" />
                <p className="text-xs font-semibold">아직 예매하신 티켓 주문 내역이 없습니다.</p>
                <Link
                  to="/products"
                  className="inline-block px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition"
                >
                  티켓 경매 둘러보기
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-purple-200 transition shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={ord.imageUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'}
                        alt={ord.productTitle}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <OrderStatusBadge status={ord.status} />
                          <span className="text-[11px] text-gray-400 font-mono">{ord.id}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm">{ord.productTitle}</h4>
                        <div className="text-xs text-gray-500 space-y-0.5">
                          <p className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>{formatEventDate(ord.eventDate)}</span>
                          </p>
                          <p className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span>
                              {ord.venue} · <b className="text-purple-700 font-semibold">{ord.seat}</b>
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col items-end justify-between gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                      <div className="text-right">
                        <span className="text-[11px] text-gray-400 block">결제 금액</span>
                        <span className="text-lg font-black text-gray-900">{formatPrice(ord.paidPrice)}</span>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {ord.status === 'PAID' && (
                          <>
                            <button
                              onClick={() => setSelectedQR(ord)}
                              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>모바일 QR 티켓</span>
                            </button>
                            <button
                              onClick={() => handleConfirmReceipt(ord.id)}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>수령 확인</span>
                            </button>
                            <button
                              onClick={() => handleCancelOrder(ord.id)}
                              className="px-3 py-2 bg-gray-50 hover:bg-rose-50 hover:text-rose-600 text-gray-600 border border-gray-200 rounded-xl text-xs font-semibold transition cursor-pointer"
                              title="취소 및 전액 환불"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {ord.status === 'RECEIPT_CONFIRMED' && (
                           <div className="flex items-center gap-2">
                             <button
                               onClick={() => setSelectedQR(ord)}
                               className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                             >
                               <QrCode className="w-3.5 h-3.5" />
                               <span>모바일 QR 티켓</span>
                             </button>
                             <span className="text-[11px] text-blue-600 font-bold px-3 py-1.5 bg-blue-50 rounded-xl">
                               수령 확인 완료 · 정산 대기
                             </span>
                           </div>
                        )}
                        {ord.status === 'REFUNDED' && (
                          <span className="text-xs text-rose-600 font-semibold px-3 py-1.5 bg-rose-50 rounded-xl">
                            환불 완료
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: User Selling Tickets Management */}
        {activeTab === 'sales' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">내가 등록한 더치옥션 티켓</h3>
                <p className="text-xs text-gray-500">시간에 따라 가격이 자동 하락하며 구매자가 낙찰 시 정산됩니다.</p>
              </div>

              <Link
                to="/sell"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ 새 티켓 판매 등록</span>
              </Link>
            </div>

            {mySales.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                <Tag className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="text-xs font-semibold text-gray-600">등록한 판매 티켓이 없습니다.</p>
                <Link
                  to="/sell"
                  className="inline-block px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition"
                >
                  지금 티켓 판매하기
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {mySales.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-purple-200 transition shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={prod.imageUrl}
                        alt={prod.title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <ProductStatusBadge status={prod.status} />
                          <span className="text-[11px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md">
                            {prod.categoryLabel || prod.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm">{prod.title}</h4>
                        <div className="text-xs text-gray-500 space-y-0.5">
                          <p className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>{formatEventDate(prod.eventDate)}</span>
                          </p>
                          <p className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span>
                              {prod.venue} · <b className="text-purple-700">{prod.seat}</b>
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col items-end justify-between gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                      <div className="text-right space-y-0.5">
                        <span className="text-[11px] text-gray-400 block">
                          시작가 {formatPrice(prod.startPrice)} → 최저가 {formatPrice(prod.minPrice)}
                        </span>
                        <div className="flex items-baseline justify-end gap-1.5">
                          <span className="text-xs text-purple-600 font-bold">실시간 현재가</span>
                          <span className="text-lg font-black text-gray-900">
                            {formatPrice(prod.currentPrice || prod.startPrice)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/products/${prod.id}`}
                          className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>경매 페이지 보기</span>
                        </Link>
                        {prod.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleCancelSelling(prod.id, prod.title)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                            title="판매 등록 취소"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Settlement Account Management */}
        {activeTab === 'settlement' && (
          <div className="p-6 max-w-lg space-y-5">
            {/* 안내 배너 */}
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-xs text-blue-800 space-y-1">
              <b className="block">💳 판매자 정산 계좌 등록 안내</b>
              <p>판매하신 티켓의 낙찰 대금은 구매자 수령 확인 후 <b>익일 영업일</b>에 아래 등록된 계좌로 자동 입금됩니다.</p>
              <p className="text-blue-600">• 플랫폼 수수료: <b>결제금액의 3%</b> 차감 후 정산</p>
              <p className="text-blue-600">• 토스페이먼츠 계좌 실명인증을 통해 안전하게 처리됩니다.</p>
            </div>
            
            {/* 계좌 등록/표시 영역 */}
            {settlementAccountData?.isVerified && !isEditingAccount ? (
              <div className="p-5 bg-white rounded-2xl border border-emerald-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-emerald-700 text-sm">계좌 인증 완료</span>
                </div>
                <div className="text-xs text-gray-700 space-y-1.5">
                  <p><b>은행:</b> {settlementAccountData.bankName}</p>
                  <p><b>계좌번호:</b> {maskAccountNumber(settlementAccountData.accountNumber)}</p>
                  <p><b>예금주:</b> {settlementAccountData.accountHolder}</p>
                </div>
                <button
                  onClick={() => setIsEditingAccount(true)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer mt-2"
                >
                  계좌 변경하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterAccount} className="space-y-4 text-xs bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <h4 className="font-bold text-gray-900 text-sm mb-3">정산 계좌 정보 입력</h4>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">은행 선택</label>
                  <select
                    value={bankCode}
                    onChange={(e) => setBankCode(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium cursor-pointer"
                  >
                    {BANK_LIST.map((b) => (
                      <option key={b.code} value={b.code}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">계좌번호 (- 제외)</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="계좌번호를 입력해주세요"
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">예금주명 (실명)</label>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="실명 입력"
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                  />
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={accountLoading}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
                  >
                    {accountLoading ? '인증 중...' : '계좌 실명인증 및 등록'}
                  </button>
                  {isEditingAccount && settlementAccountData?.isVerified && (
                    <button
                      type="button"
                      onClick={() => setIsEditingAccount(false)}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
                    >
                      취소
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 4: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="p-8 text-center space-y-4">
            <Heart className="w-12 h-12 text-rose-500 fill-rose-500 mx-auto" />
            <h3 className="font-bold text-gray-800 text-base">찜 목록 ({wishlistCount}개)</h3>
            <p className="text-xs text-gray-500">관심있는 티켓을 찜하고 실시간 가격 하락 알림을 받아보세요.</p>
            <Link
              to="/wishlist"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-2xl text-xs font-bold hover:bg-purple-700 transition"
            >
              찜 목록 페이지로 이동 →
            </Link>
          </div>
        )}

        {/* Tab 5: Notifications */}
        {activeTab === 'notifications' && (
          <div className="p-6 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs">알림 내역이 없습니다.</div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                  <Bell className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs text-gray-900">{n.title}</span>
                    <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 6: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="p-6 max-w-lg">
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">이름</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">이메일 계정 (수정 불가)</label>
                <input
                  type="email"
                  value={user?.email || 'user@dropick.com'}
                  disabled
                  className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">연락처</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  회원정보 저장
                </button>
                {isSaved && <span className="ml-3 text-emerald-600 font-bold">저장되었습니다!</span>}
              </div>
            </form>
          </div>
        )}
      </div>

      {/* QR Ticket Modal */}
      {selectedQR && (
        <QRTicketModal
          isOpen={Boolean(selectedQR)}
          onClose={() => setSelectedQR(null)}
          order={selectedQR}
        />
      )}
    </div>
  );
};

export default MyPage;
