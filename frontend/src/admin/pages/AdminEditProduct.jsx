import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const AdminEditProduct = () => {
  const { id } = useParams(); // product id from URL
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [images, setImages] = useState([]);

  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 1️⃣ Load existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);

        setName(data.name);
        setPrice(data.price);
        setDescription(data.description);
        setCountInStock(data.countInStock || 0);
        setExistingImages(data.images || []);
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 2️⃣ New images select
  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  // 3️⃣ Submit update
  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("countInStock", countInStock);

      // append new images (optional)
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
      }

      await api.put(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/admin/products");
    } catch (err) {
      setError("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <h3>Loading product...</h3>;

  return (
    <div>
      <h1>Edit Product</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={submitHandler}>
        <div>
          <label>Name</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Price</label>
          <br />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Count In Stock</label>
          <br />
          <input
            type="number"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
          />
        </div>

        {/* Existing images */}
        <div>
          <label>Current Images</label>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {existingImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="product"
                width="80"
                style={{ border: "1px solid #ccc" }}
              />
            ))}
          </div>
        </div>

        {/* New images */}
        <div style={{ marginTop: "15px" }}>
          <label>Add New Images</label>
          <br />
          <input type="file" multiple onChange={handleImageChange} />
        </div>

        <br />

        <button type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminEditProduct;
