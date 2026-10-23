import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DesktopSidebar, MobileBottomNav, MobileMoreDrawer, TopHeader } from './components/Navigation';
import { HomeDashboard } from './components/HomeDashboard';
import { NamazTracker } from './components/NamazTracker';
import { PrayerAlarms } from './components/PrayerAlarms';
import { QuranSection } from './components/QuranSection';
import { TasbeehCounter } from './components/TasbeehCounter';
import { DuaOfTheDay } from './components/DuaOfTheDay';
import { CalendarView } from './components/CalendarView';
import { QiblaCompass } from './components/QiblaCompass';
import { ProgressReports } from './components/ProgressReports';
import { SettingsView } from './components/SettingsView';
import { LocationModal } from './components/LocationModal';
import { AppLockModal } from './components/AppLockModal';
import { SplashScreen } from './components/SplashScreen';

const MainLayout: React.FC = () => {
  const { activeTab, isLocked } = useApp();
  const [isMoreDrawerOpen, setIsMoreDrawerOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('hamdeen_splash_dismissed');
    } catch {
      return false;
    }
  });

  const handleDismissSplash = () => {
    setShowSplash(false);
    try {
      localStorage.setItem('hamdeen_splash_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  if (showSplash) {
    return <SplashScreen onGetStarted={handleDismissSplash} />;
  }

  return (
    <div className="min-h-screen bg-[#091511] bg-islamic-pattern text-slate-100 flex flex-col lg:flex-row antialiased selection:bg-[#d4af37]/30 selection:text-[#f3c669]">
      {/* App Lock PIN Keypad when locked */}
      <AppLockModal />

      {/* Desktop Left Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <TopHeader onOpenLocationModal={() => setIsLocationModalOpen(true)} />

        {/* Viewport Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {activeTab === 'home' && <HomeDashboard />}
          {activeTab === 'namaz' && <NamazTracker />}
          {activeTab === 'alarms' && <PrayerAlarms />}
          {activeTab === 'quran' && <QuranSection />}
          {activeTab === 'tasbeeh' && <TasbeehCounter />}
          {activeTab === 'dua' && <DuaOfTheDay />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'qibla' && (
            <QiblaCompass onOpenLocationModal={() => setIsLocationModalOpen(true)} />
          )}
          {activeTab === 'reports' && <ProgressReports />}
          {activeTab === 'settings' && (
            <SettingsView onOpenLocationModal={() => setIsLocationModalOpen(true)} />
          )}
        </main>

        {/* Mobile Fixed Bottom Navigation Bar */}
        <MobileBottomNav onOpenMore={() => setIsMoreDrawerOpen(true)} />

        {/* Mobile More Tools Drawer */}
        <MobileMoreDrawer
          isOpen={isMoreDrawerOpen}
          onClose={() => setIsMoreDrawerOpen(false)}
        />

        {/* Global Location Selector Modal */}
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
