import React from 'react';
import { CrescentStarIcon, MosqueSilhouette } from './IslamicGraphics';
import { ArrowRight } from 'lucide-react';

export const SplashScreen: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#091712] via-[#0d221b] to-[#06120e] flex flex-col justify-between p-6 sm:p-12 select-none overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col items-center pt-8 text-center space-y-4">
        {/* Crescent Icon with gold aura */}
        <div className="w-20 h-20 rounded-3xl bg-[#142e23] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.3)] animate-pulse">
          <CrescentStarIcon className="w-12 h-12 text-[#d4af37]" />
        </div>

        <div className="space-y-1">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Hamdeen
          </h1>
          <p className="text-sm font-semibold text-[#f3c669] tracking-wider uppercase">
            My Deen Companion
          </p>
        </div>

        {/* Authentic Quranic Quote */}
        <div className="max-w-md mx-auto pt-6 px-4">
          <div className="text-right mb-2" dir="rtl">
            <p className="font-arabic text-xl sm:text-2xl text-[#f3c669] leading-relaxed">
              وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
            </p>
          </div>
          <blockquote className="text-sm sm:text-base text-slate-200 italic leading-relaxed">
            "And whoever fears Allah - He will make for him a way out."
          </blockquote>
          <span className="text-xs text-emerald-400 font-medium block mt-1">
            (Surah At-Talaq, 65:2)
          </span>
        </div>
      </div>

      {/* Mosque Silhouette Backdrop at bottom */}
      <div className="relative w-full flex flex-col items-center">
        <div className="w-full h-44 text-[#06120e] opacity-80 pointer-events-none">
          <MosqueSilhouette className="w-full h-full" />
        </div>

        {/* CTA Button */}
        <div className="w-full max-w-sm mb-6 z-10">
          <button
            onClick={onGetStarted}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#f3c669] text-slate-950 font-black text-base shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
