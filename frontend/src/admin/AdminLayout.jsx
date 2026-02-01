import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex
        bg-gray-100 dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        transition-colors duration-300"
    >
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR (MOBILE ONLY) */}
        <div className="md:hidden flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Menu size={22} />
          </button>

          <h1 className="font-semibold text-lg">
            Admin Dashboard
          </h1>
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
