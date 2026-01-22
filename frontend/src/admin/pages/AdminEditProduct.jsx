import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Image, Video } from "lucide-react";
import api from "../../services/api";

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
const textareaClass =
  "w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500";
const selectClass =
  "w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [stockStatus, setStockStatus] = useState("in_stock");

  // WATCH SPECS
  const [watchType, setWatchType] = useState("");
  const [strapMaterial, setStrapMaterial] = useState("");
  const [strapColor, setStrapColor] = useState("");
  const [dialColor, setDialColor] = useState("");
  const [waterResistance, setWaterResistance] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");

  // SHIPPING
  const [shippingCharges, setShippingCharges] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");

  // MEDIA
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [video, setVideo] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);

        setProductName(data.productName);
        setBrandName(data.brandName);
        setCategory(data.category);
        setShortDescription(data.shortDescription || "");
        setFullDescription(data.fullDescription || "");

        setPrice(data.price);
        setDiscountPrice(data.discountPrice || "");
        setStockQuantity(data.stockQuantity || "");
        setStockStatus(data.stockStatus || "in_stock");

        setWatchType(data.watchType || "");
        setStrapMaterial(data.strapMaterial || "");
        setStrapColor(data.strapColor || "");
        setDialColor(data.dialColor || "");
        setWaterResistance(data.waterResistance || "");
        setWarrantyPeriod(data.warrantyPeriod || "");

        setShippingCharges(data.shippingCharges || 0);
        setDeliveryTime(data.deliveryTime || "");
        setReturnPolicy(data.returnPolicy || "");

        setExistingImages(data.images || []);
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("productName", productName);
      formData.append("brandName", brandName);
      formData.append("category", category);
      formData.append("shortDescription", shortDescription);
      formData.append("fullDescription", fullDescription);

      formData.append("price", price);
      formData.append("discountPrice", discountPrice);
      formData.append("stockQuantity", stockQuantity);
      formData.append("stockStatus", stockStatus);

      formData.append("watchType", watchType);
      formData.append("strapMaterial", strapMaterial);
      formData.append("strapColor", strapColor);
      formData.append("dialColor", dialColor);
      formData.append("waterResistance", waterResistance);
      formData.append("warrantyPeriod", warrantyPeriod);

      formData.append("shippingCharges", shippingCharges);
      formData.append("deliveryTime", deliveryTime);
      formData.append("returnPolicy", returnPolicy);

      newImages.forEach((img) => formData.append("images", img));
      if (video) formData.append("productVideo", video);

      await api.put(`/products/${id}`, formData);
      navigate("/admin/products");
    } catch {
      setError("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

        {error && (
          <p className="mb-4 text-red-600 bg-red-50 px-3 py-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className={inputClass} value={productName} onChange={(e)=>setProductName(e.target.value)} placeholder="Product Name" required />
          <input className={inputClass} value={brandName} onChange={(e)=>setBrandName(e.target.value)} placeholder="Brand Name" required />
          <input className={inputClass} value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Category" required />

          <input type="number" className={inputClass} value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price" required />
          <input type="number" className={inputClass} value={discountPrice} onChange={(e)=>setDiscountPrice(e.target.value)} placeholder="Discount Price" />
          <input type="number" className={inputClass} value={stockQuantity} onChange={(e)=>setStockQuantity(e.target.value)} placeholder="Stock Quantity" />

          <select className={selectClass} value={stockStatus} onChange={(e)=>setStockStatus(e.target.value)}>
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          <select className={selectClass} value={watchType} onChange={(e)=>setWatchType(e.target.value)}>
            <option value="">Watch Type</option>
            <option value="Analog">Analog</option>
            <option value="Digital">Digital</option>
            <option value="Smart">Smart</option>
          </select>

          <input className={inputClass} value={strapMaterial} onChange={(e)=>setStrapMaterial(e.target.value)} placeholder="Strap Material" />
          <input className={inputClass} value={strapColor} onChange={(e)=>setStrapColor(e.target.value)} placeholder="Strap Color" />
          <input className={inputClass} value={dialColor} onChange={(e)=>setDialColor(e.target.value)} placeholder="Dial Color" />
          <input className={inputClass} value={waterResistance} onChange={(e)=>setWaterResistance(e.target.value)} placeholder="Water Resistance" />
          <input className={inputClass} value={warrantyPeriod} onChange={(e)=>setWarrantyPeriod(e.target.value)} placeholder="Warranty Period" />

          <textarea className={textareaClass} value={shortDescription} onChange={(e)=>setShortDescription(e.target.value)} placeholder="Short Description" />
          <textarea className={textareaClass} value={fullDescription} onChange={(e)=>setFullDescription(e.target.value)} placeholder="Full Description" />

          <input type="number" className={inputClass} value={shippingCharges} onChange={(e)=>setShippingCharges(e.target.value)} placeholder="Shipping Charges" />
          <input className={inputClass} value={deliveryTime} onChange={(e)=>setDeliveryTime(e.target.value)} placeholder="Delivery Time" />
          <input className={inputClass} value={returnPolicy} onChange={(e)=>setReturnPolicy(e.target.value)} placeholder="Return Policy" />

          <div className="col-span-2 flex gap-3 flex-wrap">
            {existingImages.map((img, i) => (
              <img key={i} src={img.url} className="w-20 h-20 object-cover rounded border" />
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Image size={18} /> Upload Images
            <input type="file" multiple hidden onChange={(e)=>setNewImages([...e.target.files])} />
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Video size={18} /> Upload Video
            <input type="file" accept="video/*" hidden onChange={(e)=>setVideo(e.target.files[0])} />
          </label>

          <button
            className="col-span-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
            disabled={saving}
          >
            <Save size={18} />
            {saving ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProduct;
