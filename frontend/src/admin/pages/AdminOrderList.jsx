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

  // fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders");
        setOrders(data);
        setFilteredOrders(data);
      } catch (err) {
        showAlert("Failed to load orders", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [showAlert]);

  // filters
  useEffect(() => {
    let result = [...orders];

    if (search) {
      const k = search.toLowerCase();
      result = result.filter((o) =>
        o._id.toLowerCase().includes(k) ||
        o.user?.name?.toLowerCase().includes(k) ||
        o.user?.email?.toLowerCase().includes(k) ||
        o.createdAt?.substring(0, 10).includes(k)
      );
    }

    if (paymentFilter !== "all") {
      result = result.filter((o) =>
        paymentFilter === "paid" ? o.isPaid : !o.isPaid
      );
    }

    if (deliveryFilter !== "all") {
      result = result.filter((o) =>
        deliveryFilter === "delivered"
          ? o.isDelivered
          : !o.isDelivered
      );
    }

    setFilteredOrders(result);
  }, [search, paymentFilter, deliveryFilter, orders]);

  // ❌ DELETE ORDER
  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order permanently?")) return;

    try {
      await api.delete(`/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o._id !== id));
      showAlert("Order deleted", "success");
    } catch {
      showAlert("Delete failed", "error");
    }
  };

  // 🚫 CANCEL ORDER
  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      const { data } = await api.put(`/orders/${id}/cancel/admin`);

      setOrders((prev) =>
        prev.map((o) => (o._id === id ? data : o))
      );

      showAlert("Order cancelled", "success");
    } catch {
      showAlert("Cancel failed", "error");
    }
  };

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          placeholder="Search order / user / email / date"
          className="border px-3 py-2 rounded text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="border px-3 py-2 rounded text-sm"
        >
          <option value="all">All Payments</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>

        <select
          value={deliveryFilter}
          onChange={(e) => setDeliveryFilter(e.target.value)}
          className="border px-3 py-2 rounded text-sm"
        >
          <option value="all">All Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">ORDER</th>
              <th className="border px-3 py-2">USER</th>
              <th className="border px-3 py-2">TOTAL</th>
              <th className="border px-3 py-2">STATUS</th>
              <th className="border px-3 py-2">ACTION</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o._id} className="hover:bg-gray-50">
                <td className="border px-3 py-2 text-sm">{o._id}</td>
                <td className="border px-3 py-2">
                  {o.user?.name}
                  <br />
                  <span className="text-xs text-gray-500">
                    {o.user?.email}
                  </span>
                </td>
                <td className="border px-3 py-2">₹{o.totalPrice}</td>

                <td className="border px-3 py-2 text-center">
                  {o.isCancelled ? (
                    <span className="text-orange-600 font-semibold">
                      Cancelled
                    </span>
                  ) : o.isDelivered ? (
                    <span className="text-green-600">Delivered</span>
                  ) : (
                    <span className="text-yellow-600">Pending</span>
                  )}
                </td>

                <td className="border px-3 py-2 text-center space-x-2">
                  <Link
                    to={`/order/${o._id}`}
                    className="text-blue-600 underline"
                  >
                    View
                  </Link>

                  {!o.isDelivered && !o.isCancelled && (
                    <button
                      onClick={() => cancelOrder(o._id)}
                      className="text-orange-600 font-medium"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    onClick={() => deleteOrder(o._id)}
                    className="text-red-600 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <p className="p-4 text-center text-gray-500">
            No orders found
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminOrderList;
