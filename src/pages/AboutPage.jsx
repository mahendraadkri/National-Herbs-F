// src/pages/AboutPage.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Journey from "../components/Journey";
import MissionVision from "../components/MissionVision";
import WhyChooseUs from "../components/WhyChooseUs";
import Team from "../components/Team";
import Certificates from "../components/Certificates";
import Sustainability from "../components/Sustainability";
import ManufacturingProcess from "../components/ManufacturingProcess";
import Newsletter from "../components/Newsletter";

export default function AboutPage() {
  return (
    <div>
      <Navbar />
      <main className="pt-20 md:pt-24 lg:pt-28">
        <Journey />
        <MissionVision />
        <WhyChooseUs />
        <Team />
        {/* <Certificates /> */}
        <Sustainability />
        <ManufacturingProcess />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
