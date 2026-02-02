import { useContext, useEffect, useState } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { Heart } from "lucide-react";

const Wishlist = () => {
  const { wishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        if (!wishlist || wishlist.length === 0) {
          setProducts([]);
          return;
        }

        // backend se wishlist products lao
        const { data } = await api.post("/products/id", {
          ids: wishlist,
        });

        setProducts(data);
      } catch (err) {
        console.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Heart size={40} className="text-gray-400 mb-4" />
        <p className="text-lg font-medium">
          Please login to view your wishlist
        </p>
        <Link
          to="/login"
          className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:opacity-80"
        >
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        Loading wishlist...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        My Wishlist
      </h1>

      {products.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-10 text-center">
          <Heart size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Your wishlist is empty
          </p>

          <Link
            to="/products"
            className="inline-block mt-6 px-6 py-2 bg-black text-white rounded-lg hover:opacity-80"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
