import React from "react";

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        
        <div style={cardStyle}>
          <h3>Total Products</h3>
          <p>0</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Orders</h3>
          <p>0</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Users</h3>
          <p>0</p>
        </div>

      </div>
    </div>
  );
};

const cardStyle = {
  background: "#f4f4f4",
  padding: "20px",
  borderRadius: "8px",
  width: "200px",
  textAlign: "center",
};

export default AdminDashboard;
