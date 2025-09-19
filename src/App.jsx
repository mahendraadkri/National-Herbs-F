import { Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import DistributorsPage from "./pages/DistributorsPage";
import ProductsPage from "./pages/ProductsPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/distributors" element={<DistributorsPage />} />
        <Route path="/products"  element={<ProductsPage />} />
      </Routes>
    </>
  );
}

export default App;
