import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div
      style={{
        width: "220px",
        background: "#111",
        color: "#fff",
        padding: "20px",
      }}
    >
      <h2>Admin</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Link to="/admin" style={{ color: "#fff" }}>
          Dashboard
        </Link>
        <Link to="/admin/products" style={{ color: "#fff" }}>
          Products
        </Link>
        <Link to="/admin/orders" style={{ color: "#fff" }}>
          Orders
        </Link>
        <Link to="/admin/users" style={{ color: "#fff" }}>
          Users
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;
