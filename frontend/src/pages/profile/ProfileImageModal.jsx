import React from "react";
import api from "../../services/api";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const ProfileImageModal = ({
  isOpen,
  onClose,
  imageUrl,
  onChangeProfile,
}) => {
  if (!isOpen) return null;

  const handleRemoveProfile = async () => {
    try {
      await api.put("/users/profile", { removeImage: true });
      window.location.reload();
    } catch (err) {
      alert("Failed to remove profile image");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-96 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl || DEFAULT_AVATAR}
          alt="Profile Large"
          className="w-48 h-48 rounded-full mx-auto object-cover mb-6"
        />

        <div className="flex gap-3 justify-center">
          <button
            onClick={onChangeProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Change Profile
          </button>

          <button
            onClick={handleRemoveProfile}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Remove Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageModal;
