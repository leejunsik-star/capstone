/**
 * Format currency with Korean Won
 * e.g., 98000 -> "98,000원" or "98,000"
 */
export const formatPrice = (amount, includeUnit = true) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '0원';
  const formatted = Math.round(amount).toLocaleString('ko-KR');
  return includeUnit ? `${formatted}원` : formatted;
};

/**
 * Format event date to friendly Korean string
 * e.g., "2026-09-28T19:00:00" -> "2026.09.28 (토) 19:00"
 */
export const formatEventDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayName = days[date.getDay()];
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day} (${dayName}) ${hours}:${minutes}`;
};

/**
 * Format simple date YYYY.MM.DD
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
};

/**
 * Format remaining seconds into HH:MM:SS format
 * e.g. 8130 -> "02:15:30"
 */
export const formatSecondsToTimer = (totalSeconds) => {
  if (!totalSeconds || totalSeconds < 0) return '00:00:00';
  const s = Math.floor(totalSeconds);
  const hours = String(Math.floor(s / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const seconds = String(s % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * Format interval in seconds to human readable (e.g. 600 -> "10분", 3600 -> "1시간")
 */
export const formatInterval = (seconds) => {
  if (!seconds || seconds <= 0) return '0초';
  if (seconds < 60) return `${seconds}초`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}분`;
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return remMinutes > 0 ? `${hours}시간 ${remMinutes}분` : `${hours}시간`;
};

/**
 * Calculate drop percentage between startPrice and currentPrice
 */
export const calculateDropPercent = (startPrice, currentPrice) => {
  if (!startPrice || startPrice <= 0 || !currentPrice) return 0;
  const percent = ((startPrice - currentPrice) / startPrice) * 100;
  return Math.max(0, Math.round(percent));
};
