import React from 'react';
import { CATEGORIES, SORT_OPTIONS } from '../../utils/constants';
import { Filter, ArrowDownUp, Sparkles, Music, Drama, Palette, Trophy, Theater } from 'lucide-react';

const iconMap = {
  Sparkles,
  Music,
  Drama,
  Theater,
  Palette,
  Trophy,
};

export const ProductFilter = ({
  selectedCategory = 'ALL',
  onSelectCategory,
  selectedSort = 'popular',
  onSelectSort,
  selectedStatus = 'ALL',
  onSelectStatus,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs space-y-4">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.icon] || Sparkles;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub Filter Strip (Status & Sort) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
        {/* Status filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 font-medium">상태:</span>
          {[
            { id: 'ALL', label: '전체' },
            { id: 'ACTIVE', label: '진행 중' },
            { id: 'SCHEDULED', label: '예정' },
            { id: 'SOLD', label: '판매 완료' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => onSelectStatus(st.id)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                selectedStatus === st.id
                  ? 'bg-purple-100 text-purple-800'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <ArrowDownUp className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={selectedSort}
            onChange={(e) => onSelectSort(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg px-2.5 py-1.5 outline-hidden focus:border-purple-600 cursor-pointer"
          >
            {SORT_OPTIONS.map((sort) => (
              <option key={sort.id} value={sort.id}>
                {sort.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
