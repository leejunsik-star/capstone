import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { X, Bell, CheckCheck, Sparkles, TrendingDown, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationDrawer = () => {
  const { notifications, isOpen, closeDrawer, markRead, markAllRead } = useNotification();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNotificationClick = (item) => {
    markRead(item.id);
    if (item.productId) {
      navigate(`/products/${item.productId}`);
      closeDrawer();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white shadow-2xl border-l border-gray-100 flex flex-col animate-slideLeft">
          {/* Header */}
          <div className="px-5 py-4 bg-purple-50 border-b border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-600 text-white rounded-lg">
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">실시간 알림 센터</h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={markAllRead}
                className="text-xs text-purple-700 hover:text-purple-900 font-semibold px-2 py-1 hover:bg-purple-100 rounded-md transition"
                title="모두 읽음 처리"
              >
                모두 읽음
              </button>
              <button
                onClick={closeDrawer}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">새로운 알림이 없습니다.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    item.isRead
                      ? 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                      : 'bg-purple-50/60 border-purple-200 text-gray-900 hover:bg-purple-50 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="shrink-0 mt-0.5">
                      {item.type === 'PRICE_DROP' ? (
                        <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                          <TrendingDown className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                          <Ticket className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs">{item.title}</span>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{item.time}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-gray-600">{item.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-500">
              💡 관심 있는 티켓을 찜하면 가격이 떨어질 때마다 푸시 알림을 드립니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
