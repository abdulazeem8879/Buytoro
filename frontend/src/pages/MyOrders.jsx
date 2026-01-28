import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAlert } from "../context/AlertContext";
const MyOrders = () => {
  const { showAlert } = useAlert();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
      } catch (err) {
        showAlert(
          err.response?.data?.message ||
            "Failed to load your orders",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [showAlert]);

  if (loading) {
    return (
      <div className="p-6 text-center text-lg">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600">
            You haven’t placed any orders yet.
          </p>

          <Link
            to="/"
            className="inline-block mt-4 px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-3 text-left">
                  ORDER ID
                </th>
                <th className="border px-4 py-3 text-left">
                  DATE
                </th>
                <th className="border px-4 py-3 text-center">
                  TOTAL
                </th>
                <th className="border px-4 py-3 text-center">
                  PAID
                </th>
                <th className="border px-4 py-3 text-center">
                  DELIVERED
                </th>
                <th className="border px-4 py-3 text-center">
                  ACTION
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50"
                >
                  <td className="border px-4 py-3 text-sm">
                    {order._id}
                  </td>

                  <td className="border px-4 py-3">
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="border px-4 py-3 text-center font-medium">
                    ₹{order.totalPrice}
                  </td>

                  <td className="border px-4 py-3 text-center">
                    {order.isPaid ? (
                      <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-semibold">
                        Paid
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700 font-semibold">
                        Unpaid
                      </span>
                    )}
                  </td>

                  <td className="border px-4 py-3 text-center">
                    {order.isDelivered ? (
                      <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-semibold">
                        Delivered
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700 font-semibold">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="border px-4 py-3 text-center">
                    <Link
                      to={`/order/${order._id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View
                    </Link>
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
