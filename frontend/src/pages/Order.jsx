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

  if (!order) return <h2>Loading order...</h2>;

  return (
    <div>
      <h1>Order {order._id}</h1>

      <h2>Shipping</h2>
      <p>
        {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
        {order.shippingAddress.country}
      </p>

      <h2>Items</h2>
      {order.orderItems.map((item) => (
        <div key={item._id}>
          <p>
            {item.name} × {item.qty} = ₹{item.price * item.qty}
          </p>
        </div>
      ))}

      <h2>Total: ₹{order.totalPrice}</h2>

      <p>Status: {order.isPaid ? "Paid" : "Not Paid"}</p>
      <p>Status: {order.isDelivered ? "Delivered" : "Not Delivered"}</p>
    </div>
  );
};

export default Order;
