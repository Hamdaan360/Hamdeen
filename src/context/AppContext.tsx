import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  ActiveTab,
  CalculationMethod,
  AsrJuristicMethod,
  DayPrayerLog,
  PrayerAlarmsMap,
  PrayerName,
  PrayerRecord,
  PrayerStatus,
  PrayerTimesResult,
  QuranBookmark,
  QuranReadingPlan,
  TasbeehSession,
  UserLocation,
  UserSettings,
} from '../types';
import { DEFAULT_LOCATION, POPULAR_CITIES } from '../data/citiesData';
import { calculatePrayerTimes, getNextPrayer, NextPrayerInfo } from '../utils/prayerCalculations';
import { getHijriDate, HijriDateInfo } from '../utils/hijriCalendar';
import { audioService } from '../utils/audioService';
import { NotificationService } from '../utils/notificationService';

const DEFAULT_ALARMS: PrayerAlarmsMap = {
  Fajr: { enabled: true, reminderMinutesBefore: 10, sound: 'adhan' },
  Sunrise: { enabled: false, reminderMinutesBefore: 0, sound: 'gentle' },
  Dhuhr: { enabled: true, reminderMinutesBefore: 10, sound: 'adhan' },
  Asr: { enabled: true, reminderMinutesBefore: 10, sound: 'adhan' },
  Maghrib: { enabled: true, reminderMinutesBefore: 10, sound: 'adhan' },
  Isha: { enabled: true, reminderMinutesBefore: 10, sound: 'adhan' },
};

const DEFAULT_SETTINGS: UserSettings = {
  userName: 'Hamdaan',
  location: DEFAULT_LOCATION,
  calculationMethod: 'MWL',
  asrJuristic: 'Standard',
  manualOffsets: { Fajr: 0, Sunrise: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0 },
  hijriAdjustment: 0,
  notificationsEnabled: false,
  soundEffects: true,
  theme: 'emerald',
  pinLock: { enabled: false, pinCode: '' },
};

const DEFAULT_QURAN_PLAN: QuranReadingPlan = {
  dailyMinutesGoal: 10,
  dailyPagesGoal: 4,
  dailyAyahsGoal: 20,
  preferredTime: 'After Fajr',
  reminderEnabled: true,
  reminderTime: '06:00',
  lastRead: {
    surahNumber: 1,
    surahName: 'الفَاتِحَة',
    surahEnglishName: 'Al-Fatihah',
    ayahNumber: 1,
    timestamp: new Date().toISOString(),
    notes: 'The Opening',
  },
  todayMinutesRead: 0,
  todayAyahsRead: 0,
};

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  now: Date;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  prayerTimes: PrayerTimesResult;
  nextPrayer: NextPrayerInfo;
  hijriDate: HijriDateInfo;
  alarms: PrayerAlarmsMap;
  updateAlarm: (prayer: PrayerName, config: Partial<PrayerAlarmsMap[PrayerName]>) => void;
  // Prayer Logs
  currentDateStr: string;
  selectedDateStr: string;
  setSelectedDateStr: (date: string) => void;
  currentDayLog: DayPrayerLog;
  updatePrayerStatus: (prayer: PrayerName, status: PrayerStatus, notes?: string, isCongregation?: boolean) => void;
  getPrayerLogForDate: (dateStr: string) => DayPrayerLog;
  allLogs: Record<string, DayPrayerLog>;
  // Quran
  quranPlan: QuranReadingPlan;
  updateQuranPlan: (plan: Partial<QuranReadingPlan>) => void;
  bookmarks: QuranBookmark[];
  addBookmark: (bookmark: Omit<QuranBookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (id: string) => void;
  logQuranReading: (minutes: number, ayahs: number) => void;
  // Tasbeeh
  tasbeehCount: number;
  tasbeehTarget: number;
  tasbeehLifetimeTotal: number;
  currentDhikrId: string;
  incrementTasbeeh: () => void;
  resetTasbeeh: () => void;
  setTasbeehDhikr: (id: string, target: number) => void;
  tasbeehHistory: TasbeehSession[];
  // Favorites & Duas
  favoriteDuaIds: string[];
  toggleFavoriteDua: (id: string) => void;
  // Qada tracker
  qadaPrayers: Record<PrayerName, number>;
  adjustQadaPrayer: (prayer: PrayerName, delta: number) => void;
  // PIN Lock & Navigation
  isLocked: boolean;
  unlockApp: (pin: string) => boolean;
  lockApp: () => void;
  // Location & GPS
  detectGpsLocation: () => Promise<boolean>;
  isGpsLoading: boolean;
  gpsError: string | null;
  // User Data Reset
  resetUserDataToZero: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const val = localStorage.getItem(key);
    if (val) return JSON.parse(val);
  } catch {
    // fallback
  }
  return defaultValue;
}

