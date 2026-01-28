import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";

const ChangePassword = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showAlert(
        "New password and confirm password do not match",
        "error"
      );
      return;
    }

    setLoading(true);

    try {
      await api.put("/users/change-password", {
        oldPassword,
        newPassword,
      });

      showAlert(
        "Password changed successfully. Please login again.",
        "success"
      );

      // 🔐 Security best practice: logout after password change
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 1500);
    } catch (err) {
      showAlert(
        err.response?.data?.message ||
          "Failed to change password",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Change Password
      </h1>

      <form
        onSubmit={submitHandler}
        className="bg-white p-6 rounded-lg shadow space-y-4"
      >
        <div>
          <label className="block font-medium mb-1">
            Old Password
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) =>
              setOldPassword(e.target.value)
            }
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          disabled={loading}
          className={`w-full py-2 text-white rounded ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
