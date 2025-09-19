import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import "./index.css";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import DistributorsPage from "./pages/DistributorsPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetails from "./pages/ProductDetails";
import ContactPage from "./pages/ContactPage";

import AdminLayout from "./admin/AdminLayout";
import LoginPage from "./admin/LoginPage";
import Dashboard from "./admin/Dashboard";
import ProductsAdmin from "./admin/ProductsAdmin";
import DistributorsAdmin from "./admin/DistributorsAdmin";
import BlogAdmin from "./admin/BlogAdmin";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Site */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/distributors" element={<DistributorsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Admin */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="distributors" element={<DistributorsAdmin />} />
            <Route path="blogs" element={<BlogAdmin />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<div className="p-6">Not found</div>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
