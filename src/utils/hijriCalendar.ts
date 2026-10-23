import { IslamicEvent } from '../types';

export const HIJRI_MONTHS = [
  { number: 1, name: 'Muharram', arabic: 'مُحَرَّم' },
  { number: 2, name: 'Safar', arabic: 'صَفَر' },
  { number: 3, name: "Rabi' al-Awwal", arabic: 'رَبِيع الأَوَّل' },
  { number: 4, name: "Rabi' al-Thani", arabic: 'رَبِيع الآخِر' },
  { number: 5, name: 'Jumada al-Ula', arabic: 'جُمَادَى الأُولَى' },
  { number: 6, name: 'Jumada al-Akhirah', arabic: 'جُمَادَى الآخِرَة' },
  { number: 7, name: 'Rajab', arabic: 'رَجَب' },
  { number: 8, name: "Sha'ban", arabic: 'شَعْبَان' },
  { number: 9, name: 'Ramadan', arabic: 'رَمَضَان' },
  { number: 10, name: 'Shawwal', arabic: 'شَوَّال' },
  { number: 11, name: "Dhu al-Qi'dah", arabic: 'ذُو القَعْدَة' },
  { number: 12, name: 'Dhu al-Hijjah', arabic: 'ذُو الحِجَّة' },
];

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    id: 'islamic-new-year',
    title: 'Islamic New Year (1448 AH)',
    arabicTitle: 'رأس السنة الهجرية',
    hijriMonth: 1,
    hijriDay: 1,
    hijriMonthName: 'Muharram',
    description: 'First day of the Hijri calendar, marking the migration (Hijrah) of Prophet Muhammad (ﷺ).',
    isHoliday: true,
  },
  {
    id: 'ashura',
    title: 'Day of Ashura',
    arabicTitle: 'يوم عاشوراء',
    hijriMonth: 1,
    hijriDay: 10,
    hijriMonthName: 'Muharram',
    description: 'A day of fasting commemorating Prophet Musa (Moses) and the salvation of the Israelites.',
  },
  {
    id: 'mawlid',
    title: "Mawlid an-Nabi",
    arabicTitle: 'المولد النبوي الشريف',
    hijriMonth: 3,
    hijriDay: 12,
    hijriMonthName: "Rabi' al-Awwal",
    description: 'Commemoration of the blessed birth of the Prophet Muhammad (peace and blessings be upon him).',
    isHoliday: true,
  },
  {
    id: 'isra-miraj',
    title: "Al-Isra' wal-Mi'raj",
    arabicTitle: 'الإسراء والمعراج',
    hijriMonth: 7,
    hijriDay: 27,
    hijriMonthName: 'Rajab',
    description: 'The miraculous Night Journey and Heavenly Ascension of Prophet Muhammad (ﷺ).',
  },
  {
    id: 'mid-shaban',
    title: "Nisf Sha'ban (Night of Forgiveness)",
    arabicTitle: 'ليلة النصف من شعبان',
    hijriMonth: 8,
    hijriDay: 15,
    hijriMonthName: "Sha'ban",
    description: 'The middle night of Sha’ban, regarded by many scholars as a special night of seeking forgiveness.',
  },
  {
    id: 'ramadan-start',
    title: 'First Day of Ramadan',
    arabicTitle: 'أول أيام رمضان المبارك',
    hijriMonth: 9,
    hijriDay: 1,
    hijriMonthName: 'Ramadan',
    description: 'The commencement of the blessed month of fasting, intense prayer, charity, and Quran revelation.',
    isHoliday: true,
  },
  {
    id: 'laylat-al-qadr',
    title: 'Laylat al-Qadr (Night of Decree)',
    arabicTitle: 'ليلة القدر المباركة',
    hijriMonth: 9,
    hijriDay: 27,
    hijriMonthName: 'Ramadan',
    description: 'Better than a thousand months. Commemorated especially on the odd nights of the last 10 days of Ramadan.',
  },
  {
    id: 'eid-al-fitr',
    title: 'Eid al-Fitr',
    arabicTitle: 'عيد الفطر المبارك',
    hijriMonth: 10,
    hijriDay: 1,
    hijriMonthName: 'Shawwal',
    description: 'Celebration marking the conclusion of Ramadan with special congregational prayer and Zakat al-Fitr.',
    isHoliday: true,
  },
  {
    id: 'day-of-arafah',
    title: 'Day of Arafah',
    arabicTitle: 'يوم عرفة',
    hijriMonth: 12,
    hijriDay: 9,
    hijriMonthName: 'Dhu al-Hijjah',
    description: 'The peak pinnacle of Hajj pilgrimage. Fasting on this day expiates sins of previous and coming year.',
    isHoliday: true,
  },
  {
    id: 'eid-al-adha',
    title: 'Eid al-Adha',
    arabicTitle: 'عيد الأضحى المبارك',
    hijriMonth: 12,
    hijriDay: 10,
    hijriMonthName: 'Dhu al-Hijjah',
    description: 'The Feast of Sacrifice honouring the obedience of Prophet Ibrahim (peace be upon him).',
    isHoliday: true,
  },
];

export interface HijriDateInfo {
  day: number;
  month: number;
  monthName: string;
  monthArabic: string;
  year: number;
  formatted: string;
  arabicFormatted: string;
}

/**
 * Astronomical Kuwaiti/Umm al-Qura conversion algorithm with manual day adjustment
 */
export function getHijriDate(date: Date = new Date(), adjustment: number = 0): HijriDateInfo {
  // Apply adjustment in days
  const targetDate = new Date(date.getTime() + adjustment * 86400000);

  let day = targetDate.getDate();
  let month = targetDate.getMonth();
  let year = targetDate.getFullYear();

  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  if (y < 1583) b = 0;
  if (y === 1582) {
    if (m > 10) b = -10;
    if (m === 10) {
      b = 0;
      if (day > 4) b = -10;
    }
  }

  let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;

  b = 0;
  if (jd > 2299160) {
    a = Math.floor((jd - 1867216.25) / 36524.25);
    b = 1 + a - Math.floor(a / 4);
  }
  let bb = jd + b + 1524;
  let cc = Math.floor((bb - 122.1) / 365.25);
  let dd = Math.floor(365.25 * cc);
  let ee = Math.floor((bb - dd) / 30.6001);
  day = bb - dd - Math.floor(30.6001 * ee);
  month = ee - 1;
  if (ee > 13) {
    cc += 1;
    month = ee - 13;
  }
  year = cc - 4716;

  let wd = (jd + 1) % 7;

  let iyear = 10631 / 30;
  let epochastro = 1948084;
  let epochcivil = 1948085;

  let shift1 = 8.01 / 60;

  let z = jd - epochastro;
  let cyc = Math.floor(z / 10631);
  z = z - 10631 * cyc;
  let j = Math.floor((z - shift1) / iyear);
  let iy = 30 * cyc + j;
  z = z - Math.floor(j * iyear + shift1);
  let im = Math.floor((z + 28.5001) / 29.5);
  if (im === 13) im = 12;
  let id = z - Math.floor(29.5001 * im - 29);

  // Month indexing is 1-based
  const hMonthIndex = Math.min(Math.max(im, 1), 12);
  const monthData = HIJRI_MONTHS[hMonthIndex - 1];

  return {
    day: id,
    month: hMonthIndex,
    monthName: monthData.name,
    monthArabic: monthData.arabic,
    year: iy,
    formatted: `${id} ${monthData.name} ${iy} AH`,
    arabicFormatted: `${id} ${monthData.arabic} ${iy} هـ`,
  };
}
