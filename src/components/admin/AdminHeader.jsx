import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSimulation } from '../../context/SimulationContext';
import { Bell, Search, Shield, User, Clock } from 'lucide-react';

export const AdminHeader = ({ title = '관리자 대시보드' }) => {
  const { user } = useAuth();
  const { simulatedDate } = useSimulation();

  const formattedDate = simulatedDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
        <p className="text-xs text-gray-500">
          관리자님, 오늘 하루도 DROPICK 경매 플랫폼을 효율적으로 운영해보세요!
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Live Admin Date Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 font-medium">
          <Clock className="w-3.5 h-3.5 text-purple-600" />
          <span>{formattedDate}</span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {user?.name?.slice(0, 1) || '관'}
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-bold text-gray-800 block leading-tight">
              {user?.name || '관리자'}
            </span>
            <span className="text-[10px] text-purple-600 font-semibold block">최고 관리자 (Super Admin)</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
