import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, ShieldCheck, Clock, Zap, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-12 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Platform Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white">
                <Ticket className="w-4 h-4 transform -rotate-12" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                DROP<span className="text-purple-400">ICK</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              DROPICK은 시간이 지날수록 가격이 하락하는 더치옥션(Dutch Auction) 방식을 도입한 소멸성 티켓 가치 거래 플랫폼입니다.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-purple-400 font-medium">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> 100% 안심 거래</span>
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> 즉시 QR 발권</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">서비스 바로가기</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products" className="hover:text-purple-400 transition">전체 티켓 경매</Link></li>
              <li><Link to="/products?category=CONCERT" className="hover:text-purple-400 transition">콘서트 티켓</Link></li>
              <li><Link to="/products?category=MUSICAL" className="hover:text-purple-400 transition">뮤지컬 & 연극</Link></li>
              <li><Link to="/products?category=SPORTS" className="hover:text-purple-400 transition">스포츠 경기</Link></li>
              <li><Link to="/wishlist" className="hover:text-purple-400 transition">찜 & 하락 알림</Link></li>
            </ul>
          </div>

          {/* Dutch Auction Guide */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">더치옥션 이용 안내</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="text-purple-400 font-bold">•</span>
                <span>정해진 주기마다 가격이 자동으로 일정 금액 하락합니다.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-400 font-bold">•</span>
                <span>원하는 가격에 도달했을 때 즉시 구매할 수 있습니다.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-400 font-bold">•</span>
                <span>다른 사용자가 먼저 구매하면 해당 티켓은 즉시 마감됩니다.</span>
              </li>
            </ul>
          </div>

          {/* Customer Center */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">고객센터</h4>
            <p className="text-xl font-extrabold text-white mb-1">1544-0000</p>
            <p className="text-xs text-slate-400 mb-3">평일 09:00 ~ 18:00 (주말 및 공휴일 휴무)</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>support@dropick.com</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>토스페이먼츠 에스크로 안전결제 적용</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 DROPICK (드로픽). 캡스톤 디자인 프로젝트. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">이용약관</span>
            <span className="hover:text-slate-300 cursor-pointer">개인정보처리방침</span>
            <span className="hover:text-slate-300 cursor-pointer">전자금융거래약관</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
