export type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export type PrayerStatus = 'completed' | 'in_progress' | 'pending' | 'missed';

export interface PrayerRecord {
  status: PrayerStatus;
  completedAt?: string;
  notes?: string;
  isCongregation?: boolean;
}

export interface DayPrayerLog {
  date: string; // YYYY-MM-DD
  prayers: Record<PrayerName, PrayerRecord>;
}

export type CalculationMethod = 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi';
export type AsrJuristicMethod = 'Standard' | 'Hanafi';

export interface PrayerTimesResult {
  Fajr: string; // HH:mm (24h)
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  dateStr: string;
  isAutoCalculated: boolean;
  methodName: string;
}

export interface PrayerAlarmConfig {
  enabled: boolean;
  customTime?: string; // Optional manual override time HH:mm
  reminderMinutesBefore: number; // 0 (at time), 5, 10, 15, 30
  sound: 'adhan' | 'chime' | 'gentle' | 'none';
}

export type PrayerAlarmsMap = Record<PrayerName, PrayerAlarmConfig>;

export interface QuranReadingPlan {
  dailyMinutesGoal: number;
  dailyPagesGoal: number;
  dailyAyahsGoal: number;
  preferredTime: string; // e.g. "After Fajr", "After Maghrib", "Before Sleep"
  reminderEnabled: boolean;
  reminderTime: string; // HH:mm
  lastRead: {
    surahNumber: number;
    surahName: string;
    surahEnglishName: string;
    ayahNumber: number;
    timestamp: string;
    notes?: string;
  };
  todayMinutesRead: number;
  todayAyahsRead: number;
}

export interface QuranBookmark {
  id: string;
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  ayahNumber: number;
  textArabic: string;
  translation: string;
  createdAt: string;
  note?: string;
}

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface AyahItem {
  numberInSurah: number;
  arabic: string;
  transliteration?: string;
  translation: string;
}

export interface TasbeehDhikr {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  defaultTarget: number;
}

export interface TasbeehSession {
  id: string;
  dhikrId: string;
  dhikrText: string;
  count: number;
  target: number;
  date: string;
}

export interface DuaItem {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  category: 'daily' | 'morning_evening' | 'protection' | 'forgiveness' | 'hardship' | 'guidance';
  benefits?: string;
}

export interface IslamicEvent {
  id: string;
  title: string;
  arabicTitle: string;
  hijriDay: number;
  hijriMonth: number;
  hijriMonthName: string;
  description: string;
  isHoliday?: boolean;
}

export interface UserLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  isAutoGps: boolean;
  timezone?: string;
}

export interface UserSettings {
  userName: string;
  location: UserLocation;
  calculationMethod: CalculationMethod;
  asrJuristic: AsrJuristicMethod;
  manualOffsets: Record<PrayerName, number>; // in minutes
  hijriAdjustment: number; // -2, -1, 0, 1, 2
  notificationsEnabled: boolean;
  soundEffects: boolean;
  theme: 'emerald' | 'navy' | 'obsidian';
  pinLock: {
    enabled: boolean;
    pinCode: string;
  };
}

export type ActiveTab =
  | 'home'
  | 'namaz'
  | 'alarms'
  | 'quran'
  | 'tasbeeh'
  | 'dua'
  | 'calendar'
  | 'qibla'
  | 'reports'
  | 'settings';
