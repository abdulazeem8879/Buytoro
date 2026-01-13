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
    return (
      <div>
        <h2>Your Cart is Empty</h2>
        <Link to="/">Go to Home</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Your Cart</h1>

      {cartItems.map((item) => (
        <div key={item._id}>
          <h3>{item.name}</h3>
          <p>Price: ${item.price}</p>

          <input
            type="number"
            min="1"
            value={item.qty}
            onChange={(e) => updateQty(item._id, Number(e.target.value))}
          />

          <button onClick={() => removeFromCart(item._id)}>Remove</button>
        </div>
      ))}

      <h2>Total: ${totalPrice}</h2>

      <button>proceed to checkout</button>
    </div>
  );
};

export default Cart;
