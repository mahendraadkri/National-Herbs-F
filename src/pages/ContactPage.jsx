import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Contact from "../components/Contact";

export default function ContactPage() {
  return (
    <div>
      <Navbar />
      <main className="pt-20 md:pt-24 lg:pt-28">
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
