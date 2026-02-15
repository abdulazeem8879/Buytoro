import { useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { ArrowRightCircle } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
const [step, setStep] = useState(1); 
const [newPassword, setNewPassword] = useState("");




  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/forgot-password", { email });

      alert(res.data.message);
      setStep(2);


    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleVerifyOtp = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post(
      "/users/verify-reset-otp",
      { email, otp }
    );

    alert(res.data.message);
    setStep(3);


  } catch (error) {
    alert(
      error.response?.data?.message || "Invalid OTP"
    );
  }
};

const handleResetPassword = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post(
      "/users/reset-password",
      { email, newPassword }
    );

    alert(res.data.message);

    // Reset flow
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");

  } catch (error) {
    alert(
      error.response?.data?.message || "Reset failed"
    );
  }
};



  return (

<div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-900 text-white">

  {/* Title Section */}
  <Link 
    to="/"  
    className="
      text-5xl sm:text-6xl font-extrabold tracking-tight
      bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500
      bg-clip-text text-transparent
      transition-all duration-200
      hover:drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)]
      dark:hover:drop-shadow-[0_1px_1px_rgba(255,255,255,0.25)]
      mb-12 sm:mb-14
    "
  >
    BuyToro
  </Link>

  {/* Form Section */}
  <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md shadow-lg">
    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Forgot Password</h2>

    {step === 1 && (
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-4 mb-6 rounded-xl bg-gray-700 outline-none text-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-xl text-lg transition-all duration-200"
        >
          Send OTP
        </button>

        <div className="mt-4">
          <Link
            to="/login"
            className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-200 dark:hover:text-gray-100 p-2 rounded-md bg-amber-300 w-full inline-flex items-center justify-center"
          >
            <ArrowRightCircle className="mr-2" size={16} />
            Back to Login
          </Link>
        </div>
      </form>
    )}

    {step === 2 && (
      <form onSubmit={handleVerifyOtp}>
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full p-4 mb-6 rounded-xl bg-gray-700 outline-none text-lg placeholder-gray-400 focus:ring-2 focus:ring-green-600"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 p-4 rounded-xl text-lg transition-all duration-200"
        >
          Verify OTP
        </button>
      </form>
    )}

    {step === 3 && (
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full p-4 mb-6 rounded-xl bg-gray-700 outline-none text-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-600"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 p-4 rounded-xl text-lg transition-all duration-200"
        >
          Reset Password
        </button>
      </form>
    )}
  </div>
</div>


  );
};

export default ForgotPassword;
