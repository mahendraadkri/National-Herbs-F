// src/pages/AboutPage.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Journey from "../components/Journey";
import MissionVision from "../components/MissionVision";
import WhyChooseUs from "../components/WhyChooseUs";
import Team from "../components/Team";

export default function AboutPage() {
  return (
    <div>
      <Navbar />
      <main className="pt-20 md:pt-24 lg:pt-28">
        <Journey />
        <MissionVision />
        <WhyChooseUs />
        <Team />
      </main>
      <Footer />
    </div>
  );
}
