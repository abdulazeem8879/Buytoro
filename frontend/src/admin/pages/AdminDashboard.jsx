import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAlert } from "../../context/AlertContext";

const AdminDashboard = () => {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);

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

        const [productsRes, ordersRes, usersRes] =
          await Promise.all([
            api.get("/products"),
            api.get("/orders"),
            api.get("/users"),
          ]);

        const products = productsRes.data.length;
        const orders = ordersRes.data;

        const normalUsers = usersRes.data.filter(
          (user) => !user.isAdmin
        );

        const paidOrders = orders.filter((o) => o.isPaid);
        const deliveredOrders = orders.filter(
          (o) => o.isDelivered
        );

        const revenue = paidOrders.reduce(
          (acc, order) => acc + order.totalPrice,
          0
        );

        setStats({
          products,
          orders: orders.length,
          users: normalUsers.length,
          revenue,
          paidOrders: paidOrders.length,
          unpaidOrders: orders.length - paidOrders.length,
          deliveredOrders: deliveredOrders.length,
          pendingDelivery:
            orders.length - deliveredOrders.length,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        showAlert(
          err.response?.data?.message ||
            "Failed to load dashboard data",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [showAlert]);

  if (loading)
    return (
      <p className="text-center mt-10">
        Loading dashboard...
      </p>
    );

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">
            Total Products
          </p>
          <p className="text-2xl font-bold">
            {stats.products}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">
            Total Orders
          </p>
          <p className="text-2xl font-bold">
            {stats.orders}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">
            Total Users
          </p>
          <p className="text-2xl font-bold">
            {stats.users}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">
            Revenue
          </p>
          <p className="text-2xl font-bold text-green-600">
            ₹{stats.revenue}
          </p>
        </div>
      </div>

      {/* ORDER STATUS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl text-center">
          <p className="text-sm">Paid Orders</p>
          <p className="text-xl font-semibold">
            {stats.paidOrders}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl text-center">
          <p className="text-sm">Unpaid Orders</p>
          <p className="text-xl font-semibold">
            {stats.unpaidOrders}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl text-center">
          <p className="text-sm">
            Delivered Orders
          </p>
          <p className="text-xl font-semibold">
            {stats.deliveredOrders}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl text-center">
          <p className="text-sm">
            Pending Delivery
          </p>
          <p className="text-xl font-semibold">
            {stats.pendingDelivery}
          </p>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-x-auto">
        <h2 className="text-xl font-semibold p-6">
          Recent Orders
        </h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-3 text-left">
                Order ID
              </th>
              <th className="p-3 text-left">
                User
              </th>
              <th className="p-3 text-left">
                Amount
              </th>
              <th className="p-3 text-center">
                Paid
              </th>
              <th className="p-3 text-center">
                Delivered
              </th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.map((order) => (
              <tr
                key={order._id}
                className="border-t dark:border-gray-700"
              >
                <td className="p-3">
                  {order._id}
                </td>
                <td className="p-3">
                  {order.user?.email || "N/A"}
                </td>
                <td className="p-3">
                  ₹{order.totalPrice}
                </td>
                <td className="p-3 text-center">
                  {order.isPaid ? "Yes" : "No"}
                </td>
                <td className="p-3 text-center">
                  {order.isDelivered
                    ? "Yes"
                    : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
