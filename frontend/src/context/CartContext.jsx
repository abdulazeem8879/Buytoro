import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Page load par cart restore karo
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Har change par localStorage update
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart
  const addToCart = (product, qty = 1) => {
    const existItem = cartItems.find(
      (item) => item._id === product._id
    );

    if (existItem) {
      setCartItems(
        cartItems.map((item) =>
          item._id === existItem._id
            ? { ...item, qty: item.qty + qty }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty }]);
    }
  };

  // Remove item
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item._id !== id));
  };

  // Update quantity
  const updateQty = (id, qty) => {
    setCartItems(
      cartItems.map((item) =>
        item._id === id ? { ...item, qty } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQty }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
