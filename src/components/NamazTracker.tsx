import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PrayerName, PrayerStatus } from '../types';
import { formatTime12 } from '../utils/prayerCalculations';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  Users,
  Award,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';

export const NamazTracker: React.FC = () => {
  const {
    prayerTimes,
    currentDayLog,
    updatePrayerStatus,
    selectedDateStr,
    setSelectedDateStr,
    currentDateStr,
    qadaPrayers,
    adjustQadaPrayer,
  } = useApp();

  const [activeNotePrayer, setActiveNotePrayer] = useState<PrayerName | null>(null);
  const [noteText, setNoteText] = useState<string>('');
  const [isCongregation, setIsCongregation] = useState<boolean>(false);

  const prayersList: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  const completedCount = prayersList.filter(
    (p) => currentDayLog.prayers[p]?.status === 'completed'
  ).length;
  const percentage = Math.round((completedCount / 5) * 100);

  // Navigate date
  const changeDateBy = (days: number) => {
    const current = new Date(selectedDateStr + 'T12:00:00');
    current.setDate(current.getDate() + days);
    setSelectedDateStr(current.toISOString().split('T')[0]);
  };

  const isToday = selectedDateStr === currentDateStr;

  const openNotesModal = (prayer: PrayerName) => {
    const record = currentDayLog.prayers[prayer];
    setActiveNotePrayer(prayer);
    setNoteText(record?.notes || '');
    setIsCongregation(!!record?.isCongregation);
  };

  const saveNotesModal = () => {
    if (!activeNotePrayer) return;
    const currentRecord = currentDayLog.prayers[activeNotePrayer];
    updatePrayerStatus(
      activeNotePrayer,
      currentRecord?.status || 'pending',
      noteText,
      isCongregation
    );
    setActiveNotePrayer(null);
  };

  const getStatusBadge = (status: PrayerStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>In Progress</span>
          </span>
        );
      case 'missed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" />
            <span>Missed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#142d23] border border-white/10 text-slate-400 text-xs font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8 max-w-4xl mx-auto">
      {/* Title & Date Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Namaz Tracker</h2>
          <p className="text-xs text-slate-400">Track and fulfill your daily 5 prayers</p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-[#0e231c] border border-[#d4af37]/20 rounded-2xl p-1.5 self-start sm:self-auto">
          <button
            onClick={() => changeDateBy(-1)}
            className="p-1.5 rounded-xl hover:bg-[#153429] text-slate-300 transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-3">
            <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-xs font-bold text-white tabular-nums">
              {new Date(selectedDateStr + 'T12:00:00').toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            {isToday && (
              <span className="text-[10px] bg-[#1a3d30] text-[#f3c669] px-2 py-0.5 rounded-full font-semibold">
                Today
              </span>
            )}
          </div>

          <button
            onClick={() => changeDateBy(1)}
            className="p-1.5 rounded-xl hover:bg-[#153429] text-slate-300 transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isToday && (
            <button
              onClick={() => setSelectedDateStr(currentDateStr)}
              className="text-[11px] text-[#f3c669] hover:underline px-2 font-medium"
            >
              Today
            </button>
          )}
        </div>
      </div>

      {/* Completion Summary Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#123126] to-[#0c1f18] border border-[#d4af37]/25 p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs text-slate-400 font-medium">Daily Completion</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-extrabold text-white tabular-nums">{completedCount}/5</span>
            <span className="text-lg font-bold text-[#f3c669] tabular-nums">({percentage}%)</span>
          </div>
          <p className="text-xs text-emerald-300 mt-1">
            {completedCount === 5
              ? 'MashaAllah! All five prayers completed for this day.'
              : `${5 - completedCount} prayer(s) remaining.`}
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="flex-1 max-w-sm">
          <div className="h-3 bg-[#081510] rounded-full overflow-hidden border border-[#d4af37]/20">
            <div
              className="h-full bg-gradient-to-r from-[#d4af37] via-emerald-400 to-[#10b981] transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-2">
            <span>Fajr</span>
            <span>Dhuhr</span>
            <span>Asr</span>
            <span>Maghrib</span>
            <span>Isha</span>
          </div>
        </div>
      </div>

      {/* 5 Prayers List */}
      <div className="space-y-3">
        {prayersList.map((prayer) => {
          const time = prayerTimes[prayer];
          const record = currentDayLog.prayers[prayer] || { status: 'pending' };
          const status = record.status;

          return (
            <div
              key={prayer}
              className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                status === 'completed'
                  ? 'bg-[#102920]/90 border-emerald-500/30'
                  : status === 'missed'
                  ? 'bg-[#1f1618]/80 border-rose-500/25'
                  : 'bg-[#0e231c]/80 border-[#d4af37]/15 hover:border-[#d4af37]/35'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Prayer Name & Time */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base ${
                      status === 'completed'
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-[#143227] border border-[#d4af37]/25 text-[#f3c669]'
                    }`}
                  >
                    {prayer[0]}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-extrabold text-white">{prayer}</h4>
                      {getStatusBadge(status)}
                      {record.isCongregation && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#f3c669] bg-[#1a382c] px-2 py-0.5 rounded-md">
                          <Users className="w-3 h-3" /> Jamā‘ah
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="text-[#f3c669] font-semibold tabular-nums">{formatTime12(time)}</span>
                      {record.completedAt && (
                        <span>Logged at {record.completedAt}</span>
                      )}
                      {record.notes && (
                        <span className="truncate max-w-[150px] sm:max-w-[220px] italic text-slate-300">
                          "{record.notes}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Quick Status Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() =>
                      updatePrayerStatus(
                        prayer,
                        status === 'completed' ? 'pending' : 'completed'
                      )
                    }
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      status === 'completed'
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                        : 'bg-[#16382b] hover:bg-[#1d4737] text-white border border-[#d4af37]/25'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{status === 'completed' ? 'Done' : 'Mark Done'}</span>
                  </button>

                  {/* Status Dropdown / Cycle */}
                  <select
                    value={status}
                    onChange={(e) =>
                      updatePrayerStatus(prayer, e.target.value as PrayerStatus)
                    }
                    className="bg-[#122b22] border border-[#d4af37]/20 text-xs text-slate-200 rounded-xl px-2.5 py-2 font-medium focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="missed">Missed</option>
                  </select>

                  {/* Notes Button */}
                  <button
                    onClick={() => openNotesModal(prayer)}
                    className="p-2 rounded-xl bg-[#122b22] border border-[#d4af37]/20 text-slate-300 hover:text-white hover:border-[#d4af37]/50"
                    title="Add notes / Jamā'ah tag"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Qada (Missed Prayers Makeup Tracker) */}
      <div className="rounded-3xl bg-[#0f241d] border border-[#d4af37]/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[#d4af37]" />
              <span>Qadā' (Make-up) Counter</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Keep track of missed past prayers to fulfill at your convenience
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {prayersList.map((prayer) => {
            const count = qadaPrayers[prayer] || 0;
            return (
              <div
                key={prayer}
                className="p-3 rounded-2xl bg-[#142e24] border border-white/5 flex flex-col items-center justify-between"
              >
                <span className="text-xs font-semibold text-slate-300">{prayer}</span>
                <span className="text-2xl font-black text-[#f3c669] my-1 tabular-nums">
                  {count}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <button
                    onClick={() => adjustQadaPrayer(prayer, -1)}
                    disabled={count <= 0}
                    className="w-7 h-7 rounded-lg bg-[#0e211a] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Decreased made-up prayer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => adjustQadaPrayer(prayer, 1)}
                    className="w-7 h-7 rounded-lg bg-[#193d2f] border border-[#d4af37]/30 flex items-center justify-center text-[#f3c669] hover:bg-[#204e3c]"
                    title="Add missed prayer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes Modal */}
      {activeNotePrayer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e231c] border border-[#d4af37]/30 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#d4af37]/15 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#d4af37]" />
                <span>{activeNotePrayer} Prayer Details</span>
              </h3>
              <button
                onClick={() => setActiveNotePrayer(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-[#142e24] border border-[#d4af37]/15 cursor-pointer">
              <input
                type="checkbox"
                checked={isCongregation}
                onChange={(e) => setIsCongregation(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-[#091712] border-slate-600"
              />
              <span className="text-sm font-medium text-slate-200">
                Prayed in Congregation (Jamā‘ah)
              </span>
            </label>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Personal Reflections or Notes
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="e.g., Prayed in first row, recited Surah Al-Mulk, feeling grateful..."
                rows={3}
                className="w-full bg-[#091712] border border-[#d4af37]/20 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveNotePrayer(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveNotesModal}
                className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-slate-950 font-bold text-xs hover:bg-[#e5be4a] shadow-md"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
