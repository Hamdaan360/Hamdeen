import { CalculationMethod, AsrJuristicMethod, PrayerName, PrayerTimesResult } from '../types';

interface MethodParams {
  fajrAngle: number;
  ishaAngle?: number;
  ishaInterval?: number; // minutes after maghrib (for Umm al-Qura)
}

const METHOD_PARAMS: Record<CalculationMethod, MethodParams> = {
  MWL: { fajrAngle: 18, ishaAngle: 17 },
  ISNA: { fajrAngle: 15, ishaAngle: 15 },
  Egypt: { fajrAngle: 19.5, ishaAngle: 17.5 },
  Makkah: { fajrAngle: 18.5, ishaInterval: 90 },
  Karachi: { fajrAngle: 18, ishaAngle: 18 },
};

export const METHOD_LABELS: Record<CalculationMethod, string> = {
  MWL: 'Muslim World League (MWL)',
  ISNA: 'Islamic Society of North America (ISNA)',
  Egypt: 'Egyptian General Authority of Survey',
  Makkah: 'Umm al-Qura University, Makkah',
  Karachi: 'University of Islamic Sciences, Karachi',
};

// Standard astronomical solar coordinates
function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function fixAngle(angle: number): number {
  return angle - 360 * Math.floor(angle / 360);
}

function fixHour(hour: number): number {
  return hour - 24 * Math.floor(hour / 24);
}

// Calculate Julian Date
function julianDate(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Sun declination and Equation of Time
function sunPosition(jd: number) {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * Math.sin(degToRad(g)) + 0.02 * Math.sin(degToRad(2 * g)));
  const e = 23.439 - 0.00000036 * D;
  const d = radToDeg(Math.asin(Math.sin(degToRad(e)) * Math.sin(degToRad(L))));
  let RA = radToDeg(Math.atan2(Math.cos(degToRad(e)) * Math.sin(degToRad(L)), Math.cos(degToRad(L)))) / 15;
  RA = fixHour(RA);
  const EqT = q / 15 - RA;
  return { declination: d, equationOfTime: EqT };
}

// Compute hour angle for solar altitude
function computeHourAngle(altitude: number, lat: number, dec: number): number {
  const cosH =
    (Math.sin(degToRad(altitude)) - Math.sin(degToRad(lat)) * Math.sin(degToRad(dec))) /
    (Math.cos(degToRad(lat)) * Math.cos(degToRad(dec)));
  if (cosH > 1) return 0; // sun never rises to this altitude
  if (cosH < -1) return Math.PI; // sun never sets below this altitude
  return radToDeg(Math.acos(cosH));
}

// Compute Asr hour angle
function computeAsrAngle(shadowFactor: number, lat: number, dec: number): number {
  const alt = radToDeg(Math.atan(1 / (shadowFactor + Math.tan(degToRad(Math.abs(lat - dec))))));
  return computeHourAngle(alt, lat, dec);
}

function formatHoursToTime(hours: number): string {
  const h = fixHour(hours);
  const totalMinutes = Math.round(h * 60);
  const normalizedHours = Math.floor(totalMinutes / 60) % 24;
  const normalizedMins = totalMinutes % 60;
  return `${String(normalizedHours).padStart(2, '0')}:${String(normalizedMins).padStart(2, '0')}`;
}

