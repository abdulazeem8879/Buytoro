import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { createOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { cartItems, clearCart } = useContext(CartContext); // ✅ clearCart added
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Prices
  const itemsPrice = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.discountPrice > 0 ? item.discountPrice : item.price) * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 5000 ? 0 : 100;
  const taxPrice = Math.round(itemsPrice * 0.02);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrderHandler = async () => {
    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          productName: item.productName,
          image: item.images?.[0]?.url,
          price:
            item.discountPrice > 0 ? item.discountPrice : item.price,
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

      clearCart(); // ✅ CART CLEARED AFTER ORDER SUCCESS

      navigate(`/order/${createdOrder._id}`);
    } catch (error) {
      alert("Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        
        {/* LEFT SECTION */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Shipping */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">🚚 Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="input"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <input
                className="input"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <input
                className="input"
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
              <input
                className="input"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">💳 Payment Method</h2>
            <select
              className="input"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="CARD">Card</option>
            </select>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-white rounded-xl shadow p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">🧾 Order Summary</h2>

          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Items</span>
              <span>₹{itemsPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shippingPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{taxPrice}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>

          <button
            onClick={placeOrderHandler}
            disabled={cartItems.length === 0}
            className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg 
              hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
