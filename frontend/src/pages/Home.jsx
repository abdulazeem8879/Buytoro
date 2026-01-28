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
      <section className="bg-gradient-to-r from-black to-gray-800 text-white p-14 text-center rounded-xl">
        <h1 className="text-3xl font-bold">
          Premium Watches for Every Style
        </h1>
        <p className="mt-3 text-gray-300">
          Explore the best collection of branded watches
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-2 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition"
        >
          Shop Now
        </Link>
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
