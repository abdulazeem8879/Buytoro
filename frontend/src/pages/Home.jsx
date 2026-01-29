import { useEffect, useState, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🛒 Cart
  const { addToCart } = useContext(CartContext);

  // 🔔 Alerts
  const { showAlert } = useAlert();

  // 🔍 URL search
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

  // 🔎 Filter products
  const filteredProducts = products.filter(
    (product) =>
      product.productName
        ?.toLowerCase()
        .includes(keyword.toLowerCase()) ||
      product.brandName
        ?.toLowerCase()
        .includes(keyword.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* ===== HERO ===== */}
    {/* ===== HERO ===== */}
<section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
  {/* Glow */}
  <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
  <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/5 blur-3xl"></div>

  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center px-8 py-16">
    {/* LEFT CONTENT */}
    <div>
      <span className="inline-block mb-4 px-4 py-1 text-sm font-semibold rounded-full bg-white/10 backdrop-blur">
        ⌚ Premium Collection 2026
      </span>

      <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight">
        Elevate Your Time <br />
        <span className="bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
          With Luxury Watches
        </span>
      </h1>

      <p className="mt-5 max-w-xl text-gray-300 text-lg">
        Discover hand-picked premium watches crafted for elegance,
        performance, and timeless style.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          to="/"
          className="px-7 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition"
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

    {/* RIGHT IMAGE / CARD */}
    <div className="relative flex justify-center">
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl hover:scale-105 transition duration-500">
        <img
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
          alt="Luxury Watch"
          className="w-[260px] md:w-[300px] rounded-xl"
        />
        <div className="mt-4 text-center">
          <p className="font-semibold">Luxury Watch Series</p>
          <p className="text-sm text-gray-300">
            Starting from ₹4,999
          </p>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* ===== PRODUCTS ===== */}
      <section>
        <h2 className="text-2xl font-semibold">
          {keyword
            ? `Search results for "${keyword}"`
            : "Latest Products"}
        </h2>

        {loading && (
          <p className="mt-6 text-gray-600">
            Loading products...
          </p>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 mt-6 ">
          {!loading &&
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="border rounded-xl p-4 bg-white text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl "
              >
                <Link to={`/product/${product._id}`}>
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.productName}
                      className="w-full h-[200px] object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                </Link>

                <h3 className="mt-3 font-semibold">
                  {product.productName}
                </h3>

                <p className="mt-1">
                  {product.discountPrice > 0 ? (
                    <>
                      <span className="line-through text-gray-500 mr-2">
                        ₹{product.price}
                      </span>
                      <strong>
                        ₹{product.discountPrice}
                      </strong>
                    </>
                  ) : (
                    <>₹ {product.price}</>
                  )}
                </p>

                {/* 🛒 ADD TO CART */}
                <button
                  disabled={
                    product.stockStatus !== "in_stock"
                  }
                  onClick={() =>
                    addToCart(product, 1)
                  }
                  className={`mt-3 w-full py-2 rounded-md text-white transition
                    ${
                      product.stockStatus ===
                      "in_stock"
                        ? "bg-black hover:bg-gray-800 cursor-pointer"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                  {product.stockStatus ===
                  "in_stock"
                    ? "Add To Cart"
                    : "Out of Stock"}
                </button>

                <Link
                  to={`/product/${product._id}`}
                  className="inline-block mt-2 font-semibold text-black hover:underline"
                >
                  View Details →
                </Link>
              </div>
            ))}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <p className="mt-6 text-gray-600">
            No products found.
          </p>
        )}
      </section>
    </div>
  );
};

export default Home;
