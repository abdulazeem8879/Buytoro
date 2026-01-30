import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { showAlert } = useAlert();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showAlert("Passwords do not match", "error");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/users/register", {
        name,
        email,
        password,
      });

      login(data);
      showAlert("Account created successfully", "success");
      navigate("/");
    } catch (err) {
      showAlert(
        err.response?.data?.message || "Registration failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4
      bg-gray-100 dark:bg-black transition-colors">

      <div className="w-full max-w-md
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-800
        rounded-2xl shadow-xl
        p-6 md:p-8 space-y-6">

        <h1 className="text-3xl font-extrabold text-center">
          Create Account
        </h1>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Sign up to start shopping
        </p>

        <form onSubmit={submitHandler} className="space-y-5">

          {/* NAME */}
          <div>
            <label className="block mb-1 font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl
                bg-transparent
                border border-gray-300 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl
                bg-transparent
                border border-gray-300 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl
                bg-transparent
                border border-gray-300 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block mb-1 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl
                bg-transparent
                border border-gray-300 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-xl font-semibold transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              }`}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
