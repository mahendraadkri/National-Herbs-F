import { Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import DistributorsPage from "./pages/DistributorsPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetails from "./pages/ProductDetails";
import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> {/* <-- change here */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/distributors" element={<DistributorsPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="*" element={<div className="p-6">Not found</div>} />
    </Routes>
  );
}

export default App;
