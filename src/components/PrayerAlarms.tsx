import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PrayerName } from '../types';
import { formatTime12 } from '../utils/prayerCalculations';
import { audioService } from '../utils/audioService';
import { NotificationService } from '../utils/notificationService';
import {
  Bell,
  Volume2,
  Clock,
  ShieldAlert,
  Play,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sliders,
} from 'lucide-react';

export const PrayerAlarms: React.FC = () => {
  const { alarms, updateAlarm, prayerTimes } = useApp();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() =>
    NotificationService.getPermission()
  );
  const [isTestingSound, setIsTestingSound] = useState<boolean>(false);
  const [editingPrayer, setEditingPrayer] = useState<PrayerName | null>(null);
  const [saveBanner, setSaveBanner] = useState<boolean>(false);

  const prayersList: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  const handleRequestPermission = async () => {
    const res = await NotificationService.requestPermission();
    setNotificationPermission(res);
  };

  const handleTestSound = (soundType: 'adhan' | 'chime') => {
    setIsTestingSound(true);
    if (soundType === 'adhan') {
      audioService.playAdhan();
    } else {
      audioService.playChime();
    }
    setTimeout(() => setIsTestingSound(false), 3000);
  };

  const handleTriggerTestNotification = () => {
    NotificationService.testAlarm();
  };

  const handleSaveAlarms = () => {
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Prayer Alarms</h2>
          <p className="text-xs text-slate-400">Configure Adhan alerts and reminders before prayer times</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTestSound('adhan')}
            disabled={isTestingSound}
            className="px-3.5 py-2 rounded-xl bg-[#143126] border border-[#d4af37]/30 text-xs font-semibold text-[#f3c669] hover:bg-[#1a3d30] flex items-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isTestingSound ? 'Playing Azan...' : 'Test Azan'}</span>
          </button>
        </div>
      </div>

      {/* Browser Notification Permission Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#122c22] to-[#0e2119] border border-[#d4af37]/25 p-5 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-[#183a2d] text-[#d4af37] border border-[#d4af37]/20 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Browser Notifications</h4>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    notificationPermission === 'granted'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : notificationPermission === 'denied'
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {notificationPermission === 'granted'
                    ? 'Active'
                    : notificationPermission === 'denied'
                    ? 'Blocked'
                    : 'Permission Needed'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Allow desktop and mobile browser notifications so Hamdeen can notify you when it's time for prayer or Quran reading.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {notificationPermission !== 'granted' ? (
              <button
                onClick={handleRequestPermission}
                className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e2bb46] text-slate-950 font-bold text-xs shadow-md transition-colors"
              >
                Enable Notifications
              </button>
            ) : (
              <button
                onClick={handleTriggerTestNotification}
                className="px-3.5 py-2 rounded-xl bg-[#16382b] border border-[#d4af37]/30 text-xs font-semibold text-slate-200 hover:text-white"
              >
                Send Test Alert
              </button>
            )}
          </div>
        </div>

        {/* Realistic Technical Notice */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-start gap-2 text-[11px] text-slate-400">
          <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
          <p>
            <strong>Platform Note:</strong> Web browser alarms and audio play automatically while the browser or tab remains running in the background. If your phone or computer is fully powered off or deep-sleeping, standard web security limits background timers until re-opened.
          </p>
        </div>
      </div>

      {saveBanner && (
        <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Alarm preferences saved to local storage!</span>
        </div>
      )}

      {/* Alarms List */}
      <div className="space-y-3">
        {prayersList.map((prayer) => {
          const alarm = alarms[prayer];
          const time = prayerTimes[prayer];
          const displayTime = alarm.customTime || time;

          return (
            <div
              key={prayer}
              className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                alarm.enabled
                  ? 'bg-[#0f251d] border-[#d4af37]/30 shadow-sm'
                  : 'bg-[#0a1813]/60 border-white/5 opacity-70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Info */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base transition-colors ${
                      alarm.enabled
                        ? 'bg-[#183f30] text-[#f3c669] border border-[#d4af37]/40'
                        : 'bg-[#102019] text-slate-500 border border-white/5'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">{prayer}</h4>
                      <span className="text-xs text-slate-400 font-medium">Daily</span>
                      {alarm.customTime && (
                        <span className="text-[10px] text-[#f3c669] bg-[#173a2d] px-1.5 py-0.5 rounded">
                          Custom Time
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <span className="text-[#f3c669] font-bold tabular-nums">
                        {formatTime12(displayTime)}
                      </span>
                      <span>·</span>
                      <span>
                        {alarm.reminderMinutesBefore === 0
                          ? 'At exact prayer time'
                          : `${alarm.reminderMinutesBefore} min before`}
                      </span>
                      <span>·</span>
                      <span className="capitalize">{alarm.sound} sound</span>
                    </div>
                  </div>
                </div>

                {/* Right: Controls */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    onClick={() => setEditingPrayer(prayer)}
                    className="p-2 rounded-xl bg-[#142e23] border border-[#d4af37]/20 text-slate-300 hover:text-white hover:border-[#d4af37]/40 text-xs flex items-center gap-1.5"
                    title="Edit alarm settings"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span className="hidden sm:inline">Configure</span>
                  </button>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alarm.enabled}
                      onChange={(e) => updateAlarm(prayer, { enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-[#122820] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]" />
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Save Button */}
      <div className="pt-2">
        <button
          onClick={handleSaveAlarms}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#e6be48] text-slate-950 font-bold text-sm shadow-lg hover:brightness-105 active:scale-[0.99] transition-all"
        >
          Save Alarm Settings
        </button>
      </div>

      {/* Configure Modal */}
      {editingPrayer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e231c] border border-[#d4af37]/30 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#d4af37]/15 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#d4af37]" />
                <span>Configure {editingPrayer} Alarm</span>
              </h3>
              <button
                onClick={() => setEditingPrayer(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Reminder before dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Reminder Timing
                </label>
                <select
                  value={alarms[editingPrayer].reminderMinutesBefore}
                  onChange={(e) =>
                    updateAlarm(editingPrayer, {
                      reminderMinutesBefore: Number(e.target.value),
                    })
                  }
                  className="w-full bg-[#081510] border border-[#d4af37]/25 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value={0}>At exact prayer time</option>
                  <option value={5}>5 minutes before</option>
                  <option value={10}>10 minutes before</option>
                  <option value={15}>15 minutes before</option>
                  <option value={30}>30 minutes before</option>
                </select>
              </div>

              {/* Sound selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Alarm Sound Tone
                </label>
                <select
                  value={alarms[editingPrayer].sound}
                  onChange={(e) =>
                    updateAlarm(editingPrayer, {
                      sound: e.target.value as 'adhan' | 'chime' | 'gentle' | 'none',
                    })
                  }
                  className="w-full bg-[#081510] border border-[#d4af37]/25 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="adhan">Harmonic Azan (Traditional)</option>
                  <option value="chime">Serene Chime</option>
                  <option value="gentle">Gentle Tone</option>
                  <option value="none">Vibrate / Silent Notification Only</option>
                </select>
              </div>

              {/* Custom time override */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-400">
                    Custom Alarm Time (Optional Override)
                  </label>
                  {alarms[editingPrayer].customTime && (
                    <button
                      onClick={() => updateAlarm(editingPrayer, { customTime: undefined })}
                      className="text-[11px] text-rose-400 hover:underline"
                    >
                      Reset to calculated ({prayerTimes[editingPrayer]})
                    </button>
                  )}
                </div>
                <input
                  type="time"
                  value={alarms[editingPrayer].customTime || prayerTimes[editingPrayer]}
                  onChange={(e) => updateAlarm(editingPrayer, { customTime: e.target.value })}
                  className="w-full bg-[#081510] border border-[#d4af37]/25 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3">
              <button
                onClick={() =>
                  handleTestSound(alarms[editingPrayer].sound === 'chime' ? 'chime' : 'adhan')
                }
                className="text-xs text-[#f3c669] hover:underline flex items-center gap-1 font-medium"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Test Sound</span>
              </button>

              <button
                onClick={() => setEditingPrayer(null)}
                className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-slate-950 font-bold text-xs hover:bg-[#e5be4a]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
