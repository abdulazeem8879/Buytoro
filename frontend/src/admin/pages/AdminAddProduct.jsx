import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const AdminAddProduct = () => {
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState(0);
  const [shortDescription, setShortDescription] = useState("");

  // 🔥 image states
  const [images, setImages] = useState([]); // File[]
  const [imagePreviews, setImagePreviews] = useState([]); // string[]

  const [video, setVideo] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ add images one by one (append)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages((prev) => [...prev, ...files]);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews((prev) => [...prev, ...previews]);

    e.target.value = null; // reset input
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("productName", productName);
      formData.append("brandName", brandName);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("discountPrice", discountPrice);
      formData.append("stockQuantity", stockQuantity);
      formData.append("shortDescription", shortDescription);

      images.forEach((img) => {
        formData.append("images", img);
      });

      if (video) {
        formData.append("productVideo", video);
      }

      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/admin/products");
    } catch (err) {
      setError("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Add Product
        </h1>

        {error && (
          <p className="mb-4 text-red-600 bg-red-100 border p-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={submitHandler} className="space-y-4">
          <input
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />

          <input
            placeholder="Brand Name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />

          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Discount Price"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Stock Quantity"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <textarea
            placeholder="Short Description"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />

          {/* 🔥 IMAGE UPLOAD */}
          <div>
            <label className="font-medium block mb-2">
              Product Images
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {/* PREVIEW SLOTS */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-3">
                {imagePreviews.map((src, index) => (
                  <div
                    key={index}
                    className="border rounded overflow-hidden"
                  >
                    <img
                      src={src}
                      alt="preview"
                      className="w-full h-24 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* VIDEO */}
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
          />

          <button
            disabled={loading}
            className={`w-full py-2 text-white rounded ${
              loading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;
