import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import TrendingProducts from "./TrendingProducts";
import About from "./About";
import Banner from "./Banner";
import BannerCarousel from "./BannerCarousel";

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
      </main>
    </div>
  );
};

export default Home;
