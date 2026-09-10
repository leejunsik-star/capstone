import React from 'react';
import { PRODUCT_STATUS, ORDER_STATUS } from '../../utils/constants';

export const ProductStatusBadge = ({ status }) => {
  const meta = PRODUCT_STATUS[status] || { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.color}`}>
      {meta.label}
    </span>
  );
};

export const OrderStatusBadge = ({ status }) => {
  const meta = ORDER_STATUS[status] || { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.color}`}>
      {meta.label}
    </span>
  );
};

export default ProductStatusBadge;
