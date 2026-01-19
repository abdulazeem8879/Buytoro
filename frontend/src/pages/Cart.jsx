import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, updateQty, removeFromCart } = useContext(CartContext);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  if (cartItems.length === 0) {
    return <h2>Your cart is empty</h2>;
  }

  return (
    <div>
      <h1>Shopping Cart</h1>

      {cartItems.map((item) => (
        <div key={item._id} style={itemStyle}>
          <img src={item.images?.[0]} alt={item.name} width="80" />

          <Link to={`/product/${item._id}`}>{item.name}</Link>

          <span>₹ {item.price}</span>

          <select
            value={item.qty}
            onChange={(e) => updateQty(item._id, Number(e.target.value))}
          >
            {[...Array(item.countInStock).keys()].map((x) => (
              <option key={x + 1} value={x + 1}>
                {x + 1}
              </option>
            ))}
          </select>

          <button onClick={() => removeFromCart(item._id)}>
            Remove
          </button>
        </div>
      ))}

      <h2>Total: ₹ {totalPrice}</h2>

      <Link to="/checkout">
        <button>Proceed To Checkout</button>
      </Link>
    </div>
  );
};

const itemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  marginBottom: "15px",
};

export default Cart;