export function formatTime12(time24: string): string {
  if (!time24) return '--:--';
  const parts = time24.split(':');
  if (parts.length < 2) return time24;
  let h = parseInt(parts[0], 10);
  const m = parts[1];
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

export function parseTimeToMinutes(time24: string): number {
  const [h, m] = time24.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function addMinutesToTime(time24: string, minutes: number): string {
  let total = parseTimeToMinutes(time24) + minutes;
  total = (total % 1440 + 1440) % 1440;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Calculates prayer times for a given date, coordinates, and calculation method.
 */
export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  method: CalculationMethod = 'MWL',
  asrMethod: AsrJuristicMethod = 'Standard',
  manualOffsets: Record<PrayerName, number> = { Fajr: 0, Sunrise: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0 }
): PrayerTimesResult {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jd = julianDate(year, month, day);
  const { declination, equationOfTime } = sunPosition(jd);

  // Timezone offset in hours
  const timezoneOffset = -date.getTimezoneOffset() / 60;

  // Dhuhr (solar noon)
  const dhuhrBase = 12 + timezoneOffset - lng / 15 - equationOfTime;

  const methodParam = METHOD_PARAMS[method] || METHOD_PARAMS.MWL;

  // Fajr angle (-18 deg, etc)
  const fajrHA = computeHourAngle(-methodParam.fajrAngle, lat, declination) / 15;
  const fajrHour = dhuhrBase - fajrHA;

  // Sunrise (-0.833 deg solar depression for atmospheric refraction)
  const sunriseHA = computeHourAngle(-0.833, lat, declination) / 15;
  const sunriseHour = dhuhrBase - sunriseHA;

  // Asr (1 for Standard, 2 for Hanafi)
  const asrFactor = asrMethod === 'Hanafi' ? 2 : 1;
  const asrHA = computeAsrAngle(asrFactor, lat, declination) / 15;
  const asrHour = dhuhrBase + asrHA;

  // Sunset / Maghrib
  const sunsetHA = computeHourAngle(-0.833, lat, declination) / 15;
  const maghribHour = dhuhrBase + sunsetHA;

  // Isha
  let ishaHour: number;
  if (methodParam.ishaInterval) {
    ishaHour = maghribHour + methodParam.ishaInterval / 60;
  } else {
    const ishaHA = computeHourAngle(-(methodParam.ishaAngle || 17), lat, declination) / 15;
    ishaHour = dhuhrBase + ishaHA;
  }

  const times = {
    Fajr: addMinutesToTime(formatHoursToTime(fajrHour), manualOffsets.Fajr || 0),
    Sunrise: addMinutesToTime(formatHoursToTime(sunriseHour), manualOffsets.Sunrise || 0),
    Dhuhr: addMinutesToTime(formatHoursToTime(dhuhrBase), manualOffsets.Dhuhr || 0),
    Asr: addMinutesToTime(formatHoursToTime(asrHour), manualOffsets.Asr || 0),
    Maghrib: addMinutesToTime(formatHoursToTime(maghribHour), manualOffsets.Maghrib || 0),
    Isha: addMinutesToTime(formatHoursToTime(ishaHour), manualOffsets.Isha || 0),
    dateStr: date.toISOString().split('T')[0],
    isAutoCalculated: true,
    methodName: METHOD_LABELS[method] || method,
  };

  return times;
}

export interface NextPrayerInfo {
  name: PrayerName;
  time24: string;
  time12: string;
  minutesRemaining: number;
  hoursRemaining: number;
  secondsRemaining: number;
  countdownFormatted: string;
  isToday: boolean;
}

export function getNextPrayer(prayerTimes: PrayerTimesResult, now: Date = new Date()): NextPrayerInfo {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentSeconds = now.getSeconds();

  const orderedPrayers: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  for (const prayer of orderedPrayers) {
    const pMinutes = parseTimeToMinutes(prayerTimes[prayer]);
    if (pMinutes > currentMinutes || (pMinutes === currentMinutes && currentSeconds === 0)) {
      const diffMinutes = pMinutes - currentMinutes;
      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      const countdown = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
      return {
        name: prayer,
        time24: prayerTimes[prayer],
        time12: formatTime12(prayerTimes[prayer]),
        minutesRemaining: diffMinutes,
        hoursRemaining: hours,
        secondsRemaining: diffMinutes * 60 - currentSeconds,
        countdownFormatted: countdown,
        isToday: true,
      };
    }
  }

  // If all prayers have passed for today, the next prayer is Fajr tomorrow
  const fajrMinutes = parseTimeToMinutes(prayerTimes.Fajr);
  const diffMinutes = 1440 - currentMinutes + fajrMinutes;
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;

  return {
    name: 'Fajr',
    time24: prayerTimes.Fajr,
    time12: formatTime12(prayerTimes.Fajr),
    minutesRemaining: diffMinutes,
    hoursRemaining: hours,
    secondsRemaining: diffMinutes * 60 - currentSeconds,
    countdownFormatted: `${hours}h ${mins}m`,
    isToday: false,
  };
}
