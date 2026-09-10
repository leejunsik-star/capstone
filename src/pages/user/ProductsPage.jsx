import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import ProductCard from '../../components/product/ProductCard';
import ProductFilter from '../../components/product/ProductFilter';
import { Search, Ticket, Sparkles, Filter, RefreshCw } from 'lucide-react';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialCategory = searchParams.get('category') || 'ALL';
  const initialSearch = searchParams.get('search') || '';

  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('popular');
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    if (searchParams.get('category')) {
      setCategory(searchParams.get('category'));
    }
    if (searchParams.get('search')) {
      setSearch(searchParams.get('search'));
    }
  }, [searchParams]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({
        category,
        sort,
        status,
        search,
      });
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleStorageChange = () => loadData();
    window.addEventListener('dropick_products_changed', handleStorageChange);
    return () => window.removeEventListener('dropick_products_changed', handleStorageChange);
  }, [category, sort, status, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ search, category });
    loadData();
  };

  const handleCategorySelect = (newCat) => {
    setCategory(newCat);
    setSearchParams(newCat === 'ALL' ? { search } : { category: newCat, search });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>티켓 탐색 & 실시간 경매</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            원하는 공연 티켓의 가격이 하락하는 순간을 실시간으로 확인하고 예매하세요.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="공연명, 장소 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-20 py-2.5 bg-white text-xs rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-hidden shadow-xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition"
          >
            검색
          </button>
        </form>
      </div>

      {/* Filter Component */}
      <ProductFilter
        selectedCategory={category}
        onSelectCategory={handleCategorySelect}
        selectedSort={sort}
        onSelectSort={setSort}
        selectedStatus={status}
        onSelectStatus={setStatus}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>
          총 <b className="text-purple-700 font-bold">{products.length}개</b>의 티켓 경매가 검색되었습니다.
        </span>
        <button
          onClick={loadData}
          className="flex items-center gap-1 text-gray-400 hover:text-purple-600 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>새로고침</span>
        </button>
      </div>

      {/* Grid of Products */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-80 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 space-y-3">
          <Ticket className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-bold text-gray-700 text-base">검색된 티켓이 없습니다.</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            선택한 필터 조건 또는 검색어와 일치하는 경매 상품이 없습니다. 다른 키워드로 검색해보세요.
          </p>
          <button
            onClick={() => {
              setCategory('ALL');
              setSearch('');
              setStatus('ALL');
            }}
            className="px-4 py-2 bg-purple-50 text-purple-700 font-bold rounded-xl text-xs hover:bg-purple-100 transition"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
