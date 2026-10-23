import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  calculateQiblaDirection,
  calculateDistanceToKaaba,
  getCardinalDirection,
  KAABA_COORDINATES,
} from '../utils/qiblaCalculations';
import { KaabaIcon } from './IslamicGraphics';
import {
  Compass,
  MapPin,
  RotateCw,
  ShieldCheck,
  AlertTriangle,
  Info,
  Navigation,
} from 'lucide-react';

export const QiblaCompass: React.FC<{ onOpenLocationModal: () => void }> = ({
  onOpenLocationModal,
}) => {
  const { settings, detectGpsLocation, isGpsLoading, gpsError } = useApp();

  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [sensorStatus, setSensorStatus] = useState<
    'prompt' | 'granted' | 'unavailable' | 'denied'
  >('prompt');
  const [accuracy, setAccuracy] = useState<string>('Standard');

  // Compute exact spherical trigonometry bearing to Kaaba
  const qiblaBearing = calculateQiblaDirection(
    settings.location.latitude,
    settings.location.longitude
  );

  const distanceKm = calculateDistanceToKaaba(
    settings.location.latitude,
    settings.location.longitude
  );

  const cardinalDir = getCardinalDirection(qiblaBearing);

  // Request Device Orientation permission (iOS Safari 13+ requires user gesture)
  const requestOrientationPermission = async () => {
    if (
      typeof window !== 'undefined' &&
      'DeviceOrientationEvent' in window &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function'
    ) {
      try {
        const res = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
        if (res === 'granted') {
          setSensorStatus('granted');
          bindOrientationListener();
        } else {
          setSensorStatus('denied');
        }
      } catch {
        setSensorStatus('denied');
      }
    } else {
      // Standard Android / Desktop API
      bindOrientationListener();
    }
  };

  const bindOrientationListener = () => {
    let hasReceivedValidEvent = false;

    const handler = (e: DeviceOrientationEvent) => {
      // iOS webkitCompassHeading is magnetic/true heading directly
      if ('webkitCompassHeading' in e && typeof (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading === 'number') {
        const heading = (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading;
        if (!isNaN(heading)) {
          hasReceivedValidEvent = true;
          setSensorStatus('granted');
          setDeviceHeading(Math.round(heading));
        }
      } else if (e.alpha !== null && typeof e.alpha === 'number') {
        // Android absolute orientation
        hasReceivedValidEvent = true;
        setSensorStatus('granted');
        const heading = (360 - e.alpha) % 360;
        setDeviceHeading(Math.round(heading));
      }
    };

    window.addEventListener('deviceorientation', handler as EventListener, true);

    // Timeout check: if no sensor event fires in 2 seconds, device lacks compass magnetometer
    setTimeout(() => {
      if (!hasReceivedValidEvent && sensorStatus !== 'granted') {
        setSensorStatus('unavailable');
      }
    }, 2000);

    return () => {
      window.removeEventListener('deviceorientation', handler as EventListener, true);
    };
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      // If iOS requires permission, prompt first; otherwise try listening
      if (
        typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission !== 'function'
      ) {
        bindOrientationListener();
      }
    } else {
      setSensorStatus('unavailable');
    }
  }, []);

  // Compute rotation angle for Kaaba pointer needle
  // When live device orientation is active: angle = qiblaBearing - deviceHeading
  // When sensor is unavailable: needle shows fixed qiblaBearing on a static compass rose
  const needleRotation =
    deviceHeading !== null
      ? (qiblaBearing - deviceHeading + 360) % 360
      : qiblaBearing;

  const isLiveSensorActive = deviceHeading !== null && sensorStatus === 'granted';

  return (
    <div className="space-y-6 pb-20 lg:pb-8 max-w-xl mx-auto flex flex-col items-center">
      {/* Title */}
      <div className="w-full flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Qibla Direction</h2>
          <p className="text-xs text-slate-400">
            Great-circle heading toward the Holy Kaaba in Makkah
          </p>
        </div>

        <button
          onClick={onOpenLocationModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#122920] border border-[#d4af37]/30 text-xs text-[#f3c669] hover:bg-[#163529]"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span className="max-w-[120px] truncate">{settings.location.city}</span>
        </button>
      </div>

      {/* Sensor Status Indicator */}
      <div
        className={`w-full p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
          isLiveSensorActive
            ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
            : 'bg-[#122820] border-[#d4af37]/20 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2">
          {isLiveSensorActive ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-[#d4af37] shrink-0" />
          )}
          <span>
            {isLiveSensorActive
              ? `Live Gyroscope Active (Heading ${deviceHeading}°)`
              : `Showing Calculated Bearing for ${settings.location.city}`}
          </span>
        </div>

        {!isLiveSensorActive && (
          <button
            onClick={requestOrientationPermission}
            className="px-3 py-1 rounded-xl bg-[#1a3d30] border border-[#d4af37]/30 text-[#f3c669] font-bold text-[11px] hover:bg-[#204e3c]"
          >
            Calibrate Sensor
          </button>
        )}
      </div>

      {/* Main Circular Compass Dial */}
      <div className="relative w-80 h-80 my-4 flex items-center justify-center select-none">
        {/* Outer Bezel */}
        <div className="w-80 h-80 rounded-full bg-gradient-to-br from-[#122e23] to-[#071711] border-2 border-[#d4af37]/40 shadow-2xl relative flex items-center justify-center p-3">
          {/* Inner Dial */}
          <div className="w-full h-full rounded-full border border-white/10 relative flex items-center justify-center bg-[#091812]/90">
            {/* Cardinal Markers */}
            <span className="absolute top-2 font-bold text-sm text-[#f3c669]">N</span>
            <span className="absolute right-3 font-bold text-xs text-slate-400">E</span>
            <span className="absolute bottom-2 font-bold text-xs text-slate-400">S</span>
            <span className="absolute left-3 font-bold text-xs text-slate-400">W</span>

            {/* Degree Tick marks */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-full pointer-events-none flex justify-center"
                style={{ transform: `rotate(${i * 30}deg)` }}
              >
                <div className="w-0.5 h-2 bg-[#d4af37]/30 mt-1" />
              </div>
            ))}

            {/* Rotating Qibla Needle & Kaaba Indicator */}
            <div
              className="absolute w-full h-full flex flex-col items-center justify-center pointer-events-none transition-transform duration-300 ease-out"
              style={{ transform: `rotate(${needleRotation}deg)` }}
            >
              {/* Kaaba Marker at Tip */}
              <div className="flex flex-col items-center -mt-20">
                <div className="p-2 rounded-xl bg-[#1b3d30] border border-[#d4af37] shadow-[0_0_15px_#d4af37] text-white">
                  <KaabaIcon className="w-7 h-7" />
                </div>
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-[#d4af37] mt-0.5" />
              </div>

              {/* Center Pivot Point */}
              <div className="w-4 h-4 rounded-full bg-[#d4af37] border-2 border-slate-900 shadow-md z-10" />

              {/* Southern Tail */}
              <div className="w-1 h-12 bg-slate-600/60 rounded-full" />
            </div>

            {/* Center Degree & Info */}
            <div className="text-center z-0 pointer-events-none space-y-0.5">
              <span className="text-4xl font-black text-white tabular-nums tracking-tight block">
                {qiblaBearing}°
              </span>
              <span className="text-xs font-bold text-[#f3c669] tracking-wider uppercase block">
                {cardinalDir}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Geographic Coordinates & Distance */}
      <div className="w-full grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-[#0e221b] border border-[#d4af37]/20 text-center">
          <span className="text-[11px] text-slate-400 block mb-1">Target Bearing</span>
          <span className="text-xl font-extrabold text-white tabular-nums">
            {qiblaBearing}° {cardinalDir}
          </span>
          <span className="text-[10px] text-emerald-300 block mt-0.5">
            Clockwise from True North
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e221b] border border-[#d4af37]/20 text-center">
          <span className="text-[11px] text-slate-400 block mb-1">Distance to Kaaba</span>
          <span className="text-xl font-extrabold text-[#f3c669] tabular-nums">
            {distanceKm.toLocaleString()} km
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Great-Circle Distance
          </span>
        </div>
      </div>

      {/* GPS Refresh Button */}
      <div className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#0a1813] border border-white/5 text-xs text-slate-300">
        <div>
          <span className="font-semibold block text-white">Your Coordinates:</span>
          <span className="text-slate-400 font-mono text-[11px]">
            Lat {settings.location.latitude}°, Lng {settings.location.longitude}°
          </span>
        </div>

        <button
          onClick={() => detectGpsLocation()}
          disabled={isGpsLoading}
          className="px-3 py-1.5 rounded-xl bg-[#16382b] border border-[#d4af37]/30 text-[#f3c669] font-bold hover:bg-[#1d4737] disabled:opacity-50"
        >
          {isGpsLoading ? 'Detecting GPS...' : 'Update via GPS'}
        </button>
      </div>

      {/* Guidance Note */}
      <div className="w-full p-4 rounded-2xl bg-[#091712] border border-white/5 text-xs text-slate-400 space-y-1">
        <p className="font-bold text-slate-300 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Compass Calibration Advice</span>
        </p>
        <p className="text-[11px] leading-relaxed">
          Keep your device flat on your palm away from magnetic phone cases, laptops, or large metal objects. If your browser lacks a hardware compass sensor, align your phone face with {qiblaBearing}° ({cardinalDir}) using a standard compass.
        </p>
      </div>
    </div>
  );
};
