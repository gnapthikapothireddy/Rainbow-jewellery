import React, { createContext, useState, useEffect, useContext } from 'react';
import { useCart } from './CartContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('rainbow_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const { addToCart } = useCart();

  useEffect(() => {
    localStorage.setItem('rainbow_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(p => p.id !== productId));
  };

  const moveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(p => p.id === productId);
  };

  const shareWishlist = () => {
    const ids = wishlistItems.map(p => p.id).join(',');
    const shareUrl = `${window.location.origin}/shop?wishlistIds=${ids}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Wishlist sharing link copied to clipboard!');
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      moveToCart,
      isInWishlist,
      shareWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
