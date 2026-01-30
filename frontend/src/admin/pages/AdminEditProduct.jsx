import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Image, Video } from "lucide-react";
import api from "../../services/api";
import { useAlert } from "../../context/AlertContext";

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500";
const textareaClass =
  "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500";
const selectClass =
  "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500";

const sectionClass =
  "bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3";

const AdminEditProduct = () => {
  const { id } = useParams();
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
      } catch (err) {
        showAlert("Failed to load product", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, showAlert]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6">
          Edit Product
        </h1>

        <form onSubmit={() => {}} className="space-y-6">
          {/* BASIC */}
          <div className={sectionClass}>
            <h2 className="font-semibold">Basic Info</h2>
            <input className={inputClass} value={productName} onChange={(e)=>setProductName(e.target.value)} placeholder="Product Name" />
            <input className={inputClass} value={brandName} onChange={(e)=>setBrandName(e.target.value)} placeholder="Brand Name" />
            <input className={inputClass} value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Category" />
          </div>

          {/* PRICE */}
          <div className={sectionClass}>
            <h2 className="font-semibold">Price & Stock</h2>
            <input type="number" className={inputClass} value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price" />
            <input type="number" className={inputClass} value={discountPrice} onChange={(e)=>setDiscountPrice(e.target.value)} placeholder="Discount Price" />
            <input type="number" className={inputClass} value={stockQuantity} onChange={(e)=>setStockQuantity(e.target.value)} placeholder="Stock Quantity" />
            <select className={selectClass} value={stockStatus} onChange={(e)=>setStockStatus(e.target.value)}>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          {/* MEDIA */}
          <div className={sectionClass}>
            <h2 className="font-semibold">Media</h2>
            <div className="flex gap-3 flex-wrap">
              {existingImages.map((img, i) => (
                <img key={i} src={img.url} className="w-20 h-20 object-cover rounded-lg border" />
              ))}
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Image size={16} /> Upload Images
              <input type="file" multiple hidden onChange={(e)=>setNewImages([...e.target.files])} />
            </label>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Video size={16} /> Upload Video
              <input type="file" accept="video/*" hidden onChange={(e)=>setVideo(e.target.files[0])} />
            </label>
          </div>

          <button
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
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
