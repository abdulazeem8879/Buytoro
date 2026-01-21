import { useEffect, useState, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/CartContext";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🛒 Cart
  const { addToCart } = useContext(CartContext);

  // 🔍 URL search
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("q") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword]);

  // 🔎 Filter products (NEW schema)
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
    <div>
      {/* HERO */}
      <section style={heroStyle}>
        <h1>Premium Watches for Every Style</h1>
        <p>Explore the best collection of branded watches</p>
        <Link to="/" style={heroBtn}>
          Shop Now
        </Link>
      </section>

      {/* PRODUCTS */}
      <section style={{ marginTop: "40px" }}>
        <h2>
          {keyword ? `Search results for "${keyword}"` : "Latest Products"}
        </h2>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={gridStyle}>
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="product-card"
              style={cardStyle}
            >
              <Link to={`/product/${product._id}`}>
                <div className="image-wrapper">
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.productName}
                  />
                </div>
              </Link>

              <h3>{product.productName}</h3>

              <p>
                {product.discountPrice > 0 ? (
                  <>
                    <span
                      style={{
                        textDecoration: "line-through",
                        marginRight: 6,
                        color: "#777",
                      }}
                    >
                      ₹{product.price}
                    </span>
                    <strong>₹{product.discountPrice}</strong>
                  </>
                ) : (
                  <>₹ {product.price}</>
                )}
              </p>

              {/* 🛒 ADD TO CART */}
              <button
                disabled={product.stockStatus !== "in_stock"}
                onClick={() => addToCart(product, 1)}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "8px",
                  background:
                    product.stockStatus === "in_stock"
                      ? "#000"
                      : "#999",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor:
                    product.stockStatus === "in_stock"
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                {product.stockStatus === "in_stock"
                  ? "Add To Cart"
                  : "Out of Stock"}
              </button>

              <Link
                to={`/product/${product._id}`}
                className="details-link"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <p>No products found.</p>
        )}
      </section>
    </div>
  );
};

export default Home;

/* ================= INLINE STYLES ================= */

const heroStyle = {
  background: "linear-gradient(to right, #000, #333)",
  color: "#fff",
  padding: "60px 30px",
  textAlign: "center",
  borderRadius: "10px",
};

const heroBtn = {
  display: "inline-block",
  marginTop: "20px",
  padding: "10px 20px",
  background: "#fff",
  color: "#000",
  textDecoration: "none",
  fontWeight: "bold",
  borderRadius: "5px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "20px",
  marginTop: "20px",
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "15px",
  textAlign: "center",
  background: "#fff",
  transition: "all 0.3s ease",
};
