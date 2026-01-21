import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/CartContext";

const ProductDetail = () => {
  // Context
  const { addToCart } = useContext(CartContext);
  const [qty, setQty] = useState(1);

  const { id } = useParams(); // product id from URL

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch single product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setSelectedImage(data.images?.[0]?.url || "");
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <h2>Loading product...</h2>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return null;

  return (
    <div style={pageStyle}>
      {/* LEFT: Image Gallery */}
      <div style={leftStyle}>
        <img
          src={selectedImage}
          alt={product.productName}
          style={mainImageStyle}
        />

        <div style={thumbsStyle}>
          {product.images?.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt="thumb"
              style={{
                ...thumbStyle,
                border:
                  selectedImage === img.url
                    ? "2px solid black"
                    : "1px solid #ccc",
              }}
              onClick={() => setSelectedImage(img.url)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: Product Info */}
      <div style={rightStyle}>
        <h1>{product.productName}</h1>

        <p>
          <strong>Brand:</strong> {product.brandName}
        </p>

        <p>
          <strong>Price:</strong>{" "}
          {product.discountPrice > 0 ? (
            <>
              <span style={{ textDecoration: "line-through", marginRight: 8 }}>
                ₹{product.price}
              </span>
              <span style={{ fontWeight: "bold" }}>
                ₹{product.discountPrice}
              </span>
            </>
          ) : (
            <>₹{product.price}</>
          )}
        </p>

        <p>{product.shortDescription}</p>

        <p>
          <strong>Status:</strong>{" "}
          {product.stockStatus === "in_stock" ? "In Stock" : "Out of Stock"}
        </p>

        {product.stockStatus === "in_stock" && (
          <div>
            <label>Qty</label>
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            >
              {[
                ...Array(
                  Math.min(product.stockQuantity, 10)
                ).keys(),
              ].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          className="px-5 py-2 bg-blue-500 text-white rounded-md 
          hover:bg-blue-600 transition-colors duration-200"
          disabled={product.stockStatus !== "in_stock"}
          onClick={() => addToCart(product, qty)}
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;

// ---------------- STYLES ----------------

const pageStyle = {
  display: "flex",
  gap: "40px",
  padding: "20px",
};

const leftStyle = {
  width: "45%",
};

const rightStyle = {
  width: "55%",
};

const mainImageStyle = {
  width: "100%",
  aspectRatio: "1 / 1.1",
  objectFit: "contain",
  borderRadius: "8px",
  maxHeight: "70vh",
};

const thumbsStyle = {
  display: "flex",
  gap: "10px",
  marginTop: "10px",
};

const thumbStyle = {
  width: "70px",
  height: "70px",
  objectFit: "cover",
  cursor: "pointer",
  borderRadius: "4px",
};
