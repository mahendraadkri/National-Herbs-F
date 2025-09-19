import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Distributors from "../components/Distributors";

export default function DistributorsPage() {
  return (
    <div>
      <Navbar />
      <main className="pt-20 md:pt-24 lg:pt-28">
        <Distributors />
      </main>
      <Footer />
    </div>
  );
}
