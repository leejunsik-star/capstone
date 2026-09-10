import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { formatPrice } from '../../utils/formatters';
import { Users, Search, UserCheck, Shield, Ban } from 'lucide-react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminService.getUsers({ search });
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search]);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            <span>회원 및 권한 관리</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            등록된 일반 구매자 및 관리자 계정, 주문 활동 내역을 조회합니다.
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            placeholder="회원 이름 또는 이메일 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-white text-xs rounded-xl border border-gray-200 outline-hidden focus:border-purple-600 shadow-xs"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase text-[11px]">
                <th className="py-3.5 px-5">회원번호</th>
                <th className="py-3.5 px-4">이름 / 이메일</th>
                <th className="py-3.5 px-4">권한</th>
                <th className="py-3.5 px-4">가입일</th>
                <th className="py-3.5 px-4 text-center">주문 수</th>
                <th className="py-3.5 px-4 text-right">총 결제 금액</th>
                <th className="py-3.5 px-5 text-center">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-purple-50/30 transition">
                  <td className="py-4 px-5 font-mono text-gray-400">
                    USR-{String(u.id).padStart(4, '0')}
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-0.5">
                      <b className="text-gray-900 font-bold block">{u.name}</b>
                      <span className="text-[11px] text-gray-400">{u.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {u.role === 'ADMIN' ? (
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold border border-purple-200 flex items-center gap-1 w-fit">
                        <Shield className="w-3 h-3" /> 관리자
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold w-fit block">
                        일반 구매자
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-gray-500">{u.joinDate}</td>
                  <td className="py-4 px-4 text-center font-bold text-gray-800">{u.orderCount}건</td>
                  <td className="py-4 px-4 text-right font-black text-gray-900">{formatPrice(u.totalSpent)}</td>
                  <td className="py-4 px-5 text-center">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                      정상
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
