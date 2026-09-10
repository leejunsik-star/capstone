import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, RefreshCw, Ticket } from 'lucide-react';

export const PaymentFailPage = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || '결제 진행 중 오류가 발생했거나 다른 사용자가 먼저 구매하였습니다.';

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            결제를 완료하지 못했습니다
          </h1>
          <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-3 rounded-xl border border-rose-100 leading-relaxed">
            {reason}
          </p>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
          더치옥션은 단 1명의 구매자에게만 티켓이 판매되므로 다른 사용자의 결제가 먼저 완료된 경우 자동으로 거래가 취소됩니다.
        </p>

        <div className="space-y-2 pt-2">
          <Link
            to="/products"
            className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/25 transition flex items-center justify-center gap-1.5"
          >
            <Ticket className="w-4 h-4" />
            <span>다른 실시간 경매 티켓 둘러보기</span>
          </Link>
          <Link
            to="/"
            className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold border border-gray-200 transition block"
          >
            홈으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailPage;
