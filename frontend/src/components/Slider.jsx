import { useEffect, useState } from "react";

const slides = [
  "/images/banner/vinfast-vf-7.png",
  "/images/banner/vinfast-vf-8.png",
  "/images/banner/vinfast-vf-9.png"
];

export default function Slider() {
  const [current, setCurrent] = useState(0);

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
    <div className="relative w-full 
                    h-[220px] 
                    sm:h-[320px] 
                    md:h-[420px] 
                    lg:h-[600px] 
                    xl:h-[750px] 
                    2xl:h-[900px] 
                    overflow-hidden">

      {/* Image */}
      <img
        src={slides[current]}
        className="w-full h-full object-cover transition-all duration-500"
        alt="banner"
      />

      {/* Nút trái */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 
                   bg-black/40 text-white 
                   w-8 h-8 md:w-10 md:h-10 
                   rounded-full"
      >
        ‹
      </button>

      {/* Nút phải */}
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 
                   bg-black/40 text-white 
                   w-8 h-8 md:w-10 md:h-10 
                   rounded-full"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 md:bottom-5 w-full flex justify-center gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full cursor-pointer ${
              current === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
