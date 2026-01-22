import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/CartContext";

const ProductDetail = () => {
  const { addToCart } = useContext(CartContext);
  const [qty, setQty] = useState(1);

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [activeMedia, setActiveMedia] = useState(null); // { type: "image" | "video", url }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);

        // default media = first image
        if (data.images?.length > 0) {
          setActiveMedia({ type: "image", url: data.images[0].url });
        } else if (data.productVideo?.url) {
          setActiveMedia({ type: "video", url: data.productVideo.url });
        }
      } catch {
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
      {/* LEFT: MEDIA */}
      <div style={leftStyle}>
        {/* MAIN MEDIA */}
        {activeMedia?.type === "image" && (
          <img
            src={activeMedia.url}
            alt={product.productName}
            style={mainMediaStyle}
          />
        )}

        {activeMedia?.type === "video" && (
          <video
            src={activeMedia.url}
            style={mainMediaStyle}
            controls
            muted       // 🔇 ALWAYS MUTED
            autoPlay
          />
        )}

        {/* THUMBNAILS */}
        <div style={thumbsStyle}>
          {/* IMAGE THUMBS */}
          {product.images?.map((img, index) => (
            <img
              key={`img-${index}`}
              src={img.url}
              alt="thumb"
              style={{
                ...thumbStyle,
                border:
                  activeMedia?.url === img.url
                    ? "2px solid black"
                    : "1px solid #ccc",
              }}
              onClick={() =>
                setActiveMedia({ type: "image", url: img.url })
              }
            />
          ))}

          {/* VIDEO THUMB */}
          {product.productVideo?.url && (
            <div
              style={{
                ...thumbStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                background: "#000",
                color: "#fff",
                cursor: "pointer",
                border:
                  activeMedia?.type === "video"
                    ? "2px solid black"
                    : "1px solid #ccc",
              }}
              onClick={() =>
                setActiveMedia({
                  type: "video",
                  url: product.productVideo.url,
                })
              }
            >
              ▶ Video
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: DETAILS */}
      <div style={rightStyle}>
        <h1>{product.productName}</h1>

        <p><strong>Brand:</strong> {product.brandName}</p>
        <p><strong>Category:</strong> {product.category}</p>

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
          <div style={{ marginBottom: 10 }}>
            <label>Qty: </label>
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            >
              {[...Array(Math.min(product.stockQuantity, 10)).keys()].map(
                (x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                )
              )}
            </select>
          </div>
        )}

        <button
          disabled={product.stockStatus !== "in_stock"}
          onClick={() => addToCart(product, qty)}
          className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add To Cart
        </button>

        <hr style={{ margin: "20px 0" }} />

        <h3>Specifications</h3>
        <ul>
          {product.watchType && <li>Type: {product.watchType}</li>}
          {product.strapMaterial && <li>Strap Material: {product.strapMaterial}</li>}
          {product.strapColor && <li>Strap Color: {product.strapColor}</li>}
          {product.dialColor && <li>Dial Color: {product.dialColor}</li>}
          {product.waterResistance && <li>Water Resistance: {product.waterResistance}</li>}
          {product.warrantyPeriod && <li>Warranty: {product.warrantyPeriod}</li>}
        </ul>

        {product.fullDescription && (
          <>
            <h3 style={{ marginTop: 15 }}>Description</h3>
            <p>{product.fullDescription}</p>
          </>
        )}

        <h3 style={{ marginTop: 15 }}>Shipping & Policy</h3>
        <ul>
          <li>Shipping Charges: ₹{product.shippingCharges || 0}</li>
          {product.deliveryTime && <li>Delivery Time: {product.deliveryTime}</li>}
          {product.returnPolicy && <li>Return Policy: {product.returnPolicy}</li>}
        </ul>
      </div>
    </div>
  );
};

export default ProductDetail;

/* ---------------- STYLES ---------------- */

const pageStyle = {
  display: "flex",
  gap: "40px",
  padding: "20px",
};

const leftStyle = { width: "45%" };
const rightStyle = { width: "55%" };

const mainMediaStyle = {
  width: "100%",
  aspectRatio: "1 / 1.1",
  objectFit: "contain",
  borderRadius: "8px",
  maxHeight: "70vh",
  background: "#000",
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
  borderRadius: "4px",
};
