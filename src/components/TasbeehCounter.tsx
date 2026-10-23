import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TASBEEH_PRESETS } from '../data/tasbeehData';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Award,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

export const TasbeehCounter: React.FC = () => {
  const {
    tasbeehCount,
    tasbeehTarget,
    tasbeehLifetimeTotal,
    currentDhikrId,
    incrementTasbeeh,
    resetTasbeeh,
    setTasbeehDhikr,
    settings,
    updateSettings,
  } = useApp();

  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [customTargetInput, setCustomTargetInput] = useState<number>(tasbeehTarget);

  const currentDhikr =
    TASBEEH_PRESETS.find((d) => d.id === currentDhikrId) || TASBEEH_PRESETS[0];

  const progressPercent = Math.min(100, Math.round((tasbeehCount / Math.max(1, tasbeehTarget)) * 100));

  // Circular SVG ring math
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const handleSelectPreset = (presetId: string, defaultTarget: number) => {
    setTasbeehDhikr(presetId, defaultTarget);
    setCustomTargetInput(defaultTarget);
  };

  const handleConfirmReset = () => {
    resetTasbeeh();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8 max-w-xl mx-auto flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Tasbeeh Counter</h2>
          <p className="text-xs text-slate-400">Digital Dhikr and remembrance of Allah</p>
        </div>

        <button
          onClick={() => updateSettings({ soundEffects: !settings.soundEffects })}
          className="p-2.5 rounded-full bg-[#122b22] border border-[#d4af37]/25 text-slate-300 hover:text-[#d4af37] transition-colors"
          title="Toggle audio click"
        >
          {settings.soundEffects ? <Volume2 className="w-4 h-4 text-[#d4af37]" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Selected Dhikr Card */}
      <div className="w-full rounded-3xl bg-[#0f241d] border border-[#d4af37]/25 p-5 text-center shadow-md">
        <span className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider block mb-1">
          Current Dhikr
        </span>
        <h3 className="font-arabic text-3xl font-bold text-white mb-1" dir="rtl">
          {currentDhikr.arabic}
        </h3>
        <p className="text-sm font-semibold text-emerald-300">
          {currentDhikr.transliteration}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">"{currentDhikr.meaning}"</p>
      </div>

      {/* Interactive Circular Counter Bead Display */}
      <div className="relative flex items-center justify-center my-4 select-none">
        {/* SVG Ring */}
        <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 220 220">
          {/* Background circle */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            stroke="rgba(212, 175, 55, 0.15)"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Glowing Progress circle */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            stroke="url(#goldGradient)"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-200"
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f3c669" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Numbers and Tap Trigger */}
        <div
          onClick={incrementTasbeeh}
          className="absolute inset-0 m-auto w-48 h-48 rounded-full bg-gradient-to-br from-[#153428] to-[#0c1f17] border border-[#d4af37]/40 flex flex-col items-center justify-center cursor-pointer shadow-2xl active:scale-95 transition-transform group"
          role="button"
          tabIndex={0}
          aria-label="Tap to count tasbeeh"
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              incrementTasbeeh();
            }
          }}
        >
          <span className="text-5xl font-black text-white tabular-nums tracking-tight group-hover:scale-105 transition-transform">
            {tasbeehCount}
          </span>
          <span className="text-xs text-[#d4af37] font-semibold mt-1 tabular-nums">
            / {tasbeehTarget}
          </span>
          <span className="text-[11px] text-slate-400 mt-2 font-medium tracking-wide">
            Tap to Count
          </span>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="w-full space-y-2">
        <span className="text-xs text-slate-400 font-semibold block text-center">
          Dhikr Presets
        </span>
        <div className="grid grid-cols-3 gap-2">
          {TASBEEH_PRESETS.slice(0, 6).map((preset) => {
            const isSelected = preset.id === currentDhikrId;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id, preset.defaultTarget)}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                  isSelected
                    ? 'bg-[#1a4132] border-[#d4af37] text-white shadow-md'
                    : 'bg-[#0f241d] border-white/5 text-slate-300 hover:bg-[#143026]'
                }`}
              >
                <span className="text-sm font-bold text-[#f3c669] tabular-nums">
                  {preset.defaultTarget}
                </span>
                <span className="text-[11px] font-medium truncate max-w-[100px] mt-0.5">
                  {preset.transliteration}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Selector & Reset Bar */}
      <div className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e221b] border border-[#d4af37]/20">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Target:</span>
          {[33, 66, 100].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTasbeehDhikr(currentDhikrId, t);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                tasbeehTarget === t
                  ? 'bg-[#d4af37] text-slate-950'
                  : 'bg-[#152e24] text-slate-300 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:bg-rose-900/60 text-xs font-semibold transition-colors"
          title="Reset current count"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Lifetime Stats */}
      <div className="w-full p-4 rounded-2xl bg-[#0a1813] border border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Award className="w-4 h-4 text-[#d4af37]" />
          <span>Lifetime Saved Dhikr:</span>
        </div>
        <span className="text-sm font-bold text-[#f3c669] tabular-nums">
          {tasbeehLifetimeTotal.toLocaleString()} praises
        </span>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e231c] border border-[#d4af37]/30 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl text-center">
            <h4 className="text-base font-bold text-white">Reset Counter?</h4>
            <p className="text-xs text-slate-400">
              Are you sure you want to reset current count ({tasbeehCount}) back to 0? Your total lifetime count remains preserved.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 shadow-md"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
