import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const Security = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] =
    useState(false);

  // ❌ Delete account
  const handleDeleteAccount = async () => {
    setLoading(true);

    try {
      await api.delete("/users/delete-account");

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
      setLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          Security & Control
        </h1>

        {/* ===== DANGER ZONE ===== */}
        <div className="bg-white border border-red-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Danger Zone
          </h2>

          <p className="text-gray-700 mb-4">
            Deleting your account will permanently remove your
            profile and profile image. This action cannot be
            undone.
          </p>

          <button
            onClick={() => setOpenDeleteDialog(true)}
            disabled={loading}
            className={`px-6 py-2 text-white rounded ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* ===== DELETE ACCOUNT CONFIRM DIALOG ===== */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>

        <DialogContent>
          This action is permanent. Are you sure you want to
          delete your account?
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Security;
