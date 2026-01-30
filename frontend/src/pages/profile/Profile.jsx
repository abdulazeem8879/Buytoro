import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
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

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  // 🔐 Logout
  const handleLogout = () => {
    logout();
    showAlert("Logged out successfully", "info");
    navigate("/login");
  };

  // ❌ Delete account
  const handleDeleteAccount = async () => {
    try {
      await api.delete("/users/profile");
      showAlert("Account deleted successfully", "success");
      logout();
      navigate("/login");
    } catch (err) {
      showAlert(
        err.response?.data?.message || "Failed to delete account",
        "error"
      );
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 space-y-8">

        {/* ===== PROFILE HEADER ===== */}
        <div className="flex items-center gap-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6 rounded-xl">
          <img
            src={user.profileImage?.url || DEFAULT_AVATAR}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border"
          />

          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>

            <p className="mt-1">
              <strong>Role:</strong>{" "}
              {user.isAdmin ? "Admin" : "User"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {user.isBlocked ? "Blocked" : "Active"}
            </p>
          </div>
        </div>

        {/* ===== PERSONAL INFO ===== */}
        <section className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">
            Personal Information
          </h2>

          <p><strong>Full Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.isAdmin ? "Admin" : "User"}</p>
        </section>

        {/* ===== QUICK ACTIONS ===== */}
        <section className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link to="/" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
              <Home size={18} />
              Home
            </Link>

            <Link to="/my-orders" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
              <Package size={18} />
              My Orders
            </Link>

            <Link to="/cart" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
              <ShoppingCart size={18} />
              Cart
            </Link>

            <Link to="/favorites" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
              <Heart size={18} />
              Favorites
            </Link>

            <Link to="/help" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
              <HelpCircle size={18} />
              Help Center
            </Link>
          </div>
        </section>

        {/* ===== ACCOUNT INFO ===== */}
        <section className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">
            Account Information
          </h2>

          <p>
            <strong>Account Created:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>

          <p>
            <strong>Last Login:</strong>{" "}
            {user.lastLogin
              ? new Date(user.lastLogin).toLocaleString()
              : "N/A"}
          </p>
        </section>

        {/* ===== SECURITY ===== */}
        <section className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">
            Security
          </h2>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setOpenLogoutDialog(true)}
              className="px-4 py-2 bg-yellow-500 text-black rounded"
            >
              Logout
            </button>

            <button
              onClick={() => setOpenDeleteDialog(true)}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete Account
            </button>
          </div>
        </section>

        {/* ===== ADMIN ===== */}
        {user.isAdmin && (
          <section className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">
              Admin Controls
            </h2>

            <div className="flex gap-4">
              <Link to="/admin/users" className="px-4 py-2 bg-black text-white rounded">
                Users
              </Link>
              <Link to="/admin/dashboard" className="px-4 py-2 bg-black text-white rounded">
                Dashboard
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* LOGOUT DIALOG */}
      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to logout?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)}>Cancel</Button>
          <Button color="warning" variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE ACCOUNT DIALOG */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          This action is permanent. Are you sure?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteAccount}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
