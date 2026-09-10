import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Ticket, Lock, Mail, User, Phone, CheckCircle2 } from 'lucide-react';

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup({ name, email, phone, password });
      alert('회원가입이 완료되었습니다! DROPICK에 오신 것을 환영합니다.');
      navigate('/');
    } catch (err) {
      setError(err.message || '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white mx-auto shadow-md shadow-purple-600/30">
            <Ticket className="w-6 h-6 transform -rotate-12" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            DROP<span className="text-purple-600">ICK</span> 회원가입
          </h1>
          <p className="text-xs text-gray-500">
            가입 즉시 실시간 더치옥션 알림 및 안심 예매 서비스를 이용하실 수 있습니다.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl border border-rose-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-gray-700 font-bold mb-1">성함</label>
            <div className="relative">
              <input
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
              />
              <User className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">이메일 계정</label>
            <div className="relative">
              <input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
              />
              <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">휴대폰 번호</label>
            <div className="relative">
              <input
                type="tel"
                placeholder="010-1234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
              />
              <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">비밀번호</label>
            <div className="relative">
              <input
                type="password"
                placeholder="8자리 이상 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
              />
              <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-md shadow-purple-600/25 transition cursor-pointer mt-2"
          >
            {isLoading ? '가입 처리 중...' : '회원가입 완료하기'}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2">
          <span>이미 계정이 있으신가요? </span>
          <Link to="/login" className="text-purple-600 font-bold hover:underline">
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
