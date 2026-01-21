import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, updateQty, removeFromCart } = useContext(CartContext);

  // ✅ price vs discountPrice handling
  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.discountPrice > 0 ? item.discountPrice : item.price) *
        item.qty,
    0
  );

  if (cartItems.length === 0) {
    return (
      <h2 className="text-center text-xl font-semibold mt-10">
        Your cart is empty
      </h2>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-4 p-4 border rounded-lg shadow-sm"
          >
            <img
              src={item.images?.[0]?.url}
              alt={item.productName}
              className="w-20 h-20 object-cover rounded"
            />

            <div className="flex-1">
              <Link
                to={`/product/${item._id}`}
                className="font-medium text-lg hover:underline"
              >
                {item.productName}
              </Link>

              <p className="text-gray-700 mt-1">
                ₹{" "}
                {item.discountPrice > 0
                  ? item.discountPrice
                  : item.price}
              </p>
            </div>

            {/* ✅ stockQuantity instead of countInStock */}
            {item.stockStatus === "in_stock" && (
              <select
                value={item.qty}
                onChange={(e) =>
                  updateQty(item._id, Number(e.target.value))
                }
                className="border rounded px-2 py-1"
              >
                {[
                  ...Array(
                    Math.min(item.stockQuantity, 10)
                  ).keys(),
                ].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8 border-t pt-4">
        <h2 className="text-xl font-semibold">
          Total: ₹ {totalPrice}
        </h2>

        <Link to="/checkout">
          <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
            Proceed To Checkout
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
