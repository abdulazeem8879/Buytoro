import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAlert } from "../context/AlertContext";
import { PackageSearch } from "lucide-react";

const MyOrders = () => {
  const { showAlert } = useAlert();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
      } catch (err) {
        showAlert(
          err.response?.data?.message || "Failed to load your orders",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [showAlert]);

  // ❌ CANCEL ORDER
  const cancelOrderHandler = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      setCancelLoading(orderId);

      const { data } = await api.put(`/orders/${orderId}/cancel`);

      setOrders((prev) =>
        prev.map((order) =>
          order._id === data._id ? data : order
        )
      );

      showAlert("Order cancelled successfully", "success");
    } catch (err) {
      showAlert(
        err.response?.data?.message || "Failed to cancel order",
        "error"
      );
    } finally {
      setCancelLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-lg">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow text-center">
          <PackageSearch
            className="mx-auto mb-4 text-gray-400"
            size={48}
          />
          <p className="text-gray-600 dark:text-gray-400">
            You haven’t placed any orders yet.
          </p>

          <Link
            to="/"
            className="inline-block mt-6 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-2xl">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-100 dark:bg-gray-700 text-sm">
              <tr>
                <th className="px-4 py-3 text-left">ORDER ID</th>
                <th className="px-4 py-3 text-left">DATE</th>
                <th className="px-4 py-3 text-center">TOTAL</th>
                <th className="px-4 py-3 text-center">PAID</th>
                <th className="px-4 py-3 text-center">DELIVERY</th>
                <th className="px-4 py-3 text-center">STATUS</th>
                <th className="px-4 py-3 text-center">ACTION</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-3 text-sm font-mono">
                    {order._id.slice(-8)}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-center font-semibold">
                    ₹{order.totalPrice}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        order.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        order.isDelivered
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "Pending"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        order.isCancelled
                          ? "bg-gray-200 text-gray-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.isCancelled ? "Cancelled" : "Active"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center space-x-4">
                    <Link
                      to={`/order/${order._id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View
                    </Link>

                    {!order.isPaid &&
                      !order.isDelivered &&
                      !order.isCancelled && (
                        <button
                          onClick={() =>
                            cancelOrderHandler(order._id)
                          }
                          disabled={cancelLoading === order._id}
                          className="text-red-600 hover:underline font-medium"
                        >
                          {cancelLoading === order._id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
