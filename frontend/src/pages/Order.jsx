import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import { useAlert } from "../context/AlertContext";
import { AuthContext } from "../context/AuthContext";

const Order = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { user } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(id);
        setOrder(data);
      } catch (error) {
        showAlert(
          error.response?.data?.message || "Failed to fetch order",
          "error"
        );
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate, showAlert]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">Loading order...</h2>
      </div>
    );

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* 🔙 BACK BUTTON (ROLE BASED) */}
        <div>
          {user?.isAdmin ? (
            <Link
              to="/admin/orders"
              className="inline-block mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              ← Back to Admin Orders
            </Link>
          ) : (
            <Link
              to="/my-orders"
              className="inline-block mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              ← Back to My Orders
            </Link>
          )}
        </div>

        {/* Order Header */}
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold">
            Order <span className="text-blue-600">#{order._id}</span>
          </h1>

          <div className="mt-3 flex flex-wrap gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.isPaid
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {order.isPaid ? "Paid" : "Not Paid"}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.isCancelled
                  ? "bg-gray-200 text-gray-700"
                  : order.isDelivered
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.isCancelled
                ? "Cancelled"
                : order.isDelivered
                ? "Delivered"
                : "Pending Delivery"}
            </span>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">
            🚚 Shipping Address
          </h2>
          <p className="text-gray-700">
            {order.shippingAddress.address},{" "}
            {order.shippingAddress.city},{" "}
            {order.shippingAddress.country}
          </p>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            🛒 Order Items
          </h2>

          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 border-b pb-4 last:border-b-0"
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-16 h-16 object-cover rounded-lg border"
                />

                <div className="flex-1">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.qty}
                  </p>
                </div>

                <p className="font-semibold">
                  ₹{item.price * item.qty}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-3">
            💰 Order Summary
          </h2>
          <div className="flex justify-between text-lg font-bold">
            <span>Total Amount</span>
            <span>₹{order.totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
