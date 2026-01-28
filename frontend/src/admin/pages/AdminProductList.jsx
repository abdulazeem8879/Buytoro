import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { useAlert } from "../../context/AlertContext";

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const AdminProductList = () => {
  const { showAlert } = useAlert();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDeleteDialog, setOpenDeleteDialog] =
    useState(false);
  const [selectedProductId, setSelectedProductId] =
    useState(null);

  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (err) {
        showAlert(
          err.response?.data?.message ||
            "Failed to load products",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [showAlert]);

  // Delete product
  const deleteHandler = async () => {
    try {
      await api.delete(
        `/products/${selectedProductId}`
      );

      setProducts((prev) =>
        prev.filter(
          (p) => p._id !== selectedProductId
        )
      );

      showAlert("Product deleted successfully", "success");
    } catch (err) {
      showAlert(
        err.response?.data?.message ||
          "Delete failed",
        "error"
      );
    } finally {
      setOpenDeleteDialog(false);
      setSelectedProductId(null);
    }
  };

  if (loading) {
    return (
      <h3 className="text-center text-lg font-semibold text-gray-600 mt-10">
        Loading products...
      </h3>
    );
  }

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Products
          </h1>

          <Link to="/admin/products/add">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  IMAGE
                </th>
                <th className="border px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  PRODUCT NAME
                </th>
                <th className="border px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  PRICE
                </th>
                <th className="border px-4 py-3 text-center text-sm font-semibold text-gray-600">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="border px-4 py-3">
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.productName}
                      className="w-14 h-14 object-cover rounded-md"
                    />
                  </td>

                  <td className="border px-4 py-3 font-medium text-gray-700">
                    {product.productName}
                  </td>

                  <td className="border px-4 py-3 text-gray-700">
                    ₹{product.price}
                  </td>

                  <td className="border px-4 py-3">
                    <div className="flex items-center justify-center gap-4">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </Link>

                      <button
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium"
                        onClick={() => {
                          setSelectedProductId(
                            product._id
                          );
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <p className="p-4 text-center text-gray-500">
              No products found
            </p>
          )}
        </div>
      </div>

      {/* ===== DELETE CONFIRM DIALOG ===== */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Product</DialogTitle>

        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={deleteHandler}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminProductList;
