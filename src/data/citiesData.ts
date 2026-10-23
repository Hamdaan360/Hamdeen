import { UserLocation } from '../types';

export const POPULAR_CITIES: UserLocation[] = [
  { city: 'Makkah', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262, isAutoGps: false, timezone: 'Asia/Riyadh' },
  { city: 'Madinah', country: 'Saudi Arabia', latitude: 24.4686, longitude: 39.6142, isAutoGps: false, timezone: 'Asia/Riyadh' },
  { city: 'Jerusalem (Al-Quds)', country: 'Palestine', latitude: 31.7683, longitude: 35.2137, isAutoGps: false },
  { city: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357, isAutoGps: false, timezone: 'Africa/Cairo' },
  { city: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784, isAutoGps: false, timezone: 'Europe/Istanbul' },
  { city: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, isAutoGps: false, timezone: 'Asia/Dubai' },
  { city: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, isAutoGps: false, timezone: 'Europe/London' },
  { city: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060, isAutoGps: false, timezone: 'America/New_York' },
  { city: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832, isAutoGps: false, timezone: 'America/Toronto' },
  { city: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777, isAutoGps: false, timezone: 'Asia/Kolkata' },
  { city: 'Karachi', country: 'Pakistan', latitude: 24.8607, longitude: 67.0011, isAutoGps: false, timezone: 'Asia/Karachi' },
  { city: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456, isAutoGps: false, timezone: 'Asia/Jakarta' },
  { city: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.1390, longitude: 101.6869, isAutoGps: false, timezone: 'Asia/Kuala_Lumpur' },
  { city: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, isAutoGps: false, timezone: 'Europe/Paris' },
  { city: 'Berlin', country: 'Germany', latitude: 52.5200, longitude: 13.4050, isAutoGps: false, timezone: 'Europe/Berlin' },
  { city: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, isAutoGps: false, timezone: 'Australia/Sydney' },
  { city: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, isAutoGps: false, timezone: 'Asia/Singapore' },
  { city: 'Doha', country: 'Qatar', latitude: 25.2854, longitude: 51.5310, isAutoGps: false, timezone: 'Asia/Qatar' },
  { city: 'Riyadh', country: 'Saudi Arabia', latitude: 24.7136, longitude: 46.6753, isAutoGps: false, timezone: 'Asia/Riyadh' },
  { city: 'Amman', country: 'Jordan', latitude: 31.9454, longitude: 35.9284, isAutoGps: false, timezone: 'Asia/Amman' },
  { city: 'Chicago', country: 'United States', latitude: 41.8781, longitude: -87.6298, isAutoGps: false, timezone: 'America/Chicago' },
  { city: 'Los Angeles', country: 'United States', latitude: 34.0522, longitude: -118.2437, isAutoGps: false, timezone: 'America/Los_Angeles' },
  { city: 'Johannesburg', country: 'South Africa', latitude: -26.2041, longitude: 28.0473, isAutoGps: false, timezone: 'Africa/Johannesburg' },
  { city: 'Lagos', country: 'Nigeria', latitude: 6.5244, longitude: 3.3792, isAutoGps: false, timezone: 'Africa/Lagos' },
  { city: 'Casablanca', country: 'Morocco', latitude: 33.5731, longitude: -7.5898, isAutoGps: false, timezone: 'Africa/Casablanca' },
];

export const DEFAULT_LOCATION: UserLocation = POPULAR_CITIES[0]; // Makkah
