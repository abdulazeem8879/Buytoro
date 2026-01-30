import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Check } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-black text-slate-600 dark:text-slate-400">
      
      {/* ===== TOP SECTION ===== */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 sm:grid-cols-2 md:grid-cols-4">

        {/* BRAND */}
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold text-black dark:text-white">
            BuyToro
          </h3>
          <p className="text-sm">
            A premium watch e-commerce platform.
          </p>
          <p className="text-sm">
            Designed & Developed by{" "}
            <span className="font-medium text-black dark:text-white">
              Abdul Azeem Khan
            </span>
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-black dark:text-white">
            Quick Links
          </h4>
          <nav className="flex flex-col gap-2 text-sm">
            <Link to="/" className="hover:text-black dark:hover:text-white transition">
              Home
            </Link>
            <Link to="/cart" className="hover:text-black dark:hover:text-white transition">
              Cart
            </Link>
            <Link to="/profile" className="hover:text-black dark:hover:text-white transition">
              Profile
            </Link>
            <Link to="/contact" className="hover:text-black dark:hover:text-white transition">
              Contact
            </Link>
          </nav>
        </div>

        {/* LEGAL */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-black dark:text-white">
            Legal
          </h4>
          <nav className="flex flex-col gap-2 text-sm">
            <Link to="/terms" className="hover:text-black dark:hover:text-white transition">
              Terms & Conditions
            </Link>
            <Link to="/privacy" className="hover:text-black dark:hover:text-white transition">
              Privacy Policy
            </Link>
          </nav>
        </div>

        {/* WHY BUYTORO */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-black dark:text-white">
            Why BuyToro?
          </h4>

          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check size={14} />
              100% Original Products
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} />
              Secure Payments
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} />
              Fast Delivery
            </li>
          </ul>

          {/* SOCIAL MEDIA */}
          <div className="flex gap-4 pt-3">
            <a
              href="#"
              className="hover:text-black dark:hover:text-white transition"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              href="#"
              className="hover:text-black dark:hover:text-white transition"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="#"
              className="hover:text-black dark:hover:text-white transition"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              className="hover:text-black dark:hover:text-white transition"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="border-t border-slate-200 dark:border-slate-800 text-center py-4 text-xs text-slate-500">
        © {new Date().getFullYear()} BuyToro. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
