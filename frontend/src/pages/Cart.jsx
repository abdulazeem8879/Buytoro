import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const Cart = () => {
  const {
    cartItems,
    updateQty,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);

  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [openClearDialog, setOpenClearDialog] =
    useState(false);

  // ✅ price vs discountPrice handling
  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.discountPrice > 0
        ? item.discountPrice
        : item.price) *
        item.qty,
    0
  );

  // 🚫 Empty cart UI
  if (cartItems.length === 0) {
    return (
      <div className="text-center mt-16">
        <h2 className="text-2xl font-semibold mb-4">
          Your cart is empty
        </h2>
        <Link
          to="/"
          className="text-blue-600 hover:underline"
        >
          Continue shopping →
        </Link>
      </div>
    );
  }

  // 👉 Checkout guard
  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      showAlert("Your cart is empty", "warning");
      return;
    }
    navigate("/checkout");
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          Shopping Cart
        </h1>

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

              {/* Quantity */}
              {item.stockStatus === "in_stock" && (
                <select
                  value={item.qty}
                  onChange={(e) =>
                    updateQty(
                      item._id,
                      Number(e.target.value)
                    )
                  }
                  className="border rounded px-2 py-1"
                >
                  {[
                    ...Array(
                      Math.min(item.stockQuantity, 10)
                    ).keys(),
                  ].map((x) => (
                    <option
                      key={x + 1}
                      value={x + 1}
                    >
                      {x + 1}
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={() =>
                  removeFromCart(item._id)
                }
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap gap-4 justify-between items-center mt-8 border-t pt-4">
          <h2 className="text-xl font-semibold">
            Total: ₹ {totalPrice}
          </h2>

          <div className="flex gap-3">
            <button
              onClick={() => setOpenClearDialog(true)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Cart
            </button>

            <button
              onClick={proceedToCheckout}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>

      {/* ===== CLEAR CART CONFIRM DIALOG ===== */}
      <Dialog
        open={openClearDialog}
        onClose={() => setOpenClearDialog(false)}
      >
        <DialogTitle>Clear Cart</DialogTitle>

        <DialogContent>
          Are you sure you want to remove all items
          from your cart?
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenClearDialog(false)}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={() => {
              clearCart();
              setOpenClearDialog(false);
            }}
          >
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Cart;
