// Ticket Categories
export const CATEGORIES = [
  { id: 'ALL', label: '전체', icon: 'Sparkles' },
  { id: 'CONCERT', label: '콘서트', icon: 'Music' },
  { id: 'MUSICAL', label: '뮤지컬', icon: 'Drama' },
  { id: 'THEATER', label: '연극', icon: 'Theater' },
  { id: 'EXHIBITION', label: '전시', icon: 'Palette' },
  { id: 'SPORTS', label: '스포츠', icon: 'Trophy' },
];

// Product Statuses
export const PRODUCT_STATUS = {
  SCHEDULED: { code: 'SCHEDULED', label: '예정', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  ACTIVE: { code: 'ACTIVE', label: '진행 중', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  SOLD: { code: 'SOLD', label: '판매 완료', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  ENDED: { code: 'ENDED', label: '종료', color: 'bg-red-100 text-red-800 border-red-200' },
};

// Order Statuses
export const ORDER_STATUS = {
  PENDING: { code: 'PENDING', label: '결제 대기', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  PAID: { code: 'PAID', label: '결제 완료', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  RECEIPT_CONFIRMED: { code: 'RECEIPT_CONFIRMED', label: '수령 확인 완료', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  CANCELLED: { code: 'CANCELLED', label: '취소', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  REFUNDED: { code: 'REFUNDED', label: '환불 완료', color: 'bg-rose-100 text-rose-800 border-rose-200' },
};

// Sort Options
export const SORT_OPTIONS = [
  { id: 'popular', label: '인기순' },
  { id: 'closing', label: '마감 임박순' },
  { id: 'price_asc', label: '가격 낮은순' },
  { id: 'price_desc', label: '가격 높은순' },
  { id: 'discount', label: '하락률 높은순' },
];

// Demo fast forward steps
export const SIMULATION_SPEEDS = [
  { label: '실시간 (1x)', value: 1 },
  { label: '10초 단축', value: 10 },
  { label: '1분 단축', value: 60 },
  { label: '5분 단축', value: 300 },
];
