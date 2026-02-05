import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import emailjs from "@emailjs/browser";

const Register = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const submitHandler = async (e) => {
    e.preventDefault();





    if (password !== confirmPassword) {
      showAlert("Passwords do not match", "error");
      return;
    }

    setLoading(true);

    try {
      const otp = generateOTP();

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          email,
          passcode: otp,
          time: "15 minutes",
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // TEMP STORE (frontend only)
      localStorage.setItem("otp", otp);
      localStorage.setItem("otp_email", email);
      localStorage.setItem("otp_name", name);
      localStorage.setItem("otp_password", password);

      showAlert("OTP sent to your email", "success");
      navigate("/verify-otp");
    } catch (error) {
      console.error(error);
      showAlert("Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 dark:bg-black">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border rounded-2xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">Create Account</h1>

        <form onSubmit={submitHandler} className="space-y-4">
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <button
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded"
          >
            {loading ? "Sending OTP..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
