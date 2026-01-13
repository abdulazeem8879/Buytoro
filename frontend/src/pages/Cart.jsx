// import { useContext } from "react";
// import { CartContext } from "../context/CartContext";
// import { Link } from "react-router-dom";

// const Cart = () => {
//   const { cartItems, updateQty, removeFromCart } = useContext(CartContext);

//   const totalPrice = cartItems.reduce(
//     (acc, item) => acc + item.price * item.qty,
//     0
//   );

//   if (cartItems.length === 0) {
//     return (
//       <div>
//         <h2>Your Cart is Empty</h2>
//         <Link to="/">Go to Home</Link>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1>Your Cart</h1>

//       {cartItems.map((item) => (
//         <div key={item._id}>
//           <h3>{item.name}</h3>
//           <p>Price: ${item.price}</p>

//           <input
//             type="number"
//             min="1"
//             value={item.qty}
//             onChange={(e) => updateQty(item._id, Number(e.target.value))}
//           />

//           <button onClick={() => removeFromCart(item._id)}>Remove</button>
//         </div>
//       ))}

//       <h2>Total: ${totalPrice}</h2>

//       <button>proceed to checkout</button>
//     </div>
//   );
// };

// export default Cart;




// ..........................................................................
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-semibold">Your Cart is Empty</h2>
        <Link
          to="/"
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-center">Your Cart</h1>

      {cartItems.map((item) => (
        <div
          key={item._id}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white shadow rounded-2xl p-4"
        >
          <div>
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-gray-600">Price: ${item.price}</p>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4">
            <input
              type="number"
              min="1"
              value={item.qty}
              onChange={(e) => updateQty(item._id, Number(e.target.value))}
              className="w-20 border rounded-lg px-3 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={() => removeFromCart(item._id)}
              className="px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t">
        <h2 className="text-xl md:text-2xl font-semibold text-center md:text-left">
          Total: ${totalPrice}
        </h2>

    <Link to="/checkout">
        <button className="w-full md:w-auto px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
          Proceed to Checkout
        </button>
    </Link>
      </div>
    </div>
  );
};

export default Cart;
