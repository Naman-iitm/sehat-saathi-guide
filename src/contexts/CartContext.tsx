import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppliedCoupon } from '@/types';
import { validateCoupon } from '@/data/coupons';

export interface CartItem {
  id: string;
  name: string;
  nameHi: string;
  price: number;
  quantity: number;
  image: string;
}

interface CouponResult {
  success: boolean;
  message: string;
  messageHi: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  // Coupon functionality
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string, isFirstTimeUser?: boolean) => CouponResult;
  removeCoupon: () => void;
  discount: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(() => {
    const saved = localStorage.getItem('appliedCoupon');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error parsing coupon from localStorage:', error);
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('appliedCoupon');
    }
  }, [appliedCoupon]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Coupon functionality
  const applyCoupon = (code: string, isFirstTimeUser: boolean = false): CouponResult => {
    const result = validateCoupon(code, total, isFirstTimeUser);

    if (result.isValid && result.coupon && result.discount !== undefined) {
      setAppliedCoupon({
        code: result.coupon.code,
        discount: result.discount,
        description: result.coupon.description,
        descriptionHi: result.coupon.descriptionHi,
      });
      return {
        success: true,
        message: `Coupon applied! You save ₹${result.discount}`,
        messageHi: `कूपन लागू! आपकी बचत ₹${result.discount}`,
      };
    }

    return {
      success: false,
      message: result.errorMessage || 'Invalid coupon',
      messageHi: result.errorMessageHi || 'अमान्य कूपन',
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Recalculate discount when total changes
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, total - discount);

  // Re-validate coupon when cart total changes
  useEffect(() => {
    if (appliedCoupon && total > 0) {
      const result = validateCoupon(appliedCoupon.code, total, false);
      if (result.isValid && result.discount !== undefined) {
        // Update discount if it changed
        if (result.discount !== appliedCoupon.discount) {
          setAppliedCoupon((prev) =>
            prev ? { ...prev, discount: result.discount! } : null
          );
        }
      } else {
        // Remove coupon if no longer valid
        setAppliedCoupon(null);
      }
    }
  }, [total]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discount,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
