import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAlert } from "../../context/AlertContext";

const AdminOrderList = () => {
  const { showAlert } = useAlert();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");

  // fetch all orders (ADMIN)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders");
        setOrders(data);
        setFilteredOrders(data);
      } catch (err) {
        showAlert(
          err.response?.data?.message || "Failed to load orders",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [showAlert]);

  // 🔥 COMBINED FILTER LOGIC
  useEffect(() => {
    let result = [...orders];

    // 🔍 search filter
    if (search) {
      const keyword = search.toLowerCase();

      result = result.filter((order) => {
        const orderId = order._id?.toLowerCase();
        const userName = order.user?.name?.toLowerCase();
        const email = order.user?.email?.toLowerCase();
        const date = order.createdAt?.substring(0, 10);

        return (
          orderId?.includes(keyword) ||
          userName?.includes(keyword) ||
          email?.includes(keyword) ||
          date?.includes(keyword)
        );
      });
    }

    // 💰 payment filter
    if (paymentFilter !== "all") {
      result = result.filter((order) =>
        paymentFilter === "paid"
          ? order.isPaid
          : !order.isPaid
      );
    }

    // 🚚 delivery filter
    if (deliveryFilter !== "all") {
      result = result.filter((order) =>
        deliveryFilter === "delivered"
          ? order.isDelivered
          : !order.isDelivered
      );
    }

    setFilteredOrders(result);
  }, [search, paymentFilter, deliveryFilter, orders]);

  if (loading) {
    return <h2 className="p-6">Loading orders...</h2>;
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by order, user, email, date"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm w-64 focus:ring-2 focus:ring-blue-500"
        />

        {/* PAYMENT FILTER */}
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        >
          <option value="all">All Payments</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>

        {/* DELIVERY FILTER */}
        <select
          value={deliveryFilter}
          onChange={(e) => setDeliveryFilter(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        >
          <option value="all">All Deliveries</option>
          <option value="delivered">Delivered</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* TABLE */}
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
            {filteredOrders.map((order) => (
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
                      Paid
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">
                      Unpaid
                    </span>
                  )}
                </td>

                <td className="border px-4 py-2 text-center">
                  {order.isDelivered ? (
                    <span className="text-green-600 font-semibold">
                      Delivered
                    </span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">
                      Pending
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

        {filteredOrders.length === 0 && (
          <p className="p-4 text-center text-gray-500">
            No matching orders found
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminOrderList;
