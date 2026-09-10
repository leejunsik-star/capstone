import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FastForward, RotateCcw, Clock, ShieldCheck, User, ChevronDown, ChevronUp } from 'lucide-react';

export const SimulationBar = () => {
  const { simulatedDate, offsetSec, fastForward, resetSimulation } = useSimulation();
  const { user, isAdmin, switchRole } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const formattedTime = simulatedDate.toLocaleTimeString('ko-KR', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <aside aria-label="데모 시뮬레이션 패널" className="fixed bottom-16 md:bottom-4 right-4 z-50 transition-all duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden text-xs">
        {/* Bar Header */}
        <div className="px-3.5 py-2 bg-slate-800/80 flex items-center justify-between gap-3 border-b border-slate-700/50">
          <div className="flex items-center gap-1.5 font-medium text-purple-300">
            <Clock className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>경매 시뮬레이터</span>
            {offsetSec > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/30">
                +{Math.floor(offsetSec / 60)}분 경과
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-purple-200 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {formattedTime}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition"
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expanded Controls */}
        {isExpanded && (
          <div className="p-3 space-y-2.5">
            {/* Fast Forward Buttons */}
            <div>
              <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between">
                <span>더치옥션 가격 하락 테스트</span>
                <span className="text-purple-400 font-medium">실시간 적용</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => fastForward(60)}
                  className="flex-1 px-2 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition flex items-center justify-center gap-1 active:scale-95"
                  title="1분 경과 (가격 하락 촉진)"
                >
                  <FastForward className="w-3 h-3" /> +1분
                </button>
                <button
                  onClick={() => fastForward(300)}
                  className="flex-1 px-2 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-medium transition active:scale-95"
                  title="5분 경과"
                >
                  +5분
                </button>
                <button
                  onClick={() => fastForward(600)}
                  className="flex-1 px-2 py-1.5 bg-purple-800 hover:bg-purple-700 text-white rounded-lg font-medium transition active:scale-95"
                  title="10분 경과"
                >
                  +10분
                </button>
                {offsetSec > 0 && (
                  <button
                    onClick={resetSimulation}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition active:scale-95"
                    title="현재 시간으로 초기화"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Mode Switcher */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400">시연 계정 전환</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    switchRole('USER');
                    if (location.pathname.startsWith('/admin')) {
                      navigate('/');
                    }
                  }}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition ${
                    !isAdmin
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-3 h-3" /> 일반회원
                </button>
                <button
                  onClick={() => {
                    switchRole('ADMIN');
                    if (!location.pathname.startsWith('/admin')) {
                      navigate('/admin');
                    }
                  }}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition ${
                    isAdmin
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" /> 관리자
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SimulationBar;
