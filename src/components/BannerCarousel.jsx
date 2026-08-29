import React, { useState, useEffect } from 'react';
import { BANNERS } from '../data/initialData';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

export default function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setSelectedCategory } = useStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % BANNERS.length);
  };

  const banner = BANNERS[currentSlide];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl shadow-xl my-6 bg-slate-900">
      <div className="relative h-64 sm:h-80 md:h-96 w-full flex items-center">
        {/* Background image & gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover opacity-40 transform scale-105 transition-all duration-700"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgGradient} opacity-90 mix-blend-multiply`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl px-6 sm:px-12 text-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{banner.tag}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-3">
            {banner.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-200 mb-6 line-clamp-2 max-w-lg">
            {banner.subtitle}
          </p>
          <button
            onClick={() => {
              if (banner.categoryTarget) {
                setSelectedCategory(banner.categoryTarget);
              }
              const el = document.getElementById('catalog-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-950 font-bold hover:bg-amber-400 hover:text-slate-950 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <span>{banner.buttonText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-4 z-20 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
          aria-label="Oldingi slayd"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-4 z-20 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
          aria-label="Keyingi slayd"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Slayd ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

