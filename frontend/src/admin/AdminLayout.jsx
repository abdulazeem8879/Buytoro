import { Outlet } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex
      bg-gray-100 dark:bg-gray-900
      text-gray-900 dark:text-gray-100
      transition-colors duration-300"
    >
      {/* admin sidebar */}
      <AdminSidebar />

      {/* right side page content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
