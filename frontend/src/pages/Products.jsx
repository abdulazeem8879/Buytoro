import { useEffect, useState } from "react";
import api from "../services/api";
import { useAlert } from "../context/AlertContext";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } catch {
        showAlert("Failed to load products", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [showAlert]);

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
      <div className="flex justify-center items-center min-h-[60vh] text-lg font-medium">
        Loading products...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-12 gap-8">
      {/* ===== SIDEBAR ===== */}
      <aside
        className="
          col-span-12 md:col-span-3
          bg-white dark:bg-gray-900
          border border-slate-200 dark:border-slate-700
          rounded-2xl shadow
          p-6 space-y-6
          sticky top-6 h-fit
        "
      >
        <h2 className="text-xl font-bold border-b border-slate-200 dark:border-slate-700 pb-3">
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
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
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
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
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
            className="
              w-full border rounded-lg px-3 py-2 text-sm
              bg-white dark:bg-gray-800
              border-slate-300 dark:border-slate-600
              focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
            "
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
          <h3 className="font-semibold mb-3">Price</h3>
          {[
            { label: "All", value: "all" },
            { label: "Below ₹2000", value: "0-2000" },
            {
              label: "₹2000 - ₹5000",
              value: "2000-5000",
            },
            { label: "Above ₹5000", value: "5000+" },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() =>
                setFilters({
                  ...filters,
                  price: p.value,
                })
              }
              className={`w-full text-left px-4 py-2 rounded-lg text-sm transition
                ${
                  filters.price === p.value
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
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
          <p className="text-gray-600 dark:text-gray-400">
            No products found
          </p>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Products;
