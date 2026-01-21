import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../services/orderService";

const Order = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const data = await getOrderById(id);
      setOrder(data);
    };
    fetchOrder();
  }, [id]);

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">Loading order...</h2>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

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
                order.isDelivered
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.isDelivered ? "Delivered" : "Pending Delivery"}
            </span>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">🚚 Shipping Address</h2>
          <p className="text-gray-700">
            {order.shippingAddress.address},{" "}
            {order.shippingAddress.city},{" "}
            {order.shippingAddress.country}
          </p>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🛒 Order Items</h2>

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
          <h2 className="text-xl font-semibold mb-3">💰 Order Summary</h2>
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
