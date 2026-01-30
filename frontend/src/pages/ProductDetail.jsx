import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/CartContext";
import { ShoppingCart, Play } from "lucide-react";

const ProductDetail = () => {
  const { addToCart } = useContext(CartContext);
  const [qty, setQty] = useState(1);

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [activeMedia, setActiveMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);

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

  if (loading)
    return <p className="text-slate-500">Loading product...</p>;

  if (error)
    return <p className="text-red-500">{error}</p>;

  if (!product) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

      {/* ===== LEFT : MEDIA ===== */}
      <div>
        {/* MAIN MEDIA */}
        <div className="bg-black rounded-xl overflow-hidden flex items-center justify-center aspect-[1/1.1]">
          {activeMedia?.type === "image" && (
            <img
              src={activeMedia.url}
              alt={product.productName}
              className="max-h-[70vh] object-contain"
            />
          )}

          {activeMedia?.type === "video" && (
            <video
              src={activeMedia.url}
              controls
              muted
              autoPlay
              className="max-h-[70vh]"
            />
          )}
        </div>

        {/* THUMBNAILS */}
        <div className="flex gap-3 mt-4">
          {product.images?.map((img, index) => (
            <button
              key={`img-${index}`}
              onClick={() =>
                setActiveMedia({ type: "image", url: img.url })
              }
              className={`w-16 h-16 rounded-md overflow-hidden border
                ${
                  activeMedia?.url === img.url
                    ? "border-black dark:border-white"
                    : "border-slate-300 dark:border-slate-700"
                }`}
            >
              <img
                src={img.url}
                alt="thumb"
                className="w-full h-full object-cover"
              />
            </button>
          ))}

          {product.productVideo?.url && (
            <button
              onClick={() =>
                setActiveMedia({
                  type: "video",
                  url: product.productVideo.url,
                })
              }
              className={`w-16 h-16 flex items-center justify-center rounded-md border
                ${
                  activeMedia?.type === "video"
                    ? "border-black dark:border-white"
                    : "border-slate-300 dark:border-slate-700"
                }`}
            >
              <Play size={18} />
            </button>
          )}
        </div>
      </div>

      {/* ===== RIGHT : DETAILS ===== */}
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          {product.productName}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-400">
          <strong>Brand:</strong> {product.brandName} ·{" "}
          <strong>Category:</strong> {product.category}
        </p>

        {/* PRICE */}
        <p className="text-xl font-semibold">
          {product.discountPrice > 0 ? (
            <>
              <span className="line-through text-slate-400 mr-2">
                ₹{product.price}
              </span>
              ₹{product.discountPrice}
            </>
          ) : (
            <>₹{product.price}</>
          )}
        </p>

        <p className="text-slate-700 dark:text-slate-300">
          {product.shortDescription}
        </p>

        <p className="text-sm">
          <strong>Status:</strong>{" "}
          {product.stockStatus === "in_stock"
            ? "In Stock"
            : "Out of Stock"}
        </p>

        {/* QTY */}
        {product.stockStatus === "in_stock" && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Qty:</label>
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 rounded-md"
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

        {/* ADD TO CART */}
        <button
          disabled={product.stockStatus !== "in_stock"}
          onClick={() => addToCart(product, qty)}
          className={`mt-4 w-fit flex items-center gap-2 px-6 py-2 rounded-md font-medium transition
            ${
              product.stockStatus === "in_stock"
                ? "bg-black text-white hover:opacity-80 dark:bg-white dark:text-black"
                : "bg-slate-300 text-slate-600 cursor-not-allowed"
            }`}
        >
          <ShoppingCart size={16} />
          Add To Cart
        </button>

        <hr className="my-6 border-slate-200 dark:border-slate-800" />

        {/* SPECIFICATIONS */}
        <div>
          <h3 className="font-semibold mb-2">Specifications</h3>
          <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
            {product.watchType && <li>Type: {product.watchType}</li>}
            {product.strapMaterial && <li>Strap: {product.strapMaterial}</li>}
            {product.strapColor && <li>Strap Color: {product.strapColor}</li>}
            {product.dialColor && <li>Dial Color: {product.dialColor}</li>}
            {product.waterResistance && (
              <li>Water Resistance: {product.waterResistance}</li>
            )}
            {product.warrantyPeriod && (
              <li>Warranty: {product.warrantyPeriod}</li>
            )}
          </ul>
        </div>

        {/* DESCRIPTION */}
        {product.fullDescription && (
          <div>
            <h3 className="font-semibold mt-4">Description</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {product.fullDescription}
            </p>
          </div>
        )}

        {/* SHIPPING */}
        <div>
          <h3 className="font-semibold mt-4">Shipping & Policy</h3>
          <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
            <li>Shipping Charges: ₹{product.shippingCharges || 0}</li>
            {product.deliveryTime && (
              <li>Delivery Time: {product.deliveryTime}</li>
            )}
            {product.returnPolicy && (
              <li>Return Policy: {product.returnPolicy}</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
