import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useContext(CartContext);
  const { showAlert } = useAlert();

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

  const filteredProducts = products.filter((product) => {
    if (filters.category !== "all" && product.category !== filters.category)
      return false;

    if (filters.gender !== "all" && product.gender !== filters.gender)
      return false;

    if (filters.brand !== "all" && product.brandName !== filters.brand)
      return false;

    const price =
      product.discountPrice > 0
        ? product.discountPrice
        : product.price;

    if (filters.price === "0-2000" && price > 2000) return false;
    if (filters.price === "2000-5000" && (price < 2000 || price > 5000))
      return false;
    if (filters.price === "5000+" && price < 5000) return false;

    return true;
  });

  const brands = [...new Set(products.map((p) => p.brandName))];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-lg font-medium">
        Loading products...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-12 gap-8">
      {/* ===== SIDEBAR ===== */}
      <aside className="col-span-12 md:col-span-3 bg-white rounded-2xl shadow p-6 space-y-6 sticky top-6 h-fit">
        <h2 className="text-xl font-bold border-b pb-3">
          Filters
        </h2>

        {/* CATEGORY */}
        <div>
          <h3 className="font-semibold mb-3">Category</h3>
          {["all", "Smartwatch", "analog"].map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setFilters({ ...filters, category: cat })
              }
              className={`w-full text-left px-4 py-2 rounded-lg text-sm transition
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
          <h3 className="font-semibold mb-3">Gender</h3>
          {["all", "men", "women"].map((g) => (
            <button
              key={g}
              onClick={() =>
                setFilters({ ...filters, gender: g })
              }
              className={`w-full text-left px-4 py-2 rounded-lg text-sm transition
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
          <h3 className="font-semibold mb-3">Brand</h3>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            value={filters.brand}
            onChange={(e) =>
              setFilters({ ...filters, brand: e.target.value })
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
          <h3 className="font-semibold mb-3">Price</h3>
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
              className={`w-full text-left px-4 py-2 rounded-lg text-sm transition
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
        <h1 className="text-3xl font-bold mb-8">
          Products
        </h1>

        {filteredProducts.length === 0 && (
          <p className="text-gray-600">
            No products found
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl p-4 text-center border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <Link to={`/product/${product._id}`}>
                <div className="bg-gray-100 rounded-xl h-[190px] flex items-center justify-center overflow-hidden">
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.productName}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </Link>

              <h3 className="mt-3 font-semibold text-sm line-clamp-2">
                {product.productName}
              </h3>

              <p className="mt-1 text-sm">
                {product.discountPrice > 0 ? (
                  <>
                    <span className="line-through text-gray-400 mr-2">
                      ₹{product.price}
                    </span>
                    <span className="font-bold">
                      ₹{product.discountPrice}
                    </span>
                  </>
                ) : (
                  <span className="font-bold">
                    ₹{product.price}
                  </span>
                )}
              </p>

              <button
                disabled={product.stockStatus !== "in_stock"}
                onClick={() => {
                  addToCart(product, 1);
                  showAlert("Product added to cart", "success");
                }}
                className={`mt-3 w-full py-2 rounded-lg text-sm text-white transition
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
                className="inline-block mt-3 text-sm font-semibold hover:underline"
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
