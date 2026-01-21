import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const Security = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deleteAccountHandler = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    setLoading(true);
    setError("");

    try {
      // 🔥 call backend delete account API
      await api.delete("/users/delete-account");

      // 🔐 logout user after deletion
      logout();
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Security & Control</h1>

      {error && (
        <p className="mb-4 text-red-600 bg-red-100 p-2 rounded">
          {error}
        </p>
      )}

      {/* ===== DANGER ZONE ===== */}
      <div className="bg-white border border-red-300 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Danger Zone
        </h2>

        <p className="text-gray-700 mb-4">
          Deleting your account will permanently remove your profile
          and profile image. This action cannot be undone.
        </p>

        <button
          onClick={deleteAccountHandler}
          disabled={loading}
          className={`px-6 py-2 text-white rounded ${
            loading
              ? "bg-gray-400"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
};

export default Security;
