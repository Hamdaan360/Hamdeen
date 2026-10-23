import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getHijriDate, HIJRI_MONTHS, ISLAMIC_EVENTS } from '../utils/hijriCalendar';
import { MosqueSilhouette } from './IslamicGraphics';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Info,
  Star,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { hijriDate, settings, selectedDateStr, setSelectedDateStr, currentDateStr } = useApp();

  const [viewMode, setViewMode] = useState<'gregorian' | 'hijri'>('gregorian');
  const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => new Date().getMonth()); // 0-indexed

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const monthName = new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Calculate grid days for current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blankDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="space-y-6 pb-20 lg:pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Islamic Calendar</h2>
          <p className="text-xs text-slate-400">Gregorian dates synchronized with the sacred Hijri calendar</p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 bg-[#0e221b] border border-[#d4af37]/20 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setViewMode('gregorian')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              viewMode === 'gregorian'
                ? 'bg-[#183d2f] text-[#f3c669] border border-[#d4af37]/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Gregorian Grid
          </button>
          <button
            onClick={() => setViewMode('hijri')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              viewMode === 'hijri'
                ? 'bg-[#183d2f] text-[#f3c669] border border-[#d4af37]/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hijri Events View
          </button>
        </div>
      </div>

      {/* Featured Hijri Today Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#123126] via-[#0e241c] to-[#071610] border border-[#d4af37]/30 p-6 sm:p-7 relative overflow-hidden shadow-lg">
        <div className="absolute right-0 bottom-0 w-1/2 h-36 opacity-30 text-[#050f0c] pointer-events-none">
          <MosqueSilhouette className="w-full h-full" />
        </div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b3d30] border border-[#d4af37]/30 text-xs text-[#f3c669] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Current Islamic Date</span>
          </div>

          <div className="flex items-baseline gap-3">
            <h3 className="font-arabic text-3xl sm:text-4xl font-bold text-white tracking-wide" dir="rtl">
              {hijriDate.arabicFormatted}
            </h3>
          </div>

          <p className="text-lg font-bold text-[#f3c669]">
            {hijriDate.formatted}
          </p>

          <p className="text-xs text-slate-300">
            Gregorian: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Gregorian + Hijri Interactive Grid */}
      {viewMode === 'gregorian' && (
        <div className="rounded-3xl bg-[#0e221b] border border-[#d4af37]/20 p-5 sm:p-6 shadow-md">
          {/* Month Navigator */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl bg-[#142e23] border border-white/5 text-slate-300 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-white">{monthName}</h3>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl bg-[#142e23] border border-white/5 text-slate-300 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d} className="text-xs font-semibold text-slate-400 py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {blankDays.map((b) => (
              <div key={`blank-${b}`} className="h-16 rounded-xl bg-[#091712]/40" />
            ))}

            {daysArray.map((dayNum) => {
              const cellDate = new Date(currentYear, currentMonth, dayNum);
              const cellDateStr = cellDate.toISOString().split('T')[0];
              const cellHijri = getHijriDate(cellDate, settings.hijriAdjustment);
              const isTodayCell = cellDateStr === currentDateStr;
              const isSelected = cellDateStr === selectedDateStr;

              // Check if any Islamic event falls on this hijri day/month
              const eventToday = ISLAMIC_EVENTS.find(
                (e) => e.hijriMonth === cellHijri.month && e.hijriDay === cellHijri.day
              );

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDateStr(cellDateStr)}
                  className={`h-16 rounded-xl p-1.5 flex flex-col justify-between items-center transition-all text-center border relative ${
                    isTodayCell
                      ? 'bg-[#184232] border-[#d4af37] text-white shadow-md'
                      : isSelected
                      ? 'bg-[#122e23] border-emerald-500/50 text-white'
                      : 'bg-[#0a1813] border-white/5 text-slate-300 hover:bg-[#122b21]'
                  }`}
                >
                  <span className="text-xs font-bold tabular-nums">{dayNum}</span>

                  <span className="text-[10px] text-[#f3c669] font-medium font-arabic tabular-nums">
                    {cellHijri.day}
                  </span>

                  {eventToday && (
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[0_0_6px_#d4af37]"
                      title={eventToday.title}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Dedicated Hijri Events & Islamic Holidays List */}
      <div className="rounded-3xl bg-[#0e221b] border border-[#d4af37]/20 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-[#d4af37]" />
            <span>Important Islamic Milestones</span>
          </h4>
          <span className="text-xs text-slate-400">Hijri 1448 AH</span>
        </div>

        <div className="divide-y divide-white/5">
          {ISLAMIC_EVENTS.map((event) => {
            const isCurrentMonth = event.hijriMonth === hijriDate.month;
            const isTodayEvent = event.hijriMonth === hijriDate.month && event.hijriDay === hijriDate.day;

            return (
              <div
                key={event.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-bold text-white">{event.title}</h5>
                    <span className="font-arabic text-xs text-[#f3c669]">{event.arabicTitle}</span>
                    {isTodayEvent && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                        Today!
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{event.description}</p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-xs font-bold text-[#f3c669] bg-[#142e23] px-2.5 py-1 rounded-xl border border-[#d4af37]/20">
                    {event.hijriDay} {event.hijriMonthName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
