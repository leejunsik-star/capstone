import React from 'react';
import { TrendingUp, ChevronRight } from 'lucide-react';

export const KPICard = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  color = 'purple',
}) => {
  const colorStyles = {
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition flex flex-col justify-between gap-3">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-gray-500 block mb-1">{title}</span>
          <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
        </div>
        <div className={`p-2.5 rounded-xl border ${colorStyles[color] || colorStyles.purple}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-gray-50">
        {trend ? (
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        ) : (
          <span className="text-gray-400">{subtext}</span>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
      </div>
    </div>
  );
};

export default KPICard;
