import React, { useEffect, useState } from "react";
import api from "../../services/api";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    paidOrders: 0,
    unpaidOrders: 0,
    deliveredOrders: 0,
    pendingDelivery: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [productsRes, ordersRes, usersRes] = await Promise.all([
          api.get("/products"),
          api.get("/orders"),
          api.get("/users"),
        ]);

        const products = productsRes.data.length;
        const orders = ordersRes.data;

        // ✅ ADMIN USERS EXCLUDED
        const normalUsers = usersRes.data.filter(
          (user) => !user.isAdmin
        );

        const paidOrders = orders.filter((o) => o.isPaid);
        const deliveredOrders = orders.filter((o) => o.isDelivered);

        const revenue = paidOrders.reduce(
          (acc, order) => acc + order.totalPrice,
          0
        );

        setStats({
          products,
          orders: orders.length,
          users: normalUsers.length, // 👈 only customers
          revenue,
          paidOrders: paidOrders.length,
          unpaidOrders: orders.length - paidOrders.length,
          deliveredOrders: deliveredOrders.length,
          pendingDelivery: orders.length - deliveredOrders.length,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* TOP STATS */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <StatCard title="Total Products" value={stats.products} />
        <StatCard title="Total Orders" value={stats.orders} />
        <StatCard title="Total Users" value={stats.users} />
        <StatCard title="Total Revenue" value={`₹${stats.revenue}`} />
      </div>

      {/* ORDER STATUS */}
      <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        <StatCard title="Paid Orders" value={stats.paidOrders} />
        <StatCard title="Unpaid Orders" value={stats.unpaidOrders} />
        <StatCard title="Delivered Orders" value={stats.deliveredOrders} />
        <StatCard title="Pending Delivery" value={stats.pendingDelivery} />
      </div>

      {/* RECENT ORDERS */}
      <h2 style={{ marginTop: "40px" }}>Recent Orders</h2>
      <table width="100%" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th align="left">Order ID</th>
            <th align="left">User</th>
            <th align="left">Amount</th>
            <th>Paid</th>
            <th>Delivered</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user?.email || "N/A"}</td>
              <td>₹{order.totalPrice}</td>
              <td align="center">{order.isPaid ? "Yes" : "No"}</td>
              <td align="center">
                {order.isDelivered ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div style={cardStyle}>
    <h3>{title}</h3>
    <p style={{ fontSize: "20px", fontWeight: "bold" }}>
      {value}
    </p>
  </div>
);

const cardStyle = {
  background: "#f4f4f4",
  padding: "20px",
  borderRadius: "8px",
  width: "200px",
  textAlign: "center",
};

export default AdminDashboard;
