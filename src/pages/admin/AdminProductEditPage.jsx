import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import PriceDropChart from '../../components/admin/PriceDropChart';
import { CATEGORIES } from '../../utils/constants';
import { Edit2, ChevronLeft, TrendingDown } from 'lucide-react';

export const AdminProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const prod = await productService.getProductById(id);
        if (prod) {
          setFormData({
            ...prod,
            auctionStartTime: new Date(prod.auctionStartTime).toISOString().slice(0, 16),
            auctionEndTime: new Date(prod.auctionEndTime).toISOString().slice(0, 16),
            eventDate: new Date(prod.eventDate).toISOString().slice(0, 16),
          });
        } else {
          navigate('/admin/products');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      const found = CATEGORIES.find(c => c.id === value);
      setFormData(prev => ({
        ...prev,
        category: value,
        categoryLabel: found ? found.label : value,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name.includes('Price') || name.includes('Amount') || name.includes('Interval') || name === 'remainingSeats'
          ? Number(value) || 0
          : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await productService.updateProduct(id, {
        ...formData,
        auctionStartTime: new Date(formData.auctionStartTime).toISOString(),
        auctionEndTime: new Date(formData.auctionEndTime).toISOString(),
        eventDate: new Date(formData.eventDate).toISOString(),
      });
      alert('상품 정보 및 경매 설정이 수정되었습니다.');
      navigate('/admin/products');
    } catch (err) {
      alert('수정 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="p-8 text-center text-gray-500 text-xs">
        상품 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-purple-600 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>상품 목록으로 돌아가기</span>
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Edit2 className="w-6 h-6 text-purple-600" />
          <span>더치옥션 상품 수정 (ID: {id})</span>
        </h1>
        <p className="text-xs text-gray-500">
          상품 정보와 가격 하락 조건을 수정하고 실시간 시뮬레이션을 재계산합니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">
              공연 및 좌석 정보
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 font-bold mb-1">공연명</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">카테고리</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                  >
                    {CATEGORIES.filter(c => c.id !== 'ALL').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">공연 장소</label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">공연 일시</label>
                  <input
                    type="datetime-local"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">배정 좌석</label>
                  <input
                    type="text"
                    name="seat"
                    value={formData.seat}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-purple-600" />
              <span>더치옥션 가격 하락 조건</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-bold mb-1">시작 가격</label>
                <input
                  type="number"
                  name="startPrice"
                  step="1000"
                  value={formData.startPrice}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-bold text-purple-700"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">최저 가격</label>
                <input
                  type="number"
                  name="minPrice"
                  step="1000"
                  value={formData.minPrice}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-bold text-rose-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-bold mb-1">1회 하락 금액</label>
                <input
                  type="number"
                  name="dropAmount"
                  step="500"
                  value={formData.dropAmount}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-bold"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">하락 주기 (초 단위)</label>
                <select
                  name="dropInterval"
                  value={formData.dropInterval}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 font-bold"
                >
                  <option value="60">1분마다</option>
                  <option value="180">3분마다</option>
                  <option value="300">5분마다</option>
                  <option value="600">10분마다 (표준)</option>
                  <option value="1800">30분마다</option>
                  <option value="3600">1시간마다</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-purple-600/25 transition cursor-pointer"
          >
            {saving ? '저장 중...' : '상품 수정사항 저장'}
          </button>
        </div>

        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <PriceDropChart
            config={{
              startPrice: formData.startPrice,
              minPrice: formData.minPrice,
              dropAmount: formData.dropAmount,
              dropInterval: formData.dropInterval,
              auctionStartTime: formData.auctionStartTime,
              auctionEndTime: formData.auctionEndTime,
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default AdminProductEditPage;
