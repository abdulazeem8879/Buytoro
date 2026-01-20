import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";

import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./admin/AdminRoute";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProductList from "./admin/pages/AdminProductList";
import AdminAddProduct from "./admin/pages/AdminAddProduct";
import AdminEditProduct from "./admin/pages/AdminEditProduct";
import ProductDetail from "./pages/ProductDetail";
import MainLayout from "./layout/MainLayout";
import PlaceOrder from "./pages/PlaceOrder";

const App = () => {
  return (
    <Routes>
      {/* public routes */}

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            {" "}
            <AdminLayout />{" "}
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProductList />} />
        <Route path="products/add" element={<AdminAddProduct />} />
        <Route path="products/:id/edit" element={<AdminEditProduct />} />
      </Route>
    </Routes>
  );
};

export default App;
