import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-16 bg-slate-900 text-gray-300">
      {/* ===== TOP SECTION ===== */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4">

        {/* BRAND */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-white">
            BuyToro
          </h3>
          <p className="text-sm">
            A premium watch e-commerce platform.
          </p>
          <p className="text-sm">
            Designed & Developed by{" "}
            <span className="font-semibold text-white">
              Abdul Azeem Khan
            </span>
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-white">
            Quick Links
          </h4>
          <nav className="flex flex-col gap-2 text-sm">
            <Link to="/" className="hover:text-blue-400 transition">
              Home
            </Link>
            <Link to="/cart" className="hover:text-blue-400 transition">
              Cart
            </Link>
            <Link to="/profile" className="hover:text-blue-400 transition">
              Profile
            </Link>
              <Link to="/contact" className="hover:text-blue-400 transition">
              Contact
            </Link>
          </nav>
        </div>

        {/* LEGAL */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-white">
            Legal
          </h4>
          <nav className="flex flex-col gap-2 text-sm">
            <Link to="/terms" className="hover:text-blue-400 transition">
              Terms & Conditions
            </Link>
            <Link to="/privacy" className="hover:text-blue-400 transition">
              Privacy Policy
            </Link>
          </nav>
        </div>

        {/* WHY BUYTORO */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">
            Why BuyToro?
          </h4>

          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✔</span>
              100% Original Products
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✔</span>
              Secure Payments
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✔</span>
              Fast Delivery
            </li>
          </ul>

          {/* SOCIAL MEDIA ICONS */}
          <div className="flex gap-4 pt-2">
            <a
              href="#"
              className="hover:text-blue-400 transition"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              href="#"
              className="hover:text-pink-400 transition"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="#"
              className="hover:text-sky-400 transition"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              className="hover:text-blue-500 transition"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="bg-slate-950 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} BuyToro. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
