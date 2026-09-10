import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Ticket, Lock, Mail, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      if (email.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || '로그인 중 오류가 발생했습니다.');
    }
  };

  const handleQuickDemoLogin = (role) => {
    switchRole(role);
    if (role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white mx-auto shadow-md shadow-purple-600/30">
            <Ticket className="w-6 h-6 transform -rotate-12" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            DROP<span className="text-purple-600">ICK</span> 로그인
          </h1>
          <p className="text-xs text-gray-500">
            소멸성 티켓 실시간 더치옥션 플랫폼에 오신 것을 환영합니다.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl border border-rose-100">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-700 font-bold mb-1">이메일 주소</label>
            <div className="relative">
              <input
                type="email"
                placeholder="example@dropick.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
              />
              <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">비밀번호</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
              />
              <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-md shadow-purple-600/25 transition cursor-pointer"
          >
            {isLoading ? '로그인 처리 중...' : '로그인하기'}
          </button>
        </form>

        {/* Demo 1-Click Fast Login for Presentation */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <span className="text-[11px] font-bold text-purple-700 block text-center">
            ⚡ 시연용 원클릭 빠른 로그인
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('USER')}
              className="p-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>일반 구매자</span>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('ADMIN')}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>관리자 계정</span>
            </button>
          </div>
        </div>

        {/* Bottom link */}
        <div className="text-center text-xs text-gray-500 pt-2">
          <span>계정이 없으신가요? </span>
          <Link to="/signup" className="text-purple-600 font-bold hover:underline">
            회원가입하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
