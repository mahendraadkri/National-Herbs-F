import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Blog from "../components/Blog";

export default function BlogPage() {
  return (
    <div>
      <Navbar />
      <main className="pt-20 md:pt-24 lg:pt-28">
        <Blog />
      </main>
      <Footer />
    </div>
  );
}
