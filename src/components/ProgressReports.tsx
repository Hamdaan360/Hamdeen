import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PrayerName } from '../types';
import {
  BarChart2,
  Calendar,
  CheckCircle,
  Flame,
  Award,
  BookOpen,
  TrendingUp,
  Clock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const ProgressReports: React.FC = () => {
  const { allLogs, quranPlan, resetUserDataToZero } = useApp();
  const [activeReportTab, setActiveReportTab] = useState<'namaz' | 'quran'>('namaz');
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [resetNotice, setResetNotice] = useState<boolean>(false);

  // Compute stats for the past 7 days based strictly on allLogs
  const today = new Date();
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayLog = allLogs[dateStr];

      const prayers: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      const done = prayers.filter((p) => dayLog?.prayers?.[p]?.status === 'completed').length;
      const percent = Math.round((done / 5) * 100);

      return {
        dateStr,
        dayLabel,
        completedCount: done,
        percentage: percent,
      };
    });
  }, [allLogs, today]);

  // Calculate real total prayers completed across all logs
  const totalPrayersCompleted = useMemo(() => {
    let count = 0;
    const prayers: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    Object.values(allLogs).forEach((day) => {
      prayers.forEach((p) => {
        if (day.prayers?.[p]?.status === 'completed') {
          count += 1;
        }
      });
    });
    return count;
  }, [allLogs]);

  // Calculate real consecutive days streak
  const currentStreak = useMemo(() => {
    const prayers: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const checkDate = new Date();
    const todayStr = checkDate.toISOString().split('T')[0];
    const todayDone = prayers.filter((p) => allLogs[todayStr]?.prayers?.[p]?.status === 'completed').length;

    let streak = 0;
    let d = new Date(checkDate);

    // If no prayer is logged today yet, check starting from yesterday
    if (todayDone === 0) {
      d.setDate(d.getDate() - 1);
    }

    while (true) {
      const ds = d.toISOString().split('T')[0];
      const log = allLogs[ds];
      const done = prayers.filter((p) => log?.prayers?.[p]?.status === 'completed').length;
      if (done > 0) {
        streak += 1;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }, [allLogs]);

  // Overall Namaz completion percentage (starts at 0% when no logs exist)
  const overallNamazRate = useMemo(() => {
    const totalDaysLogged = Object.keys(allLogs).length;
    if (totalDaysLogged === 0) return 0;
    return Math.min(100, Math.round((totalPrayersCompleted / (totalDaysLogged * 5)) * 100));
  }, [allLogs, totalPrayersCompleted]);

  // Quran Reading calculation
  const quranStreakDays = quranPlan.todayMinutesRead > 0 ? 1 : 0;
  const quranGoalPercent = quranPlan.dailyMinutesGoal > 0
    ? Math.min(100, Math.round((quranPlan.todayMinutesRead / quranPlan.dailyMinutesGoal) * 100))
    : 0;

  const handleResetConfirm = () => {
    resetUserDataToZero();
    setShowResetConfirm(false);
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8 max-w-4xl mx-auto">
      {/* Header & Segmented Tab */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Progress & Reports</h2>
          <p className="text-xs text-slate-400">Personal spiritual metrics based on your actual logs</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1 p-1 bg-[#0e221b] border border-[#d4af37]/20 rounded-2xl">
            <button
              onClick={() => setActiveReportTab('namaz')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeReportTab === 'namaz'
                  ? 'bg-[#183d2f] text-[#f3c669] border border-[#d4af37]/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Namaz Tracker
            </button>
            <button
              onClick={() => setActiveReportTab('quran')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeReportTab === 'quran'
                  ? 'bg-[#183d2f] text-[#f3c669] border border-[#d4af37]/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Quran Reading
            </button>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-2 rounded-xl bg-[#122820] border border-[#d4af37]/20 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
            title="Reset stats to 0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {resetNotice && (
        <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>All streak, report, and prayer log statistics have been reset to 0.</span>
        </div>
      )}

      {activeReportTab === 'namaz' ? (
        <>
          {/* Namaz Completion Weekly Bar Chart Card */}
          <div className="rounded-3xl bg-[#0e221b] border border-[#d4af37]/20 p-6 sm:p-7 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-base font-bold text-white">Namaz Completion</h4>
                <p className="text-xs text-slate-400">Past 7 Days</p>
              </div>
              <span className="text-xs font-semibold text-[#f3c669] bg-[#142e23] px-3 py-1 rounded-full border border-[#d4af37]/20">
                This Week
              </span>
            </div>

            {/* Vertical Bar Chart */}
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 pt-6 pb-2 border-b border-white/5">
              {weekDays.map((item, idx) => {
                const barHeight = item.percentage;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[10px] font-bold text-slate-300 tabular-nums">
                      {item.percentage}%
                    </span>
                    <div className="w-full max-w-[36px] bg-[#091712] rounded-xl h-36 flex items-end p-1">
                      <div
                        className="w-full bg-gradient-to-t from-emerald-600 to-[#d4af37] rounded-lg transition-all duration-500 shadow-sm"
                        style={{ height: `${barHeight}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-400">{item.dayLabel}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 text-xs text-slate-400">
              <span>Goal: 5 daily prayers (100%)</span>
              <span className="text-emerald-300 font-medium">Log prayers daily in Namaz Tracker</span>
            </div>
          </div>

          {/* Monthly Overview Summary (All calculated strictly from real 0 start) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-[#0f241d] border border-[#d4af37]/20 flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#183e30] text-[#f3c669]">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400">Active Streak</span>
                <div className="text-2xl font-black text-white tabular-nums">
                  {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
                </div>
                <span className="text-[10px] text-emerald-400">
                  {currentStreak > 0 ? 'MashaAllah keep going' : 'Start your streak today'}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#0f241d] border border-[#d4af37]/20 flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#183e30] text-[#f3c669]">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400">Monthly Average</span>
                <div className="text-2xl font-black text-[#f3c669] tabular-nums">
                  {overallNamazRate}%
                </div>
                <span className="text-[10px] text-slate-400">
                  {totalPrayersCompleted > 0 ? 'Based on verified logs' : 'No prayers recorded yet'}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#0f241d] border border-[#d4af37]/20 flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#183e30] text-[#f3c669]">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400">Total Prayers Logged</span>
                <div className="text-2xl font-black text-white tabular-nums">
                  {totalPrayersCompleted}
                </div>
                <span className="text-[10px] text-emerald-400">
                  {totalPrayersCompleted > 0 ? 'Preserved in local storage' : 'Ready to record first prayer'}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Quran Reading Reports */
        <div className="space-y-4">
          <div className="rounded-3xl bg-[#0e221b] border border-[#d4af37]/20 p-6 sm:p-7 shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-white">Quran Reading Summary</h4>
                <p className="text-xs text-slate-400">Habit fidelity and minutes spent with Allah's words</p>
              </div>
              <span className="text-xs font-semibold text-[#f3c669] bg-[#142e23] px-3 py-1 rounded-full border border-[#d4af37]/20">
                Monthly Target
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#091712] border border-white/5 text-center">
                <span className="text-xs text-slate-400 block mb-1">Today's Recitation</span>
                <span className="text-3xl font-extrabold text-[#f3c669] tabular-nums">
                  {quranPlan.todayMinutesRead} min
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Goal: {quranPlan.dailyMinutesGoal} min
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#091712] border border-white/5 text-center">
                <span className="text-xs text-slate-400 block mb-1">Ayahs Recited</span>
                <span className="text-3xl font-extrabold text-white tabular-nums">
                  {quranPlan.todayAyahsRead}
                </span>
                <span className="text-[11px] text-emerald-300 block mt-1">
                  Daily target: {quranPlan.dailyAyahsGoal}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#091712] border border-white/5 text-center">
                <span className="text-xs text-slate-400 block mb-1">Total Reading Streak</span>
                <span className="text-3xl font-extrabold text-white tabular-nums">
                  {quranStreakDays} / 30
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Days read this month
                </span>
              </div>
            </div>

            {/* Reading Habit Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Monthly Reading Target</span>
                <span className="font-bold text-[#f3c669]">{quranGoalPercent}% Completed</span>
              </div>
              <div className="h-3 bg-[#081510] rounded-full overflow-hidden border border-[#d4af37]/20">
                <div
                  className="h-full bg-gradient-to-r from-[#d4af37] to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${quranGoalPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e221b] border border-rose-500/40 rounded-3xl p-6 w-full max-w-sm space-y-4 text-center">
            <RotateCcw className="w-8 h-8 text-rose-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Reset User Data & Streaks to 0?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will reset your Namaz streaks, prayer logs, Quran reading progress, and Tasbeeh counters back to 0.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleResetConfirm}
                className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 shadow-md"
              >
                Reset to 0
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
