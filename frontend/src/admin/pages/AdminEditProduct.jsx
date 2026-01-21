import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Package,
  Tag,
  DollarSign,
  FileText,
  ImagePlus,
  Save,
} from "lucide-react";
import api from "../../services/api";

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🔑 Schema-based states
  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState(0);
  const [shortDescription, setShortDescription] = useState("");

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);

        setProductName(data.productName);
        setBrandName(data.brandName);
        setCategory(data.category);
        setPrice(data.price);
        setDiscountPrice(data.discountPrice || "");
        setStockQuantity(data.stockQuantity || 0);
        setShortDescription(data.shortDescription || "");
        setExistingImages(data.images || []);
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleImageChange = (e) => {
    setNewImages(e.target.files);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();

      // 🔑 Schema-aligned fields
      formData.append("productName", productName);
      formData.append("brandName", brandName);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("discountPrice", discountPrice);
      formData.append("stockQuantity", stockQuantity);
      formData.append("shortDescription", shortDescription);

      if (newImages.length > 0) {
        for (let i = 0; i < newImages.length; i++) {
          formData.append("images", newImages[i]);
        }
      }

      await api.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/admin/products");
    } catch (err) {
      setError("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold">
        Loading product...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Package className="text-blue-600" />
        Edit Product
      </h1>

      {error && (
        <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={submitHandler}
        className="bg-white shadow rounded-lg p-6 space-y-5"
      >
        {/* Product Name */}
        <div>
          <label className="flex items-center gap-2 font-medium mb-1">
            <Package size={18} /> Product Name
          </label>
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="flex items-center gap-2 font-medium mb-1">
            <Tag size={18} /> Brand
          </label>
          <input
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Category */}
        <div>
          <label className="font-medium mb-1 block">Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Price */}
        <div>
          <label className="flex items-center gap-2 font-medium mb-1">
            <DollarSign size={18} /> Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Discount Price */}
        <div>
          <label className="font-medium mb-1 block">Discount Price</label>
          <input
            type="number"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="flex items-center gap-2 font-medium mb-1">
            <FileText size={18} /> Short Description
          </label>
          <textarea
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            rows="4"
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="font-medium mb-1 block">Stock Quantity</label>
          <input
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Existing Images */}
        <div>
          <label className="font-medium mb-2 block">Current Images</label>
          <div className="flex gap-3 flex-wrap">
            {existingImages.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt="product"
                className="w-20 h-20 object-cover border rounded"
              />
            ))}
          </div>
        </div>

        {/* Replace Images */}
        <div>
          <label className="flex items-center gap-2 font-medium mb-1">
            <ImagePlus size={18} /> Replace Images
          </label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProduct;
