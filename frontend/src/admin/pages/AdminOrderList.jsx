import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // fetch all orders (ADMIN)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders");
        setOrders(data);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <h2 className="p-6">Loading orders...</h2>;
  }

  if (error) {
    return <h2 className="p-6 text-red-500">{error}</h2>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">ORDER ID</th>
              <th className="border px-4 py-2 text-left">USER</th>
              <th className="border px-4 py-2 text-left">EMAIL</th>
              <th className="border px-4 py-2 text-left">TOTAL</th>
              <th className="border px-4 py-2 text-center">PAID</th>
              <th className="border px-4 py-2 text-center">DELIVERED</th>
              <th className="border px-4 py-2 text-center">DATE</th>
              <th className="border px-4 py-2 text-center">ACTION</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-sm">
                  {order._id}
                </td>

                <td className="border px-4 py-2">
                  {order.user?.name}
                </td>

                <td className="border px-4 py-2">
                  {order.user?.email}
                </td>

                <td className="border px-4 py-2">
                  ₹{order.totalPrice}
                </td>

                <td className="border px-4 py-2 text-center">
                  {order.isPaid ? (
                    <span className="text-green-600 font-semibold">
                      Yes
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">
                      No
                    </span>
                  )}
                </td>

                <td className="border px-4 py-2 text-center">
                  {order.isDelivered ? (
                    <span className="text-green-600 font-semibold">
                      Yes
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">
                      No
                    </span>
                  )}
                </td>

                <td className="border px-4 py-2 text-center">
                  {order.createdAt?.substring(0, 10)}
                </td>

                <td className="border px-4 py-2 text-center">
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

        {orders.length === 0 && (
          <p className="p-4 text-center text-gray-500">
            No orders found
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminOrderList;
