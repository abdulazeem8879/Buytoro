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

const App = () => {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cart" element={<Cart />} />

      {/* protected routes */}
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/order/:id" element={<ProtectedRoute><Order /></ProtectedRoute>} />
    </Routes>
  );
};

export default App;
