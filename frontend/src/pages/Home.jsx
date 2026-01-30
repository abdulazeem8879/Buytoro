import { useEffect, useState, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";
import { ShoppingCart } from "lucide-react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useContext(CartContext);
  const { showAlert } = useAlert();

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("q") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (err) {
        showAlert("Failed to load products", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, showAlert]);

  const filteredProducts = products.filter(
    (product) =>
      product.productName?.toLowerCase().includes(keyword.toLowerCase()) ||
      product.brandName?.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="space-y-14">

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden rounded-2xl bg-black dark:bg-black text-white">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8 py-20">
          {/* LEFT */}
          <div>
            <span className="inline-block mb-5 px-4 py-1 text-xs font-semibold rounded-full border border-white/20">
              ⌚ Premium Collection 2026
            </span>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight">
              Elevate Your Time <br />
              <span className="text-slate-300">
                With Luxury Watches
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-slate-300 text-lg">
              Discover hand-picked premium watches crafted for elegance,
              performance, and timeless style.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/"
                className="px-7 py-3 bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition"
              >
                Shop Now
              </Link>

              <Link
                to="/products"
                className="px-7 py-3 border border-white/30 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Explore Collection
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl hover:scale-105 transition duration-500">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                alt="Luxury Watch"
                className="w-[260px] md:w-[300px] rounded-xl"
              />
              <div className="mt-4 text-center">
                <p className="font-semibold">Luxury Watch Series</p>
                <p className="text-sm text-slate-300">
                  Starting from ₹4,999
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS ===== */}
      <section>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          {keyword ? `Search results for "${keyword}"` : "Latest Products"}
        </h2>

        {loading && (
          <p className="mt-6 text-slate-500">
            Loading products...
          </p>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 mt-8">
          {!loading &&
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="group border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-black text-center transition hover:-translate-y-1 hover:shadow-xl"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.productName}
                      className="w-full h-[200px] object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </Link>

                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  {product.productName}
                </h3>

                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  {product.discountPrice > 0 ? (
                    <>
                      <span className="line-through text-slate-400 mr-2">
                        ₹{product.price}
                      </span>
                      <strong>₹{product.discountPrice}</strong>
                    </>
                  ) : (
                    <>₹ {product.price}</>
                  )}
                </p>

                {/* ADD TO CART */}
                <button
                  disabled={product.stockStatus !== "in_stock"}
                  onClick={() => addToCart(product, 1)}
                  className={`mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition
                    ${
                      product.stockStatus === "in_stock"
                        ? "bg-black text-white hover:opacity-80 dark:bg-white dark:text-black"
                        : "bg-slate-300 text-slate-600 cursor-not-allowed"
                    }`}
                >
                  <ShoppingCart size={16} />
                  {product.stockStatus === "in_stock"
                    ? "Add To Cart"
                    : "Out of Stock"}
                </button>

                <Link
                  to={`/product/${product._id}`}
                  className="inline-block mt-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:underline"
                >
                  View Details →
                </Link>
              </div>
            ))}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <p className="mt-6 text-slate-500">
            No products found.
          </p>
        )}
      </section>
    </div>
  );
};

export default Home;
