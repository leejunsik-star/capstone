import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS, INITIAL_NOTIFICATIONS } from '../data/mockInitialData';
import { calculateAuctionState } from '../utils/auctionPrice';

const STORAGE_KEYS = {
  PRODUCTS: 'dropick_products',
  ORDERS: 'dropick_orders',
  USERS: 'dropick_users',
  NOTIFICATIONS: 'dropick_notifications',
  WISHLIST: 'dropick_wishlist',
  CURRENT_USER: 'dropick_current_user',
  TIME_OFFSET_SEC: 'dropick_time_offset_sec',
};

// Initialize default storage data if missing
export const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify([1, 4, 7]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    // Default logged in as demo user
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[1]));
  }
  if (localStorage.getItem(STORAGE_KEYS.TIME_OFFSET_SEC) === null) {
    localStorage.setItem(STORAGE_KEYS.TIME_OFFSET_SEC, '0');
  }
};

// Simulation Time Helpers
export const getTimeOffsetSec = () => {
  const val = localStorage.getItem(STORAGE_KEYS.TIME_OFFSET_SEC);
  return val ? parseInt(val, 10) : 0;
};

export const setTimeOffsetSec = (seconds) => {
  localStorage.setItem(STORAGE_KEYS.TIME_OFFSET_SEC, String(seconds));
  window.dispatchEvent(new Event('dropick_time_changed'));
};

export const addTimeOffsetSec = (deltaSeconds) => {
  const current = getTimeOffsetSec();
  setTimeOffsetSec(current + deltaSeconds);
};

export const getEffectiveCurrentTime = () => {
  return Date.now() + (getTimeOffsetSec() * 1000);
};

// Product Operations
export const getStoredProducts = () => {
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  const products = raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
  const nowMs = getEffectiveCurrentTime();

  // Attach live dynamic price calculation to each product
  return products.map((prod) => {
    const calc = calculateAuctionState(prod, nowMs);
    return {
      ...prod,
      ...calc,
      currentPrice: calc ? calc.currentPrice : prod.startPrice,
    };
  });
};

export const getStoredProductById = (id) => {
  const products = getStoredProducts();
  return products.find((p) => String(p.id) === String(id)) || null;
};

export const saveStoredProduct = (productData) => {
  initStorage();
  const products = getStoredProducts();
  const index = products.findIndex((p) => String(p.id) === String(productData.id));

  let saved;
  if (index >= 0) {
    // Update
    products[index] = { ...products[index], ...productData };
    saved = products[index];
  } else {
    // Create new
    const newId = products.length > 0 ? Math.max(...products.map((p) => Number(p.id) || 0)) + 1 : 1;
    saved = {
      ...productData,
      id: newId,
      viewCount: 0,
      wishlistCount: 0,
      sellerRating: 5.0,
      status: productData.status || 'ACTIVE',
    };
    products.unshift(saved);
  }

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  window.dispatchEvent(new Event('dropick_products_changed'));
  return saved;
};

export const deleteStoredProduct = (id) => {
  initStorage();
  const products = getStoredProducts().filter((p) => String(p.id) !== String(id));
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  window.dispatchEvent(new Event('dropick_products_changed'));
  return true;
};

// Order Operations
export const getStoredOrders = () => {
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return raw ? JSON.parse(raw) : INITIAL_ORDERS;
};

export const getStoredOrderById = (orderId) => {
  const orders = getStoredOrders();
  return orders.find((o) => o.id === orderId) || null;
};

export const createStoredOrder = (orderData) => {
  initStorage();
  const orders = getStoredOrders();
  const newOrder = {
    ...orderData,
    id: orderData.id || `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
    orderDate: new Date().toISOString(),
    status: orderData.status || 'PAID',
    qrCode: `DROPICK-QR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
  };

  orders.unshift(newOrder);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

  // Mark product as SOLD if it was a single inventory ticket
  if (orderData.productId) {
    const products = getStoredProducts();
    const productIdx = products.findIndex((p) => String(p.id) === String(orderData.productId));
    if (productIdx >= 0) {
      const p = products[productIdx];
      const remaining = Math.max(0, (p.remainingSeats || 1) - 1);
      products[productIdx] = {
        ...p,
        remainingSeats: remaining,
        status: remaining === 0 ? 'SOLD' : p.status,
      };
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      window.dispatchEvent(new Event('dropick_products_changed'));
    }
  }

  // Add order success notification
  addStoredNotification({
    type: 'ORDER_SUCCESS',
    title: '🎟️ 티켓 예매 성공',
    message: `[${newOrder.productTitle}] 결제가 완료되었습니다. 예매내역에서 모바일 티켓을 확인하세요.`,
    productId: newOrder.productId,
  });

  window.dispatchEvent(new Event('dropick_orders_changed'));
  return newOrder;
};

export const updateStoredOrderStatus = (orderId, newStatus) => {
  initStorage();
  const orders = getStoredOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx >= 0) {
    orders[idx] = { ...orders[idx], status: newStatus };
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('dropick_orders_changed'));
    return orders[idx];
  }
  return null;
};

// Wishlist Operations
export const getStoredWishlist = () => {
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.WISHLIST);
  return raw ? JSON.parse(raw) : [];
};

export const toggleStoredWishlist = (productId) => {
  initStorage();
  const wishlist = getStoredWishlist();
  const numId = Number(productId);
  const exists = wishlist.includes(numId);
  let updated;
  if (exists) {
    updated = wishlist.filter((id) => id !== numId);
  } else {
    updated = [...wishlist, numId];
  }
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(updated));
  window.dispatchEvent(new Event('dropick_wishlist_changed'));
  return !exists;
};

// Notification Operations
export const getStoredNotifications = () => {
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  return raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
};

export const addStoredNotification = (notif) => {
  initStorage();
  const list = getStoredNotifications();
  const newNotif = {
    ...notif,
    id: Date.now(),
    time: '방금 전',
    isRead: false,
  };
  list.unshift(newNotif);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  window.dispatchEvent(new Event('dropick_notifications_changed'));
  return newNotif;
};

export const markStoredNotificationRead = (notifId) => {
  initStorage();
  const list = getStoredNotifications();
  const updated = list.map((n) => (n.id === notifId ? { ...n, isRead: true } : n));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  window.dispatchEvent(new Event('dropick_notifications_changed'));
};

export const markAllStoredNotificationsRead = () => {
  initStorage();
  const list = getStoredNotifications();
  const updated = list.map((n) => ({ ...n, isRead: true }));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  window.dispatchEvent(new Event('dropick_notifications_changed'));
};

// User & Auth Operations
export const getStoredCurrentUser = () => {
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return raw ? JSON.parse(raw) : INITIAL_USERS[1];
};

export const setStoredCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
  window.dispatchEvent(new Event('dropick_auth_changed'));
};

export const getStoredUsers = () => {
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  return raw ? JSON.parse(raw) : INITIAL_USERS;
};

// Confirm Receipt Operation
export const confirmStoredOrderReceipt = (orderId) => {
  return updateStoredOrderStatus(orderId, 'RECEIPT_CONFIRMED');
};