function setStored<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [now, setNow] = useState<Date>(new Date());
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Settings
  const [settings, setSettings] = useState<UserSettings>(() => getStored('hamdeen_settings', DEFAULT_SETTINGS));

  // Alarms
  const [alarms, setAlarms] = useState<PrayerAlarmsMap>(() => getStored('hamdeen_alarms', DEFAULT_ALARMS));

  // Prayer logs
  const [allLogs, setAllLogs] = useState<Record<string, DayPrayerLog>>(() => getStored('hamdeen_prayer_logs', {}));

  // One-time cleanup for old mock stats in localStorage
  useEffect(() => {
    try {
      const version = localStorage.getItem('hamdeen_data_clean_zero_v1');
      if (!version) {
        localStorage.removeItem('hamdeen_prayer_logs');
        localStorage.removeItem('hamdeen_bookmarks');
        localStorage.setItem('hamdeen_tasbeeh_count', '0');
        localStorage.setItem('hamdeen_tasbeeh_total', '0');
        localStorage.removeItem('hamdeen_favorite_duas');
        localStorage.setItem('hamdeen_quran_plan', JSON.stringify(DEFAULT_QURAN_PLAN));
        localStorage.setItem('hamdeen_data_clean_zero_v1', 'true');
        // Update states to 0
        setAllLogs({});
        setBookmarks([]);
        setTasbeehCount(0);
        setTasbeehLifetimeTotal(0);
        setFavoriteDuaIds([]);
        setQuranPlan(DEFAULT_QURAN_PLAN);
      }
    } catch {
      // ignore
    }
  }, []);

  // Selected date for viewing/editing history
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  // Quran - starts at 0
  const [quranPlan, setQuranPlan] = useState<QuranReadingPlan>(() => getStored('hamdeen_quran_plan', DEFAULT_QURAN_PLAN));
  const [bookmarks, setBookmarks] = useState<QuranBookmark[]>(() =>
    getStored('hamdeen_bookmarks', [])
  );

  // Tasbeeh - starts at 0
  const [tasbeehCount, setTasbeehCount] = useState<number>(() => getStored('hamdeen_tasbeeh_count', 0));
  const [tasbeehTarget, setTasbeehTarget] = useState<number>(() => getStored('hamdeen_tasbeeh_target', 33));
  const [tasbeehLifetimeTotal, setTasbeehLifetimeTotal] = useState<number>(() => getStored('hamdeen_tasbeeh_total', 0));
  const [currentDhikrId, setCurrentDhikrId] = useState<string>(() => getStored('hamdeen_tasbeeh_dhikr', 'subhanallah'));
  const [tasbeehHistory, setTasbeehHistory] = useState<TasbeehSession[]>(() => getStored('hamdeen_tasbeeh_history', []));

  // Duas Favorites - starts empty
  const [favoriteDuaIds, setFavoriteDuaIds] = useState<string[]>(() => getStored('hamdeen_favorite_duas', []));

  // Qada Prayers - starts at 0
  const [qadaPrayers, setQadaPrayers] = useState<Record<PrayerName, number>>(() =>
    getStored('hamdeen_qada_prayers', { Fajr: 0, Sunrise: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0 })
  );

  // App Lock
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return !!settings.pinLock?.enabled && !!settings.pinLock.pinCode;
  });

  // Sound sync
  useEffect(() => {
    audioService.setMuted(!settings.soundEffects);
  }, [settings.soundEffects]);

  // Periodic second tick for live countdowns & alarms
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update Settings
  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      setStored('hamdeen_settings', updated);
      return updated;
    });
  }, []);

  // Update Alarms
  const updateAlarm = useCallback((prayer: PrayerName, config: Partial<PrayerAlarmsMap[PrayerName]>) => {
    setAlarms((prev) => {
      const updated = {
        ...prev,
        [prayer]: { ...prev[prayer], ...config },
      };
      setStored('hamdeen_alarms', updated);
      return updated;
    });
  }, []);

  // Calculate prayer times for selected date
  const prayerTimes = useMemo(() => {
    const d = new Date(selectedDateStr + 'T12:00:00');
    return calculatePrayerTimes(
      d,
      settings.location.latitude,
      settings.location.longitude,
      settings.calculationMethod,
      settings.asrJuristic,
      settings.manualOffsets
    );
  }, [
    selectedDateStr,
    settings.location.latitude,
    settings.location.longitude,
    settings.calculationMethod,
    settings.asrJuristic,
    settings.manualOffsets,
  ]);

  // Next prayer
  const nextPrayer = useMemo(() => {
    return getNextPrayer(prayerTimes, now);
  }, [prayerTimes, now]);

  // Hijri date
  const hijriDate = useMemo(() => {
    const d = new Date(selectedDateStr + 'T12:00:00');
    return getHijriDate(d, settings.hijriAdjustment);
  }, [selectedDateStr, settings.hijriAdjustment]);

  // Retrieve or create day prayer log
  const getPrayerLogForDate = useCallback(
    (dateStr: string): DayPrayerLog => {
      if (allLogs[dateStr]) {
        return allLogs[dateStr];
      }
      return {
        date: dateStr,
        prayers: {
          Fajr: { status: 'pending' },
          Sunrise: { status: 'pending' },
          Dhuhr: { status: 'pending' },
          Asr: { status: 'pending' },
          Maghrib: { status: 'pending' },
          Isha: { status: 'pending' },
        },
      };
    },
    [allLogs]
  );

  const currentDayLog = useMemo(() => {
    return getPrayerLogForDate(selectedDateStr);
  }, [getPrayerLogForDate, selectedDateStr]);

  // Update status of a prayer
  const updatePrayerStatus = useCallback(
    (prayer: PrayerName, status: PrayerStatus, notes?: string, isCongregation?: boolean) => {
      setAllLogs((prev) => {
        const existingDay = prev[selectedDateStr] || {
          date: selectedDateStr,
          prayers: {
            Fajr: { status: 'pending' },
            Sunrise: { status: 'pending' },
            Dhuhr: { status: 'pending' },
            Asr: { status: 'pending' },
            Maghrib: { status: 'pending' },
            Isha: { status: 'pending' },
          },
        };

        const existingRecord = existingDay.prayers[prayer] || { status: 'pending' };
        const updatedRecord: PrayerRecord = {
          ...existingRecord,
          status,
          completedAt: status === 'completed' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
          notes: notes !== undefined ? notes : existingRecord.notes,
          isCongregation: isCongregation !== undefined ? isCongregation : existingRecord.isCongregation,
        };

        const updatedDay: DayPrayerLog = {
          ...existingDay,
          prayers: {
            ...existingDay.prayers,
            [prayer]: updatedRecord,
          },
        };

        const updatedLogs = {
          ...prev,
          [selectedDateStr]: updatedDay,
        };

        setStored('hamdeen_prayer_logs', updatedLogs);

        // Play subtle success chime on completion
        if (status === 'completed') {
          audioService.playSuccess();
        }

        return updatedLogs;
      });
    },
    [selectedDateStr]
  );

  // Quran plan actions
  const updateQuranPlan = useCallback((plan: Partial<QuranReadingPlan>) => {
    setQuranPlan((prev) => {
      const updated = { ...prev, ...plan };
      setStored('hamdeen_quran_plan', updated);
      return updated;
    });
  }, []);

  const logQuranReading = useCallback((minutes: number, ayahs: number) => {
    setQuranPlan((prev) => {
      const updated: QuranReadingPlan = {
        ...prev,
        todayMinutesRead: prev.todayMinutesRead + minutes,
        todayAyahsRead: prev.todayAyahsRead + ayahs,
      };
      setStored('hamdeen_quran_plan', updated);
      audioService.playSuccess();
      return updated;
    });
  }, []);

  const addBookmark = useCallback((bm: Omit<QuranBookmark, 'id' | 'createdAt'>) => {
    setBookmarks((prev) => {
      const newBm: QuranBookmark = {
        ...bm,
        id: 'bm-' + Date.now(),
        createdAt: new Date().toISOString(),
      };
      const updated = [newBm, ...prev];
      setStored('hamdeen_bookmarks', updated);
      audioService.playSuccess();
      return updated;
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      setStored('hamdeen_bookmarks', updated);
      return updated;
    });
  }, []);

  // Tasbeeh actions
  const incrementTasbeeh = useCallback(() => {
    setTasbeehCount((prev) => {
      const next = prev + 1;
      setStored('hamdeen_tasbeeh_count', next);

      // Play click sound & haptic
      audioService.playTasbeehClick();
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(20);
        } catch {
          // ignore
        }
      }

      // If reached target, trigger celebration sound
      if (next === tasbeehTarget) {
        audioService.playSuccess();
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate([40, 60, 80]);
          } catch {
            // ignore
          }
        }
      }

      return next;
    });

    setTasbeehLifetimeTotal((prev) => {
      const next = prev + 1;
      setStored('hamdeen_tasbeeh_total', next);
      return next;
    });
  }, [tasbeehTarget]);

  const resetTasbeeh = useCallback(() => {
    setTasbeehCount(0);
    setStored('hamdeen_tasbeeh_count', 0);
  }, []);

  const setTasbeehDhikr = useCallback(
    (id: string, target: number) => {
      setCurrentDhikrId(id);
      setTasbeehTarget(target);
      setTasbeehCount(0);
      setStored('hamdeen_tasbeeh_dhikr', id);
      setStored('hamdeen_tasbeeh_target', target);
      setStored('hamdeen_tasbeeh_count', 0);
    },
    []
  );

  // Duas Favorites
  const toggleFavoriteDua = useCallback((id: string) => {
    setFavoriteDuaIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      setStored('hamdeen_favorite_duas', updated);
      return updated;
    });
  }, []);

  // Qada
  const adjustQadaPrayer = useCallback((prayer: PrayerName, delta: number) => {
    setQadaPrayers((prev) => {
      const current = prev[prayer] || 0;
      const updated = {
        ...prev,
        [prayer]: Math.max(0, current + delta),
      };
      setStored('hamdeen_qada_prayers', updated);
      return updated;
    });
  }, []);

  // PIN App Lock
  const unlockApp = useCallback(
    (pin: string): boolean => {
      if (pin === settings.pinLock.pinCode) {
        setIsLocked(false);
        return true;
      }
      return false;
    },
    [settings.pinLock.pinCode]
  );

  const lockApp = useCallback(() => {
    if (settings.pinLock.enabled && settings.pinLock.pinCode) {
      setIsLocked(true);
    }
  }, [settings.pinLock]);

  // Real GPS Geolocation detection
  const detectGpsLocation = useCallback(async (): Promise<boolean> => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return false;
    }

    setIsGpsLoading(true);
    setGpsError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = Math.round(position.coords.latitude * 10000) / 10000;
          const lng = Math.round(position.coords.longitude * 10000) / 10000;

          // Find closest known city or use GPS coordinates label
          const newLoc: UserLocation = {
            city: `GPS Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
            country: 'Detected Device Location',
            latitude: lat,
            longitude: lng,
            isAutoGps: true,
          };

          updateSettings({ location: newLoc });
          setIsGpsLoading(false);
          resolve(true);
        },
        (error) => {
          let msg = 'Unable to retrieve location.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location permission was denied. You can select a city manually.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = 'Location position unavailable. Please choose your city.';
          } else if (error.code === error.TIMEOUT) {
            msg = 'Location request timed out.';
          }
          setGpsError(msg);
          setIsGpsLoading(false);
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
      );
    });
  }, [updateSettings]);

  const resetUserDataToZero = useCallback(() => {
    localStorage.removeItem('hamdeen_prayer_logs');
    localStorage.removeItem('hamdeen_bookmarks');
    localStorage.setItem('hamdeen_tasbeeh_count', '0');
    localStorage.setItem('hamdeen_tasbeeh_total', '0');
    localStorage.removeItem('hamdeen_favorite_duas');
    localStorage.removeItem('hamdeen_tasbeeh_history');
    localStorage.removeItem('hamdeen_qada_prayers');
    localStorage.setItem('hamdeen_quran_plan', JSON.stringify(DEFAULT_QURAN_PLAN));
    localStorage.setItem('hamdeen_data_clean_zero_v1', 'true');

    setAllLogs({});
    setBookmarks([]);
    setTasbeehCount(0);
    setTasbeehLifetimeTotal(0);
    setTasbeehHistory([]);
    setFavoriteDuaIds([]);
    setQadaPrayers({ Fajr: 0, Sunrise: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0 });
    setQuranPlan(DEFAULT_QURAN_PLAN);
  }, []);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      now,
      settings,
      updateSettings,
      prayerTimes,
      nextPrayer,
      hijriDate,
      alarms,
      updateAlarm,
      currentDateStr: todayStr,
      selectedDateStr,
      setSelectedDateStr,
      currentDayLog,
      updatePrayerStatus,
      getPrayerLogForDate,
      allLogs,
      quranPlan,
      updateQuranPlan,
      bookmarks,
      addBookmark,
      removeBookmark,
      logQuranReading,
      tasbeehCount,
      tasbeehTarget,
      tasbeehLifetimeTotal,
      currentDhikrId,
      incrementTasbeeh,
      resetTasbeeh,
      setTasbeehDhikr,
      tasbeehHistory,
      favoriteDuaIds,
      toggleFavoriteDua,
      qadaPrayers,
      adjustQadaPrayer,
      isLocked,
      unlockApp,
      lockApp,
      detectGpsLocation,
      isGpsLoading,
      gpsError,
      resetUserDataToZero,
    }),
    [
      activeTab,
      now,
      settings,
      updateSettings,
      prayerTimes,
      nextPrayer,
      hijriDate,
      alarms,
      updateAlarm,
      todayStr,
      selectedDateStr,
      currentDayLog,
      updatePrayerStatus,
      getPrayerLogForDate,
      allLogs,
      quranPlan,
      updateQuranPlan,
      bookmarks,
      addBookmark,
      removeBookmark,
      logQuranReading,
      tasbeehCount,
      tasbeehTarget,
      tasbeehLifetimeTotal,
      currentDhikrId,
      incrementTasbeeh,
      resetTasbeeh,
      setTasbeehDhikr,
      tasbeehHistory,
      favoriteDuaIds,
      toggleFavoriteDua,
      qadaPrayers,
      adjustQadaPrayer,
      isLocked,
      unlockApp,
      lockApp,
      detectGpsLocation,
      isGpsLoading,
      gpsError,
      resetUserDataToZero,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
