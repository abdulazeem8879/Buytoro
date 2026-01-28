import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { assets } from "../assets/assets";
import AnalogWatch from "../components/AnalogWatch";

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(keyword.trim() ? `/?q=${keyword}` : "/");
    setKeyword("");
  };

  const handleLogoutConfirm = () => {
    logout();
    setOpenLogoutDialog(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 h-16 bg-black border-b border-gray-800">
        <div className="h-full px-8 flex items-center justify-between">

          {/* LEFT: LOGO + WATCH */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={assets.logo7}
                alt="BuyToro Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Watch Wrapper */}
            <div className="flex items-center justify-center w-14 h-14">
              <AnalogWatch />
            </div>
          </div>

          {/* SEARCH */}
          <form
            onSubmit={submitHandler}
            className="hidden md:flex items-center gap-2 bg-gray-900 px-2 py-1 rounded-lg border border-gray-800"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="bg-transparent text-gray-200 outline-none px-2 w-48 placeholder-gray-500 text-sm"
            />
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded-md text-sm font-semibold transition"
            >
              Search
            </button>
          </form>

          {/* RIGHT LINKS */}
          <div className="flex items-center gap-5 text-sm font-medium">
            <Link to="/" className="text-gray-300 hover:text-yellow-400 transition">
              Home
            </Link>

            <Link
              to="/cart"
              className="relative text-gray-300 hover:text-yellow-400 transition"
            >
              Cart
              <span className="ml-1 text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-yellow-400 transition"
                >
                  Profile
                </Link>

                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="text-red-400 hover:text-red-500 font-semibold transition"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={() => setOpenLogoutDialog(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-yellow-400 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-1.5 rounded-md transition font-semibold"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* LOGOUT CONFIRMATION DIALOG */}
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
            color="inherit"
          >
            Cancel
          </Button>

          <Button
            onClick={handleLogoutConfirm}
            color="error"
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
