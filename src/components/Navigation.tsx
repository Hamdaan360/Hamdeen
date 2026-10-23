import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import { CrescentStarIcon } from './IslamicGraphics';
import {
  Home,
  CheckSquare,
  BookOpen,
  Calendar as CalendarIcon,
  Compass,
  Bell,
  CircleDot,
  Heart,
  BarChart2,
  Settings,
  Lock,
  Volume2,
  VolumeX,
  MapPin,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PRIMARY_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'namaz', label: 'Namaz', icon: CheckSquare },
  { id: 'alarms', label: 'Alarms', icon: Bell },
  { id: 'quran', label: 'Quran', icon: BookOpen },
  { id: 'tasbeeh', label: 'Tasbeeh', icon: CircleDot },
  { id: 'qibla', label: 'Qibla', icon: Compass },
  { id: 'dua', label: 'Duas', icon: Heart },
  { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
  { id: 'reports', label: 'Reports', icon: BarChart2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const DesktopSidebar: React.FC = () => {
  const { activeTab, setActiveTab, nextPrayer, settings, updateSettings, lockApp } = useApp();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-[#d4af37]/15 bg-[#0a1813]/90 backdrop-blur-md h-screen sticky top-0 z-30 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#d4af37]/10 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 rounded-xl bg-[#132d22] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shadow-inner">
            <CrescentStarIcon className="w-6 h-6 text-[#d4af37]" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1">
              Hamdeen
            </h1>
            <p className="text-xs text-[#d4af37]/80 font-medium">My Deen Companion</p>
          </div>
        </div>

        {settings.pinLock?.enabled && settings.pinLock.pinCode && (
          <button
            onClick={lockApp}
            title="Lock App"
            className="p-2 rounded-lg text-slate-400 hover:text-[#d4af37] hover:bg-[#132d22] transition-colors"
          >
            <Lock className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {PRIMARY_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#18392c] to-[#122e23] text-[#f3c669] border border-[#d4af37]/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#10251c]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#d4af37]' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Mini Next Prayer Widget */}
      <div className="p-4 mx-4 mb-4 rounded-xl bg-gradient-to-br from-[#122c22] to-[#0d2018] border border-[#d4af37]/20 shadow-md">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Next Prayer</span>
          <span className="text-[#f3c669] font-medium">{nextPrayer.countdownFormatted}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-base font-bold text-white">{nextPrayer.name}</span>
          <span className="text-sm font-semibold text-[#f3c669] tabular-nums">{nextPrayer.time12}</span>
        </div>
      </div>

      {/* Sidebar Footer Controls */}
      <div className="p-4 border-t border-[#d4af37]/10 flex items-center justify-between text-xs text-slate-400">
        <button
          onClick={() => updateSettings({ soundEffects: !settings.soundEffects })}
          className="flex items-center gap-2 hover:text-slate-200 transition-colors"
          title="Toggle audio sounds"
        >
          {settings.soundEffects ? (
            <>
              <Volume2 className="w-4 h-4 text-[#d4af37]" />
              <span>Sound On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-500" />
              <span>Muted</span>
            </>
          )}
        </button>

        <span className="text-[11px] text-slate-500">v1.2</span>
      </div>
    </aside>
  );
};

export const MobileBottomNav: React.FC<{ onOpenMore: () => void }> = ({ onOpenMore }) => {
  const { activeTab, setActiveTab } = useApp();

  const primaryMobileTabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'namaz', label: 'Namaz', icon: CheckSquare },
    { id: 'quran', label: 'Quran', icon: BookOpen },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a1813]/95 backdrop-blur-lg border-t border-[#d4af37]/20 pb-safe">
      <div className="grid grid-cols-5 items-center h-16 px-2">
        {primaryMobileTabs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                isActive ? 'text-[#f3c669]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#d4af37]' : 'text-slate-400'}`} />
              <span className="text-[10px] font-medium mt-1 tracking-tight">{item.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-[#d4af37] mt-0.5" />}
            </button>
          );
        })}

        {/* More Menu Tab */}
        <button
          onClick={onOpenMore}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            !primaryMobileTabs.some((t) => t.id === activeTab) ? 'text-[#f3c669]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1 tracking-tight">More</span>
          {!primaryMobileTabs.some((t) => t.id === activeTab) && (
            <div className="w-1 h-1 rounded-full bg-[#d4af37] mt-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};

export const MobileMoreDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, lockApp, settings } = useApp();

  if (!isOpen) return null;

  const moreItems: NavItem[] = [
    { id: 'alarms', label: 'Prayer Alarms', icon: Bell },
    { id: 'tasbeeh', label: 'Tasbeeh Counter', icon: CircleDot },
    { id: 'qibla', label: 'Qibla Direction', icon: Compass },
    { id: 'dua', label: 'Dua of the Day', icon: Heart },
    { id: 'reports', label: 'Progress & Reports', icon: BarChart2 },
    { id: 'settings', label: 'App Settings', icon: Settings },
  ];

  return (
    <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end">
      <div className="bg-[#0e221b] border-t border-[#d4af37]/30 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        <div className="w-12 h-1.5 bg-[#d4af37]/30 rounded-full mx-auto mb-6" />

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <CrescentStarIcon className="w-5 h-5 text-[#d4af37]" />
            <span className="text-base font-bold text-white">More Islamic Tools</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#132d22] text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {moreItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl flex flex-col items-start gap-2 border transition-all text-left ${
                  isActive
                    ? 'bg-[#183a2d] border-[#d4af37] text-[#f3c669]'
                    : 'bg-[#122820] border-[#d4af37]/15 text-slate-200 hover:border-[#d4af37]/40'
                }`}
              >
                <div className="p-2 rounded-xl bg-[#091712] border border-[#d4af37]/20 text-[#d4af37]">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {settings.pinLock?.enabled && (
          <button
            onClick={() => {
              onClose();
              lockApp();
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#162f25] border border-red-500/30 text-red-300 flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Lock className="w-4 h-4" />
            <span>Lock Hamdeen</span>
          </button>
        )}
      </div>
    </div>
  );
};

export const TopHeader: React.FC<{ onOpenLocationModal: () => void }> = ({ onOpenLocationModal }) => {
  const { hijriDate, settings, setActiveTab } = useApp();

  return (
    <header className="sticky top-0 z-20 bg-[#0a1813]/80 backdrop-blur-md border-b border-[#d4af37]/15 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Brand & Date lockup */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#132d22] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
            <CrescentStarIcon className="w-5 h-5 text-[#d4af37]" />
          </div>
          <span className="font-bold text-white text-base">Hamdeen</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="text-[#f3c669] font-medium font-arabic text-sm">{hijriDate.formatted}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Location Selector & Quick Settings */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenLocationModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#122920] border border-[#d4af37]/25 text-xs text-slate-200 hover:border-[#d4af37]/50 hover:bg-[#163328] transition-colors"
          title="Change location or detect GPS"
        >
          <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="max-w-[130px] sm:max-w-[200px] truncate font-medium">
            {settings.location.city}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className="p-2 rounded-full bg-[#122920] border border-[#d4af37]/20 text-slate-300 hover:text-[#d4af37] transition-colors"
          title="Open Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
