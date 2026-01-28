import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import ProfileImageModal from "./ProfileImageModal";
import api from "../../services/api";
import { useAlert } from "../../context/AlertContext";

// Icons
import {
  Home,
  ShoppingCart,
  Heart,
  HelpCircle,
  Package,
} from "lucide-react";

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [openImageModal, setOpenImageModal] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  if (!user) return <p>Loading profile...</p>;

  // 🔐 Logout confirm
  const handleLogout = () => {
    logout();
    showAlert("Logged out successfully", "info");
    navigate("/login");
  };

  // ❌ Delete account confirm
  const handleDeleteAccount = async () => {
    try {
      await api.delete("/users/profile");
      showAlert("Account deleted successfully", "success");
      logout();
      navigate("/login");
    } catch (err) {
      showAlert(
        err.response?.data?.message ||
          "Failed to delete account",
        "error"
      );
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        {/* ===== PROFILE HEADER ===== */}
        <div className="flex items-center gap-6 bg-white p-6 rounded-lg shadow">
          <img
            src={user.profileImage?.url || DEFAULT_AVATAR}
            alt="Profile"
            onClick={() => setOpenImageModal(true)}
            className="w-28 h-28 rounded-full object-cover border cursor-pointer hover:opacity-80 transition"
          />

          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>

            <p className="mt-1">
              <span className="font-medium">Role:</span>{" "}
              {user.isAdmin ? "Admin" : "User"}
            </p>

            <p>
              <span className="font-medium">
                Account Status:
              </span>{" "}
              {user.isBlocked ? "Blocked" : "Active"}
            </p>
          </div>
        </div>

        {/* ===== PERSONAL INFO ===== */}
        <section className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Personal Information
          </h2>

          <p>
            <strong>Full Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong>{" "}
            {user.isAdmin ? "Admin" : "User"}
          </p>
        </section>

        {/* ===== QUICK ACTIONS ===== */}
        <section className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              to="/"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <Home className="text-blue-600" />
              <span className="font-medium">Home</span>
            </Link>

            <Link
              to="/my-orders"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <Package className="text-green-600" />
              <span className="font-medium">My Orders</span>
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <ShoppingCart className="text-purple-600" />
              <span className="font-medium">Cart</span>
            </Link>

            <Link
              to="/favorites"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <Heart className="text-red-500" />
              <span className="font-medium">Favorites</span>
            </Link>

            <Link
              to="/help"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <HelpCircle className="text-gray-700" />
              <span className="font-medium">Help Center</span>
            </Link>
          </div>
        </section>

        {/* ===== EDIT PROFILE ===== */}
        <section className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Edit Profile
          </h2>

          <div className="flex gap-4">
            <Link
              to="/profile/edit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Edit Name / Picture
            </Link>

            <Link
              to="/profile/change-password"
              className="px-4 py-2 bg-gray-700 text-white rounded"
            >
              Change Password
            </Link>
          </div>
        </section>

        {/* ===== ACCOUNT INFO ===== */}
        <section className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Account Information
          </h2>

          <p>
            <strong>Account Created:</strong>{" "}
            {new Date(
              user.createdAt
            ).toLocaleDateString()}
          </p>

          <p>
            <strong>Last Login:</strong>{" "}
            {user.lastLogin
              ? new Date(
                  user.lastLogin
                ).toLocaleString()
              : "N/A"}
          </p>
        </section>

        {/* ===== SECURITY ===== */}
        <section className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Security & Control
          </h2>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setOpenLogoutDialog(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Logout from this device
            </button>

            <button
              onClick={() => setOpenDeleteDialog(true)}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete Account
            </button>
          </div>
        </section>

        {/* ===== ADMIN CONTROLS ===== */}
        {user.isAdmin && (
          <section className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Admin Controls
            </h2>

            <div className="flex gap-4">
              <Link
                to="/admin/users"
                className="px-4 py-2 bg-black text-white rounded"
              >
                User Management
              </Link>

              <Link
                to="/admin/dashboard"
                className="px-4 py-2 bg-black text-white rounded"
              >
                Admin Dashboard
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* ===== LOGOUT CONFIRM DIALOG ===== */}
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          Are you sure you want to logout?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenLogoutDialog(false)}
          >
            Cancel
          </Button>
          <Button
            color="warning"
            variant="contained"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== DELETE ACCOUNT CONFIRM DIALOG ===== */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          This action is permanent. Are you sure you
          want to delete your account?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteAccount}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== PROFILE IMAGE MODAL ===== */}
      <ProfileImageModal
        isOpen={openImageModal}
        onClose={() => setOpenImageModal(false)}
        imageUrl={user.profileImage?.url}
        onChangeProfile={() =>
          navigate("/profile/edit")
        }
      />
    </>
  );
};

export default Profile;
