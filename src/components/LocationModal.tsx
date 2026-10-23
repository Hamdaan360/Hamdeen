import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { POPULAR_CITIES } from '../data/citiesData';
import { UserLocation } from '../types';
import { MapPin, Navigation, Search, Check, X } from 'lucide-react';

export const LocationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { settings, updateSettings, detectGpsLocation, isGpsLoading, gpsError } = useApp();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = POPULAR_CITIES.filter(
    (c) =>
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectCity = (loc: UserLocation) => {
    updateSettings({ location: loc });
    onClose();
  };

  const handleGpsClick = async () => {
    const success = await detectGpsLocation();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0e221b] border border-[#d4af37]/30 rounded-3xl p-6 w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#d4af37]/15 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#d4af37]" />
            <h3 className="text-lg font-bold text-white">Select Location</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Button */}
        <button
          onClick={handleGpsClick}
          disabled={isGpsLoading}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#173a2d] to-[#122e23] border border-[#d4af37]/40 text-xs font-bold text-[#f3c669] flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
        >
          <Navigation className="w-4 h-4" />
          <span>{isGpsLoading ? 'Accessing GPS...' : 'Use Current Device GPS Location'}</span>
        </button>

        {gpsError && (
          <p className="text-[11px] text-amber-300 bg-amber-950/60 p-2.5 rounded-xl border border-amber-500/30">
            {gpsError}
          </p>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search city or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#081510] border border-[#d4af37]/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* City list */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {filtered.map((city) => {
            const isSelected =
              settings.location.city === city.city && settings.location.country === city.country;
            return (
              <button
                key={`${city.city}-${city.country}`}
                onClick={() => handleSelectCity(city)}
                className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-colors ${
                  isSelected
                    ? 'bg-[#183d2f] text-white border border-[#d4af37]/40'
                    : 'bg-[#11271f]/60 text-slate-300 hover:bg-[#143026]'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">{city.city}</span>
                  <span className="text-[10px] text-slate-400">{city.country}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#d4af37]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
