import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔁 Fetch wishlist when user logs in
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users/wishlist");
      setWishlist(data);
    } catch (err) {
      console.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  // ❤️ Toggle wishlist (add / remove)
  const toggleWishlist = async (productId) => {
    try {
      const { data } = await api.post(
        `/users/wishlist/${productId}`
      );
      setWishlist(data.wishlist);
    } catch (err) {
      console.error("Wishlist toggle failed");
    }
  };

  // ✅ Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(
      (p) =>
        p._id === productId ||
        p.toString() === productId
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
