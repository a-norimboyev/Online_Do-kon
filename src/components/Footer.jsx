import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Apple,
  Play,
  Send,
  Instagram,
  Facebook,
  Youtube,
  Heart
} from 'lucide-react';

export default function Footer() {
  const { categories, setSelectedCategory, setCurrentView } = useStore();

  return (
    <footer className="bg-white dark:bg-[#1F2026] border-t border-slate-100 dark:border-slate-800 transition-colors mt-20 text-slate-800 dark:text-slate-200">
      {/* Main 4 Columns (Uzum Market Exact Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Biz haqimizda */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Biz haqimizda
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="hover:text-[#7000FF] cursor-pointer transition-colors">Topshirish punktlari</li>
              <li className="hover:text-[#7000FF] cursor-pointer transition-colors">Vakansiyalar</li>
              <li className="hover:text-[#7000FF] cursor-pointer transition-colors">Kompaniya haqida</li>
            </ul>
          </div>

          {/* Column 2: Foydalanuvchilarga */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Foydalanuvchilarga
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="hover:text-[#7000FF] cursor-pointer transition-colors">Biz bilan bog'lanish</li>
              <li className="hover:text-[#7000FF] cursor-pointer transition-colors">Savol-Javob</li>
              <li className="hover:text-[#7000FF] cursor-pointer transition-colors">Yetkazib berish va to'lov</li>
              <li className="hover:text-[#7000FF] cursor-pointer transition-colors">Tovarlarni qaytarish</li>
            </ul>
          </div>

          {/* Column 3: Tadbirkorlarga */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Tadbirkorlarga
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="hover:text-[#7000FF] cursor-pointer transition-colors">Uzumda soting</li>
              <li className="hover:text-[#7000FF] cursor-pointer transition-colors">Sotuvchi kabinetiga kirish</li>
              <li className="hover:text-[#7000FF] cursor-pointer transition-colors">Topshirish punktini ochish</li>
            </ul>
          </div>

          {/* Column 4: Ilovani yuklab olish & Socials */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Ilovani yuklab olish
            </h4>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors text-xs font-semibold">
                <Apple className="w-4 h-4" />
                <span>AppStore</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors text-xs font-semibold">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Google Play</span>
              </button>
            </div>

            <div className="pt-2">
              <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-2.5">
                Uzum ijtimoiy tarmoqlarda
              </h5>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#229ED9] flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <Send className="w-4 h-4 -translate-x-0.5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#FF0000] flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">Maxfiylik kelishuvi</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">Foydalanuvchi kelishuvi</span>
            <span className="hidden md:inline">«UZUM MARKET» MCHJ XK</span>
          </div>

          <p>© 2026 «UZUM MARKET». Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
}
