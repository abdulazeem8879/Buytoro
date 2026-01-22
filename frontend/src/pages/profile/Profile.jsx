import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import ProfileImageModal from "./ProfileImageModal";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [openImageModal, setOpenImageModal] = useState(false);

  if (!user) return <p>Loading profile...</p>;

  return (
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
            <span className="font-medium">Account Status:</span>{" "}
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
      <section className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Security & Control
        </h2>

        <div className="flex flex-col gap-3">
          <button className="px-4 py-2 bg-yellow-500 text-white rounded">
            Logout from all devices
          </button>

          <button className="px-4 py-2 bg-red-600 text-white rounded">
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

      {/* ===== LOGOUT ===== */}
      <div className="mt-10 text-center">
        <button
          onClick={logout}
          className="px-6 py-2 bg-gray-800 text-white rounded"
        >
          Logout
        </button>
      </div>

      {/* ===== PROFILE IMAGE MODAL ===== */}
      <ProfileImageModal
        isOpen={openImageModal}
        onClose={() => setOpenImageModal(false)}
        imageUrl={user.profileImage?.url}
        onChangeProfile={() => navigate("/profile/edit")}
      />
    </div>
  );
};

export default Profile;
