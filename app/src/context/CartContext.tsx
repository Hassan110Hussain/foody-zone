import React, { createContext, useContext, useState, useCallback } from "react";
import { CartItem, Food } from "../types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (food: Food, quantity: number) => void;
  removeFromCart: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((food: Food, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.foodId === food.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.foodId === food.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevCart,
        {
          id: `${food.id}-${Date.now()}`,
          foodId: food.id,
          quantity,
          addedAt: Date.now(),
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((foodId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.foodId !== foodId));
  }, []);

  const updateQuantity = useCallback((foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.foodId === foodId ? { ...item, quantity } : item
        )
      );
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
