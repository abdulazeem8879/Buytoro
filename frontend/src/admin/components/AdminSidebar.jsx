import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();

  const menu = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <Package size={18} />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <ShoppingCart size={18} />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <Users size={18} />,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-6">
      {/* Logo / Title */}
      <h2 className="text-2xl font-bold mb-8 text-center">
        🛠 Admin Panel
      </h2>

      {/* Navigation */}
      <nav className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
              ${
                location.pathname === item.path
                  ? "bg-blue-600"
                  : "hover:bg-gray-800"
              }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
