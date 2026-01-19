import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { assets } from "../assets/assets";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // 🔍 Search submit
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(keyword.trim() ? `/?q=${keyword}` : "/");
    setKeyword("");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-gray-950 text-black shadow-md h-16">

      {/* LOGO */}
      <Link to="/" className="flex items-center gap-2">
        <img src={assets.logo7} alt="BuyToro Logo" className="h-12 w-auto" />
      </Link>

      {/* 🔍 SEARCH BAR */}
      <form
        onSubmit={submitHandler}
        className="flex items-center gap-2 bg-gray-900 px-2 py-1 rounded-md"
      >
        <input
          type="text"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="bg-transparent text-gray-200 outline-none px-2 w-48 placeholder-gray-400"
        />
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded-md text-sm"
        >
          Search
        </button>
      </form>

      {/* LINKS */}
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link
          to="/"
          className="text-gray-200 hover:text-yellow-400 transition"
        >
          Home
        </Link>

        <Link
          to="/cart"
          className="relative text-gray-200 hover:text-yellow-400 transition"
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
              className="text-gray-200 hover:text-yellow-400 transition"
            >
              Profile
            </Link>

            {user.isAdmin && (
              <Link
                to="/admin"
                className="text-gray-200 hover:text-red-400 font-semibold transition"
              >
                Admin
              </Link>
            )}

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-200 hover:text-yellow-400 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-1.5 rounded-md transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
