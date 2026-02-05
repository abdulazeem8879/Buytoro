import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const { showAlert } = useAlert();

  // email register page se aaya hoga
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // safety: agar direct aaye bina email ke
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-medium">
          Invalid access. Please register again.
        </p>
      </div>
    );
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      showAlert("Please enter a valid 6-digit OTP", "warning");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/users/verify-otp", {
        email,
        otp,
      });

      // ✅ verified → login user
      login(data);

      showAlert("Account verified successfully", "success");
      navigate("/");
    } catch (err) {
      showAlert(
        err.response?.data?.message || "OTP verification failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4
      bg-gray-100 dark:bg-black transition-colors"
    >
      <div
        className="w-full max-w-sm
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-800
        rounded-2xl shadow-xl
        p-6 space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">
          Verify OTP
        </h1>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Enter the 6-digit OTP sent to
          <br />
          <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={submitHandler} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            maxLength={6}
            placeholder="Enter OTP"
            className="w-full text-center tracking-widest text-lg px-4 py-2 rounded-xl
              bg-transparent
              border border-gray-300 dark:border-gray-700
              focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />

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
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
