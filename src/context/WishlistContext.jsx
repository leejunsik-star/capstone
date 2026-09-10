import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredWishlist, toggleStoredWishlist } from '../services/mockStorage';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(getStoredWishlist());

  useEffect(() => {
    const handleWishlistChange = () => {
      setWishlist(getStoredWishlist());
    };
    window.addEventListener('dropick_wishlist_changed', handleWishlistChange);
    return () => window.removeEventListener('dropick_wishlist_changed', handleWishlistChange);
  }, []);

  const toggleWishlist = (productId) => {
    const isAdded = toggleStoredWishlist(productId);
    return isAdded;
  };

  const isWishlisted = (productId) => {
    return wishlist.includes(Number(productId));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
