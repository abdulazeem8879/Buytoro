import React, { useContext, useState } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";

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

const ProfileImageModal = ({
  isOpen,
  onClose,
  imageUrl,
  onChangeProfile,
}) => {
  const { setUser } = useContext(AuthContext);
  const { showAlert } = useAlert();

  const [openRemoveDialog, setOpenRemoveDialog] =
    useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // ❌ Remove profile image
  const handleRemoveProfile = async () => {
    setLoading(true);

    try {
      const { data } = await api.put("/users/profile", {
        removeImage: true,
      });

      // update auth context (no reload)
      setUser(data);

      showAlert("Profile image removed", "success");

      setOpenRemoveDialog(false);
      onClose();
    } catch (err) {
      showAlert(
        err.response?.data?.message ||
          "Failed to remove profile image",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===== MODAL ===== */}
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
              onClick={() => setOpenRemoveDialog(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Remove Profile
            </button>
          </div>
        </div>
      </div>

      {/* ===== REMOVE CONFIRM DIALOG ===== */}
      <Dialog
        open={openRemoveDialog}
        onClose={() => setOpenRemoveDialog(false)}
      >
        <DialogTitle>Remove Profile Image</DialogTitle>

        <DialogContent>
          Are you sure you want to remove your profile
          image?
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenRemoveDialog(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleRemoveProfile}
            disabled={loading}
          >
            {loading ? "Removing..." : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileImageModal;
