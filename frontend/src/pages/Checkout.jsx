

import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { createOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";

const CheckOut = () => {
  const { cartItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // prices
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 5000 ? 0 : 100;
  const taxPrice = Math.round(itemsPrice * 0.02);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrderHandler = async () => {
    const orderData = {
      orderItems: cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty,
      })),
      shippingAddress: {
        address,
        city,
        postalCode,
        country,
      },
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    };

    const createdOrder = await createOrder(orderData);
    navigate(`/order/${createdOrder._id}`);
  };

  return (
    <div>
      <h1>Checkout</h1>

      <h2>Shipping</h2>
      <input placeholder="Address" onChange={(e) => setAddress(e.target.value)} />
      <input placeholder="City" onChange={(e) => setCity(e.target.value)} />
      <input
        placeholder="Postal Code"
        onChange={(e) => setPostalCode(e.target.value)}
      />
      <input
        placeholder="Country"
        onChange={(e) => setCountry(e.target.value)}
      />

      <h2>Payment</h2>
      <select onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="COD">Cash on Delivery</option>
        <option value="CARD">Card</option>
      </select>

      <h2>Summary</h2>
      <p>Items: ₹{itemsPrice}</p>
      <p>Shipping: ₹{shippingPrice}</p>
      <p>Tax: ₹{taxPrice}</p>
      <h3>Total: ₹{totalPrice}</h3>

      <button onClick={placeOrderHandler}>Place Order</button>
    </div>
  );
};

export default CheckOut;
