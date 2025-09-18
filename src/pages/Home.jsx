import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TrendingProducts from "../components/TrendingProducts";
import About from "../components/About";
import Banner from "../components/Banner";
import BannerCarousel from "../components/BannerCarousel";
import WhyChoose from "../components/WhyChoose";
import Stats from "../components/Stats";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <Navbar />
      <main className="pt-20 md:pt-24 lg:pt-28">
        <Hero />
        <TrendingProducts />
        <About />
        <Banner />
        <BannerCarousel />
        <WhyChoose />
        <Stats />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
