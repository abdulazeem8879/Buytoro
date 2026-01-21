import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const EditProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(
    user?.profileImage?.url || DEFAULT_AVATAR
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const { data } = await api.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // update auth context
      setUser(data);

      navigate("/profile");
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      {error && (
        <p className="mb-4 text-red-600 bg-red-100 p-2 rounded">
          {error}
        </p>
      )}

      <form
        onSubmit={submitHandler}
        className="bg-white p-6 rounded-lg shadow space-y-5"
      >
        {/* Profile Image */}
        <div className="flex items-center gap-4">
          <img
            src={preview}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Name */}
        <div>
          <label className="block font-medium mb-1">
            Full Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Save */}
        <button
          disabled={loading}
          className={`w-full py-2 text-white rounded ${
            loading
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
