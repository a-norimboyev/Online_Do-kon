import React, { useState, useEffect } from 'react';
import { BANNERS } from '../data/initialData';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Tv, ShoppingBasket, Shirt, GraduationCap } from 'lucide-react';

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

  const quickPills = [
    { title: "Maishiy texnika", icon: Tv, catId: "appliances", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50" },
    { title: "Kundalik ishlatishga", icon: ShoppingBasket, catId: "smartphones", color: "text-purple-600 bg-purple-50 dark:bg-purple-950/50" },
    { title: "Zamonaviy bozor", icon: Shirt, catId: "clothing", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50" },
    { title: "Maktab bozori", icon: GraduationCap, catId: "books", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50" },
  ];

  return (
    <div className="space-y-4 my-6">
      {/* Uzum Big Curved Hero Banner */}
      <div className="relative w-full overflow-hidden rounded-3xl shadow-xl bg-slate-900">
        <div className="relative h-60 sm:h-80 md:h-[400px] w-full flex items-center">
          {/* Background image & gradient */}
          <div className="absolute inset-0 z-0">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover transform scale-105 transition-all duration-700"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgGradient} opacity-85 mix-blend-multiply`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-2xl px-6 sm:px-12 text-white">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7000FF] text-white text-xs font-black uppercase tracking-wider mb-3 shadow-lg">
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
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-900 font-extrabold hover:bg-[#7000FF] hover:text-white transition-all duration-200 shadow-xl hover:scale-105 active:scale-95"
            >
              <span>{banner.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-3 sm:left-4 z-20 p-2 sm:p-3 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-lg backdrop-blur-sm transition-all"
            aria-label="Oldingi slayd"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 sm:right-4 z-20 p-2 sm:p-3 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-lg backdrop-blur-sm transition-all"
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
                  currentSlide === idx ? 'w-8 bg-[#7000FF]' : 'w-2 bg-white/60 hover:bg-white'
                }`}
                aria-label={`Slayd ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Category Pill Cards (Exact Uzum Market row under banner) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickPills.map((pill, i) => {
          const Icon = pill.icon;
          return (
            <button
              key={i}
              onClick={() => setSelectedCategory(pill.catId)}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F2F4F7] dark:bg-[#1F2026] hover:bg-[#E8E3FF] dark:hover:bg-[#2F1B5C] border border-slate-200/50 dark:border-slate-800 transition-all text-left group"
            >
              <div className={`p-2.5 rounded-xl ${pill.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#7000FF] block">
                  {pill.title}
                </span>
                <span className="text-[11px] text-slate-400">Katalog</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
