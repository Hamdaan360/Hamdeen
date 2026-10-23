import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CalculationMethod, AsrJuristicMethod, PrayerName } from '../types';
import { METHOD_LABELS } from '../utils/prayerCalculations';
import {
  Settings,
  MapPin,
  Clock,
  Bell,
  Volume2,
  Lock,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  Moon,
  Shield,
  HelpCircle,
} from 'lucide-react';

export const SettingsView: React.FC<{ onOpenLocationModal: () => void }> = ({
  onOpenLocationModal,
}) => {
  const {
    settings,
    updateSettings,
    prayerTimes,
    detectGpsLocation,
    isGpsLoading,
    lockApp,
    resetUserDataToZero,
  } = useApp();

  const [pinInput, setPinInput] = useState<string>(settings.pinLock?.pinCode || '');
  const [saveBanner, setSaveBanner] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const prayers: PrayerName[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  const handleOffsetChange = (prayer: PrayerName, delta: number) => {
    const current = settings.manualOffsets[prayer] || 0;
    updateSettings({
      manualOffsets: {
        ...settings.manualOffsets,
        [prayer]: current + delta,
      },
    });
  };

  const handleSavePin = () => {
    if (pinInput.length === 4 && /^\d+$/.test(pinInput)) {
      updateSettings({
        pinLock: {
          enabled: true,
          pinCode: pinInput,
        },
      });
      setSaveBanner('4-digit PIN lock enabled!');
      setTimeout(() => setSaveBanner(null), 3000);
    } else {
      alert('Please enter a valid 4-digit numeric PIN');
    }
  };

  const handleDisablePin = () => {
    updateSettings({
      pinLock: {
        enabled: false,
        pinCode: '',
      },
    });
    setPinInput('');
    setSaveBanner('PIN Lock disabled.');
    setTimeout(() => setSaveBanner(null), 3000);
  };

  const handleExportData = () => {
    const backup = {
      settings: localStorage.getItem('hamdeen_settings'),
      logs: localStorage.getItem('hamdeen_prayer_logs'),
      alarms: localStorage.getItem('hamdeen_alarms'),
      quranPlan: localStorage.getItem('hamdeen_quran_plan'),
      bookmarks: localStorage.getItem('hamdeen_bookmarks'),
      tasbeehCount: localStorage.getItem('hamdeen_tasbeeh_count'),
      tasbeehTotal: localStorage.getItem('hamdeen_tasbeeh_total'),
      favoriteDuas: localStorage.getItem('hamdeen_favorite_duas'),
      qada: localStorage.getItem('hamdeen_qada_prayers'),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hamdeen_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.settings) localStorage.setItem('hamdeen_settings', data.settings);
        if (data.logs) localStorage.setItem('hamdeen_prayer_logs', data.logs);
        if (data.alarms) localStorage.setItem('hamdeen_alarms', data.alarms);
        if (data.quranPlan) localStorage.setItem('hamdeen_quran_plan', data.quranPlan);
        if (data.bookmarks) localStorage.setItem('hamdeen_bookmarks', data.bookmarks);
        window.location.reload();
      } catch {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">App Settings</h2>
        <p className="text-xs text-slate-400">
          Customize calculation conventions, manual offsets, notifications, and security
        </p>
      </div>

      {saveBanner && (
        <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveBanner}</span>
        </div>
      )}

      {/* User Profile Name */}
      <div className="rounded-3xl bg-[#0e221b] border border-[#d4af37]/20 p-5 space-y-3">
        <h4 className="text-sm font-bold text-white">Personalization</h4>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Your Name</label>
          <input
            type="text"
            value={settings.userName}
            onChange={(e) => updateSettings({ userName: e.target.value })}
            placeholder="Hamdaan"
            className="w-full sm:w-80 bg-[#081510] border border-[#d4af37]/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
          />
        </div>
      </div>

      {/* Prayer Calculation Conventions */}
      <div className="rounded-3xl bg-[#0e221b] border border-[#d4af37]/20 p-5 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#d4af37]" />
          <span>Prayer Calculation Method</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Calculation Authority</label>
            <select
              value={settings.calculationMethod}
              onChange={(e) =>
                updateSettings({ calculationMethod: e.target.value as CalculationMethod })
              }
              className="w-full bg-[#081510] border border-[#d4af37]/25 rounded-xl p-2.5 text-xs text-white"
            >
              {(Object.keys(METHOD_LABELS) as CalculationMethod[]).map((key) => (
                <option key={key} value={key}>
                  {METHOD_LABELS[key]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Asr Juristic Method</label>
            <select
              value={settings.asrJuristic}
              onChange={(e) =>
                updateSettings({ asrJuristic: e.target.value as AsrJuristicMethod })
              }
              className="w-full bg-[#081510] border border-[#d4af37]/25 rounded-xl p-2.5 text-xs text-white"
            >
              <option value="Standard">Standard (Shafi'i, Maliki, Hanbali)</option>
              <option value="Hanafi">Hanafi (Shadow factor 2x)</option>
            </select>
          </div>
        </div>

        {/* Location selector */}
        <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-slate-300 block">Current Location</span>
            <span className="text-xs text-[#f3c669]">
              {settings.location.city}, {settings.location.country} ({settings.location.latitude}°,{' '}
              {settings.location.longitude}°)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => detectGpsLocation()}
              disabled={isGpsLoading}
              className="px-3 py-1.5 rounded-xl bg-[#132d22] border border-[#d4af37]/30 text-[#f3c669] text-xs font-bold hover:bg-[#18392b]"
            >
              {isGpsLoading ? 'Detecting GPS...' : 'GPS Auto-Detect'}
            </button>
            <button
              onClick={onOpenLocationModal}
              className="px-3 py-1.5 rounded-xl bg-[#d4af37] text-slate-950 text-xs font-bold hover:bg-[#e2bb46]"
            >
              Change City
            </button>
          </div>
        </div>
      </div>

      {/* Manual Prayer Time Offsets */}
      <div className="rounded-3xl bg-[#0e221b] border border-[#d4af37]/20 p-5 space-y-3">
        <div>
          <h4 className="text-sm font-bold text-white">Manual Prayer Time Fine-Tuning</h4>
          <p className="text-xs text-slate-400">
            Adjust calculated times by minutes to match your local mosque's timetable
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {prayers.map((prayer) => {
            const offset = settings.manualOffsets[prayer] || 0;
            return (
              <div
                key={prayer}
                className="p-3 rounded-2xl bg-[#091712] border border-white/5 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-white block">{prayer}</span>
                  <span className="text-[11px] text-slate-400 tabular-nums">
                    {prayerTimes[prayer]}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOffsetChange(prayer, -1)}
                    className="w-6 h-6 rounded bg-[#132c22] text-slate-300 font-bold text-xs hover:text-white"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-[#f3c669] w-6 text-center tabular-nums">
                    {offset > 0 ? `+${offset}` : offset}
                  </span>
                  <button
                    onClick={() => handleOffsetChange(prayer, 1)}
                    className="w-6 h-6 rounded bg-[#132c22] text-slate-300 font-bold text-xs hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hijri Calendar Moon Sighting Adjustment */}
      <div className="rounded-3xl bg-[#0e221b] border border-[#d4af37]/20 p-5 space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Moon className="w-4 h-4 text-[#d4af37]" />
          <span>Hijri Moon-Sighting Offset</span>
        </h4>
        <p className="text-xs text-slate-400">
          Adjust by 1 or 2 days according to your local regional moon-sighting announcement
        </p>
        <div className="flex items-center gap-2 pt-1">
          {[-2, -1, 0, 1, 2].map((adj) => (
            <button
              key={adj}
              onClick={() => updateSettings({ hijriAdjustment: adj })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                settings.hijriAdjustment === adj
                  ? 'bg-[#d4af37] text-slate-950 shadow-md'
                  : 'bg-[#122920] text-slate-300 hover:text-white'
              }`}
            >
              {adj === 0 ? 'Exact Astronomical' : adj > 0 ? `+${adj} Day` : `${adj} Day`}
            </button>
          ))}
        </div>
      </div>

      {/* App Lock PIN Protection */}
      <div className="rounded-3xl bg-[#0e221b] border border-[#d4af37]/20 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#d4af37]" />
            <h4 className="text-sm font-bold text-white">App Lock PIN Security</h4>
          </div>
          {settings.pinLock?.enabled && (
            <button
              onClick={lockApp}
              className="text-xs text-[#f3c669] font-semibold hover:underline"
            >
              Lock Now
            </button>
          )}
        </div>

        <p className="text-xs text-slate-400">
          Protect your personal prayer reflections and spiritual journal with a 4-digit PIN code keypad
        </p>

        {settings.pinLock?.enabled ? (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>PIN Lock is active</span>
            </div>
            <button
              onClick={handleDisablePin}
              className="px-3 py-1 rounded-xl bg-rose-950 border border-rose-500/30 text-rose-300 hover:bg-rose-900 font-semibold"
            >
              Disable PIN
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="password"
              maxLength={4}
              placeholder="Set 4-digit PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
              className="w-44 bg-[#081510] border border-[#d4af37]/25 rounded-xl px-3 py-2 text-sm text-center text-white tracking-widest focus:outline-none focus:border-[#d4af37]"
            />
            <button
              onClick={handleSavePin}
              className="px-4 py-2 rounded-xl bg-[#d4af37] text-slate-950 font-bold text-xs hover:bg-[#e2bb46] self-start sm:self-auto shadow-md"
            >
              Enable PIN Lock
            </button>
          </div>
        )}
      </div>

      {/* Data Backup & Privacy */}
      <div className="rounded-3xl bg-[#0e221b] border border-[#d4af37]/20 p-5 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#d4af37]" />
          <span>Data Storage & Privacy</span>
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          Hamdeen stores all your logs, bookmarks, and preferences locally inside your browser's private localStorage. No personal logs are ever transmitted to third-party ad networks.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleExportData}
            className="px-3.5 py-2 rounded-xl bg-[#132c22] border border-[#d4af37]/30 text-[#f3c669] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#183a2d]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup JSON</span>
          </button>

          <label className="px-3.5 py-2 rounded-xl bg-[#132c22] border border-[#d4af37]/30 text-[#f3c669] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#183a2d] cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Import Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              resetUserDataToZero();
              setSaveBanner('All prayer logs, streaks, and Quran progress reset to 0!');
              setTimeout(() => setSaveBanner(null), 3500);
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-900/60"
            title="Reset prayer history, streaks, and progress to 0"
          >
            <span>Reset Stats to 0</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-900/60 ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Everything</span>
          </button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0e221b] border border-rose-500/40 rounded-3xl p-6 w-full max-w-sm space-y-4 text-center">
            <Trash2 className="w-8 h-8 text-rose-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Reset All Application Data?</h4>
            <p className="text-xs text-slate-400">
              This will clear your local prayer history, bookmarks, and settings. This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllData}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 shadow-md"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
