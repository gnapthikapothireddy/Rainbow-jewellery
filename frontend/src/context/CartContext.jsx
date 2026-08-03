import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('rainbow_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [coupon, setCoupon] = useState(null);
  const [giftWrapping, setGiftWrapping] = useState(false);

  useEffect(() => {
    localStorage.setItem('rainbow_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.product.id === product.id);
      if (existing) {
        const nextQty = existing.quantity + quantity;
        if (nextQty > product.stock) {
          alert(`Cannot add more. Only ${product.stock} items left in stock.`);
          return prevItems;
        }
        return prevItems.map(item =>
          item.product.id === product.id ? { ...item, quantity: nextQty } : item
        );
      }
      if (product.stock < quantity) {
        alert('This product is out of stock.');
        return prevItems;
      }
      return [...prevItems, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          if (quantity > item.product.stock) {
            alert(`Only ${item.product.stock} items available in stock.`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    setGiftWrapping(false);
  };

  const applyCouponCode = async (code) => {
    try {
      const res = await api.validateCoupon(code, getSubtotal());
      if (res.success) {
        setCoupon(res.data);
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const discountPercent = parseFloat(item.product.discount || 0);
      const originalPrice = parseFloat(item.product.price);
      const discountValue = originalPrice * (discountPercent / 100);
      const itemPrice = originalPrice - discountValue + parseFloat(item.product.makingCharges || 0);
      return acc + (itemPrice * item.quantity);
    }, 0);
  };

  const getDiscountAmount = () => {
    const sub = getSubtotal();
    if (!coupon) return 0;
    if (coupon.discountType === 'percentage') {
      return sub * (coupon.discountValue / 100);
    }
    return coupon.discountValue;
  };

  const getGstAmount = () => {
    const discountedSub = getSubtotal() - getDiscountAmount();
    return discountedSub * 0.03; // 3% GST on jewelry
  };

  const getShippingCharges = () => {
    const discountedSub = getSubtotal() - getDiscountAmount();
    if (discountedSub <= 0) return 0;
    return discountedSub > 5000 ? 0 : 150; // free shipping over ₹5000
  };

  const getGiftWrappingCharges = () => {
    return giftWrapping ? 100 : 0;
  };

  const getCartTotal = () => {
    const sub = getSubtotal();
    const disc = getDiscountAmount();
    const gst = getGstAmount();
    const ship = getShippingCharges();
    const gift = getGiftWrappingCharges();
    return Math.max(0, sub - disc + gst + ship + gift);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      coupon,
      giftWrapping,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCouponCode,
      removeCoupon,
      getSubtotal,
      getDiscountAmount,
      getGstAmount,
      getShippingCharges,
      getGiftWrappingCharges,
      getCartTotal,
      setGiftWrapping
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
