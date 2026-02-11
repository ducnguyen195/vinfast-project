import { useEffect, useState } from "react";

const slides = [
  "/images/banner/vinfast-vf-7.png",
  "/images/banner/vinfast-vf-8.png",
  "/images/banner/vinfast-vf-9.png"
];

export default function Slider() {
  const [current, setCurrent] = useState(0);

  // Auto chạy
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent((current + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[900px] overflow-hidden">
      
      {/* Image */}
      <img
        src={slides[current]}
        className="w-full h-full object-cover transition-all duration-500"
        alt="banner"
      />

      {/* Nút trái */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full"
      >
        ‹
      </button>

      {/* Nút phải */}
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 w-full flex justify-center gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              current === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
