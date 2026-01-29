import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🛒 Cart
  const { addToCart } = useContext(CartContext);

  // 🔔 Alerts
  const { showAlert } = useAlert();

  // 🔥 FILTER STATE
  const [filters, setFilters] = useState({
    category: "all",
    gender: "all",
    brand: "all",
    price: "all",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔍 FILTER LOGIC (UNCHANGED)
  const filteredProducts = products.filter((product) => {
    if (
      filters.category !== "all" &&
      product.category !== filters.category
    )
      return false;

    if (
      filters.gender !== "all" &&
      product.gender !== filters.gender
    )
      return false;

    if (
      filters.brand !== "all" &&
      product.brandName !== filters.brand
    )
      return false;

    const price =
      product.discountPrice > 0
        ? product.discountPrice
        : product.price;

    if (filters.price === "0-2000" && price > 2000)
      return false;
    if (
      filters.price === "2000-5000" &&
      (price < 2000 || price > 5000)
    )
      return false;
    if (filters.price === "5000+" && price < 5000)
      return false;

    return true;
  });

  const brands = [
    ...new Set(products.map((p) => p.brandName)),
  ];

  if (loading) {
    return (
      <div className="text-center p-10 text-lg">
        Loading products...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-12 gap-6">
      {/* ===== SIDEBAR ===== */}
      <aside className="col-span-12 md:col-span-3 bg-white rounded-xl shadow-md p-5 space-y-6 sticky top-6 h-fit">
        <h2 className="text-xl font-bold border-b pb-3">
          Filters
        </h2>

        {/* CATEGORY */}
        <div>
          <h3 className="font-semibold mb-2">Category</h3>
          {["all", "Smartwatch", "analog"].map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setFilters({ ...filters, category: cat })
              }
              className={`block w-full text-left px-3 py-2 rounded-md transition
                ${
                  filters.category === cat
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GENDER */}
        <div>
          <h3 className="font-semibold mb-2">Gender</h3>
          {["all", "men", "women"].map((g) => (
            <button
              key={g}
              onClick={() =>
                setFilters({ ...filters, gender: g })
              }
              className={`block w-full text-left px-3 py-2 rounded-md transition
                ${
                  filters.gender === g
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* BRAND */}
        <div>
          <h3 className="font-semibold mb-2">Brand</h3>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={filters.brand}
            onChange={(e) =>
              setFilters({
                ...filters,
                brand: e.target.value,
              })
            }
          >
            <option value="all">All</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* PRICE */}
        <div>
          <h3 className="font-semibold mb-2">Price</h3>
          {[
            { label: "All", value: "all" },
            { label: "Below ₹2000", value: "0-2000" },
            { label: "₹2000 - ₹5000", value: "2000-5000" },
            { label: "Above ₹5000", value: "5000+" },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() =>
                setFilters({ ...filters, price: p.value })
              }
              className={`block w-full text-left px-3 py-2 rounded-md transition
                ${
                  filters.price === p.value
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </aside>

      {/* ===== PRODUCTS ===== */}
      <section className="col-span-12 md:col-span-9">
        <h1 className="text-3xl font-bold mb-6">
          Products
        </h1>

        {filteredProducts.length === 0 && (
          <p className="text-gray-600">
            No products found
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg bg-white p-3 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <Link to={`/product/${product._id}`}>
                {/* IMAGE FIX (1.1 RATIO SAFE) */}
                <div className="bg-gray-100 rounded-md h-[180px] flex items-center justify-center overflow-hidden">
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.productName}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </Link>

              <h3  className="mt-2 font-semibold text-base">
                {product.productName}
              </h3>

              <p className="mt-0.5 text-sm">
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
                  <strong>₹{product.price}</strong>
                )}
              </p>

              {/* 🛒 ADD TO CART — HOME JAISE */}
              <button
                disabled={
                  product.stockStatus !== "in_stock"
                }
                onClick={() => {
                  addToCart(product, 1);
                  showAlert(
                    "Product added to cart",
                    "success"
                  );
                }}
                className={`mt-2 w-full py-1.5 rounded-md text-sm text-white transition
                  ${
                    product.stockStatus === "in_stock"
                      ? "bg-black hover:bg-gray-800"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                {product.stockStatus === "in_stock"
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
      </section>
    </div>
  );
};

export default Products;
