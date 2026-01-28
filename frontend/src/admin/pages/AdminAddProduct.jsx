import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackagePlus, Image, Video, X } from "lucide-react";
import api from "../../services/api";
import { useAlert } from "../../context/AlertContext";

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // BASIC
  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");

  // PRICE & STOCK
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

  // MEDIA
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [video, setVideo] = useState(null);

  const [loading, setLoading] = useState(false);

  /* ================= IMAGE HANDLERS ================= */

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);

    e.target.value = null;
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /* ================= SUBMIT ================= */

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("productName", productName);
      formData.append("brandName", brandName);
      formData.append("category", category);
      formData.append(
        "shortDescription",
        shortDescription
      );
      formData.append(
        "fullDescription",
        fullDescription
      );
      formData.append("price", price);
      formData.append(
        "discountPrice",
        discountPrice
      );
      formData.append(
        "stockQuantity",
        stockQuantity
      );

      images.forEach((img) =>
        formData.append("images", img)
      );
      if (video)
        formData.append("productVideo", video);

      await api.post("/products", formData);

      showAlert("Product added successfully", "success");

      navigate("/admin/products");
    } catch (err) {
      showAlert(
        err.response?.data?.message ||
          "Failed to add product",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200";

  const sectionClass =
    "bg-gray-50 p-4 rounded-xl border space-y-4";

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <PackagePlus className="text-blue-600" />
        Add Product
      </h1>

      <form
        onSubmit={submitHandler}
        className="space-y-6"
      >
        {/* BASIC */}
        <div className={sectionClass}>
          <h2 className="font-semibold">
            Basic Info
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className={inputClass}
              placeholder="Product Name"
              onChange={(e) =>
                setProductName(e.target.value)
              }
              required
            />
            <input
              className={inputClass}
              placeholder="Brand Name"
              onChange={(e) =>
                setBrandName(e.target.value)
              }
              required
            />
            <input
              className={inputClass}
              placeholder="Category"
              onChange={(e) =>
                setCategory(e.target.value)
              }
              required
            />
          </div>

          <textarea
            className={inputClass}
            placeholder="Short Description"
            onChange={(e) =>
              setShortDescription(e.target.value)
            }
          />
          <textarea
            className={inputClass}
            placeholder="Full Description"
            rows="4"
            onChange={(e) =>
              setFullDescription(e.target.value)
            }
          />
        </div>

        {/* PRICE */}
        <div className={sectionClass}>
          <h2 className="font-semibold">
            Price & Stock
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              className={inputClass}
              placeholder="Price"
              onChange={(e) =>
                setPrice(e.target.value)
              }
              required
            />
            <input
              type="number"
              className={inputClass}
              placeholder="Discount Price"
              onChange={(e) =>
                setDiscountPrice(e.target.value)
              }
            />
            <input
              type="number"
              className={inputClass}
              placeholder="Stock Quantity"
              onChange={(e) =>
                setStockQuantity(e.target.value)
              }
            />
          </div>
        </div>

        {/* MEDIA */}
        <div className={sectionClass}>
          <h2 className="font-semibold flex items-center gap-2">
            <Image size={18} /> Media
          </h2>

          <div className="flex gap-4">
            <label className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white w-48 px-4 py-2 rounded cursor-pointer">
              <Image size={18} />
              Upload Images
              <input
                type="file"
                multiple
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>

            <label className="inline-flex items-center justify-center gap-2 bg-gray-700 text-white w-48 px-4 py-2 rounded cursor-pointer">
              <Video size={18} />
              Upload Video
              <input
                type="file"
                accept="video/*"
                hidden
                onChange={(e) =>
                  setVideo(e.target.files[0])
                }
              />
            </label>
          </div>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
              {imagePreviews.map((img, i) => (
                <div
                  key={i}
                  className="relative"
                >
                  <img
                    src={img}
                    className="h-24 w-full object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      removeImage(i)
                    }
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
        >
          {loading ? "Saving..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
