import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/CartContext";
import { useContext } from "react";

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
        setSelectedImage(data.images?.[0]); // default main image
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
          alt={product.name}
          style={mainImageStyle}
        />

        <div style={thumbsStyle}>
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="thumb"
              style={{
                ...thumbStyle,
                border:
                  selectedImage === img
                    ? "2px solid black"
                    : "1px solid #ccc",
              }}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: Product Info */}
      <div style={rightStyle}>
        <h1>{product.name}</h1>
        <p><strong>Brand:</strong> {product.brand}</p>
        <p><strong>Price:</strong> ₹ {product.price}</p>
        <p>{product.description}</p>

        <p>
          <strong>Status:</strong>{" "}
          {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        {product.countInStock > 0 && (
  <div>
    <label>Qty</label>
    <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
      {[...Array(product.countInStock).keys()].map((x) => (
        <option key={x + 1} value={x + 1}>
          {x + 1}
        </option>
      ))}
    </select>
  </div>
)}


       <button
  disabled={product.countInStock === 0}
  onClick={() => addToCart(product, qty)}
>
  Add To Cart
</button>
      </div>
    </div>
  );
};

export default ProductDetail;


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
  maxHeight: "70vh"
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
