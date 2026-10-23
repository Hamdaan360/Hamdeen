import React from 'react';
import { useApp } from '../context/AppContext';
import { MosqueSilhouette, CrescentStarIcon, KaabaIcon } from './IslamicGraphics';
import { formatTime12 } from '../utils/prayerCalculations';
import { getDuaOfTheDay } from '../data/duasData';
import {
  CheckSquare,
  BookOpen,
  Bell,
  Compass,
  CircleDot,
  Heart,
  Calendar,
  BarChart2,
  ChevronRight,
  Clock,
  Sparkles,
  Share2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const {
    settings,
    hijriDate,
    nextPrayer,
    prayerTimes,
    currentDayLog,
    quranPlan,
    setActiveTab,
    updatePrayerStatus,
  } = useApp();

  const todayDua = getDuaOfTheDay(new Date());

  // Count completed prayers
  const prayersList: Array<'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'> = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const completedCount = prayersList.filter(
    (p) => currentDayLog.prayers[p]?.status === 'completed'
  ).length;
  const progressPercent = Math.round((completedCount / 5) * 100);

  // Quran progress percent
  const quranPercent = Math.min(
    100,
    Math.round((quranPlan.todayMinutesRead / Math.max(1, quranPlan.dailyMinutesGoal)) * 100)
  );

  const handleShareDua = () => {
    const text = `${todayDua.arabic}\n\n"${todayDua.translation}"\n\n— ${todayDua.reference}\nShared from Hamdeen Islamic Companion`;
    if (navigator.share) {
      navigator.share({ title: todayDua.title, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Dua copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8 max-w-5xl mx-auto">
      {/* Welcome Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
            {hijriDate.formatted}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Assalamu Alaikum, {settings.userName || 'Brother'}
          </h2>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto bg-[#132c22] border border-[#d4af37]/20 px-3 py-1.5 rounded-full text-xs text-slate-300">
          <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Next: <strong className="text-white">{nextPrayer.name}</strong> at {nextPrayer.time12}</span>
        </div>
      </div>

      {/* Hero: Next Prayer Card with Mosque Silhouette */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#123126] via-[#0d221a] to-[#081812] border border-[#d4af37]/25 p-6 sm:p-8 shadow-xl">
        {/* Mosque Silhouette Backdrop */}
        <div className="absolute right-0 bottom-0 w-2/3 h-44 pointer-events-none opacity-40 text-[#050f0c]">
          <MosqueSilhouette className="w-full h-full" />
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b3d30] border border-[#d4af37]/30 text-xs text-[#f3c669] font-medium">
              <CrescentStarIcon className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Next Prayer</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {settings.location.city}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {nextPrayer.name}
              </h3>
              <span className="text-2xl sm:text-3xl font-bold text-[#f3c669] tabular-nums">
                {nextPrayer.time12}
              </span>
            </div>
            <p className="text-sm text-emerald-300/90 font-medium">
              Starts in {nextPrayer.countdownFormatted}
            </p>
          </div>

          {/* 5 Daily Prayer Time Chips Row */}
          <div className="grid grid-cols-5 gap-2 pt-2 border-t border-[#d4af37]/15">
            {prayersList.map((p) => {
              const time = prayerTimes[p];
              const isCurrentNext = nextPrayer.name === p;
              const isCompleted = currentDayLog.prayers[p]?.status === 'completed';

              return (
                <div
                  key={p}
                  onClick={() => setActiveTab('namaz')}
                  className={`cursor-pointer rounded-xl p-2 sm:p-2.5 text-center transition-all ${
                    isCurrentNext
                      ? 'bg-[#1b4334] border border-[#d4af37] text-white shadow-md'
                      : isCompleted
                      ? 'bg-[#0f281e]/80 border border-emerald-500/30 text-emerald-200'
                      : 'bg-[#0a1b14]/70 border border-white/5 text-slate-300 hover:bg-[#122b20]'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-[11px] font-semibold truncate">{p}</span>
                    {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold text-[#f3c669] mt-0.5 tabular-nums truncate">
                    {formatTime12(time).split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Grid: Today's Prayer Checklist + Quran Reading Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prayer Tracker Card */}
        <div className="rounded-2xl bg-[#0f241d]/90 border border-[#d4af37]/20 p-5 flex flex-col justify-between hover:border-[#d4af37]/40 transition-colors shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#16372b] flex items-center justify-center text-[#d4af37]">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-white text-base">Today's Namaz</h4>
              </div>
              <span className="text-sm font-bold text-[#f3c669] tabular-nums">
                {completedCount} / 5 <span className="text-xs text-slate-400 font-normal">({progressPercent}%)</span>
              </span>
            </div>

            {/* Quick Check Row */}
            <div className="grid grid-cols-5 gap-2 my-3">
              {prayersList.map((prayer) => {
                const status = currentDayLog.prayers[prayer]?.status;
                const isDone = status === 'completed';

                return (
                  <button
                    key={prayer}
                    onClick={() => updatePrayerStatus(prayer, isDone ? 'pending' : 'completed')}
                    className={`py-2 px-1 rounded-xl text-center text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                      isDone
                        ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 shadow-inner'
                        : 'bg-[#152e24] border border-white/10 text-slate-400 hover:text-white hover:border-[#d4af37]/30'
                    }`}
                  >
                    <span>{prayer[0]}</span>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        isDone ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'
                      }`}
                    >
                      {isDone ? '✓' : ''}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('namaz')}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#143327] hover:bg-[#1a3f31] border border-[#d4af37]/20 text-xs font-semibold text-[#f3c669] flex items-center justify-center gap-2 transition-colors"
          >
            <span>Open Namaz Tracker & Notes</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quran Goal Card */}
        <div className="rounded-2xl bg-[#0f241d]/90 border border-[#d4af37]/20 p-5 flex flex-col justify-between hover:border-[#d4af37]/40 transition-colors shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#16372b] flex items-center justify-center text-[#d4af37]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Quran Reading Goal</h4>
                  <p className="text-xs text-slate-400">{quranPlan.dailyMinutesGoal} Minutes Daily</p>
                </div>
              </div>
              <span className="text-sm font-bold text-[#f3c669] tabular-nums">
                {quranPlan.todayMinutesRead} / {quranPlan.dailyMinutesGoal} min
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-[#091712] rounded-full overflow-hidden border border-[#d4af37]/20 my-3">
              <div
                className="h-full bg-gradient-to-r from-[#d4af37] to-[#f3c669] rounded-full transition-all duration-500"
                style={{ width: `${quranPercent}%` }}
              />
            </div>

            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Last read: <strong className="text-slate-200">{quranPlan.lastRead.surahEnglishName} ({quranPlan.lastRead.ayahNumber})</strong></span>
              <span>{quranPercent}% done</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('quran')}
            className="w-full mt-3 py-2.5 px-4 rounded-xl bg-[#d4af37] hover:bg-[#e5be4a] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
          >
            <span>Continue Reading Quran</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Access Tools Grid */}
      <div>
        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
          Daily Islamic Companions
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('tasbeeh')}
            className="p-4 rounded-2xl bg-[#0f241d]/80 border border-[#d4af37]/15 hover:border-[#d4af37]/40 hover:bg-[#143227] transition-all flex flex-col items-start gap-2 text-left group"
          >
            <div className="p-2.5 rounded-xl bg-[#173a2e] text-[#d4af37] group-hover:scale-105 transition-transform">
              <CircleDot className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">Tasbeeh Counter</span>
              <span className="text-xs text-slate-400">Digital Dhikr Beads</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('qibla')}
            className="p-4 rounded-2xl bg-[#0f241d]/80 border border-[#d4af37]/15 hover:border-[#d4af37]/40 hover:bg-[#143227] transition-all flex flex-col items-start gap-2 text-left group"
          >
            <div className="p-2.5 rounded-xl bg-[#173a2e] text-[#d4af37] group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">Qibla Direction</span>
              <span className="text-xs text-slate-400">Live Kaaba Compass</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('alarms')}
            className="p-4 rounded-2xl bg-[#0f241d]/80 border border-[#d4af37]/15 hover:border-[#d4af37]/40 hover:bg-[#143227] transition-all flex flex-col items-start gap-2 text-left group"
          >
            <div className="p-2.5 rounded-xl bg-[#173a2e] text-[#d4af37] group-hover:scale-105 transition-transform">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">Prayer Alarms</span>
              <span className="text-xs text-slate-400">Adhan & Reminders</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('dua')}
            className="p-4 rounded-2xl bg-[#0f241d]/80 border border-[#d4af37]/15 hover:border-[#d4af37]/40 hover:bg-[#143227] transition-all flex flex-col items-start gap-2 text-left group"
          >
            <div className="p-2.5 rounded-xl bg-[#173a2e] text-[#d4af37] group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">Dua of the Day</span>
              <span className="text-xs text-slate-400">Quranic & Sunnah Duas</span>
            </div>
          </button>
        </div>
      </div>

      {/* Featured Dua of the Day Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#122e23] to-[#0c1e17] border border-[#d4af37]/30 p-6 sm:p-7 relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <h4 className="text-sm font-bold text-[#f3c669] uppercase tracking-wider">
              Dua of the Day
            </h4>
          </div>
          <button
            onClick={handleShareDua}
            className="p-2 rounded-lg bg-[#193d2f] text-slate-300 hover:text-white hover:bg-[#204a39] transition-colors"
            title="Share Dua"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="my-3 text-right" dir="rtl">
          <p className="font-arabic text-xl sm:text-2xl leading-loose text-white font-normal">
            {todayDua.arabic}
          </p>
        </div>

        <div className="space-y-2 mt-4 pt-4 border-t border-[#d4af37]/15">
          <p className="text-xs text-emerald-300 italic font-medium">
            {todayDua.transliteration}
          </p>
          <p className="text-sm text-slate-200 leading-relaxed">
            "{todayDua.translation}"
          </p>
          <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
            <span>{todayDua.reference}</span>
            <button
              onClick={() => setActiveTab('dua')}
              className="text-[#f3c669] font-medium hover:underline inline-flex items-center gap-1"
            >
              <span>Explore all Duas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
