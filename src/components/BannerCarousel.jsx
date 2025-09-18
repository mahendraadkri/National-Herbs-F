// src/components/BannerCarousel.jsx
import React, { useEffect, useRef, useState } from "react";

// Import your slides
import embrace1 from "../assets/banner001.png";
import embrace2 from "../assets/banner002.png";
import embrace3 from "../assets/banner003.png";

const SLIDES = [
  { id: 1, img: embrace1, alt: "Embrace Nature's Touch" },
  { id: 2, img: embrace2, alt: "Pure Herbal Skincare" },
  { id: 3, img: embrace3, alt: "Gentle & Effective" },
];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const next = () => setIndex((i) => (i + 1) % SLIDES.length);
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  // autoplay (pause on hover)
  const start = () => {
    stop();
    timerRef.current = setInterval(next, 4000);
  };
  const stop = () => timerRef.current && clearInterval(timerRef.current);

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div
        className="relative overflow-hidden rounded-2xl"
        onMouseEnter={stop}
        onMouseLeave={start}
      >
        {/* Slider track */}
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((s) => (
            <div key={s.id} className="w-full shrink-0">
              <div className="relative">
                {/* Maintain ratio; tweak as needed */}
                <div className="aspect-[21/7] w-full">
                  <img
                    src={s.img}
                    alt={s.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                {/* Optional overlay text block (comment out if your image already has text) */}
                {/* <div className="absolute inset-y-0 right-0 flex items-center pr-10">
                  <div className="text-right">
                    <p className="text-4xl md:text-5xl font-extrabold text-green-800 drop-shadow">
                      Embrace <span className="text-yellow-400">Nature’s</span> Touch
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9 grid place-items-center hover:bg-black/60"
        >
          ‹
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9 grid place-items-center hover:bg-black/60"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                index === i ? "w-6 bg-white" : "w-2.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
