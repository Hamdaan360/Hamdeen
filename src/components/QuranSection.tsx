import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_SURAHS, VERIFIED_SURAHS_CONTENT, AYAT_AL_KURSI } from '../data/quranData';
import { SurahMeta, AyahItem } from '../types';
import { audioService } from '../utils/audioService';
import {
  BookOpen,
  Bookmark,
  Calendar,
  CheckCircle,
  ExternalLink,
  Play,
  RotateCcw,
  Search,
  Sliders,
  Sparkles,
  Volume2,
  Trash2,
  ArrowRight,
  Clock,
  Bell,
  Check,
} from 'lucide-react';

export const QuranSection: React.FC = () => {
  const {
    quranPlan,
    updateQuranPlan,
    bookmarks,
    addBookmark,
    removeBookmark,
    logQuranReading,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'reader' | 'planner' | 'bookmarks' | 'sources'>('reader');
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(1);
  const [searchSurahQuery, setSearchSurahQuery] = useState<string>('');
  const [arabicFontSize, setArabicFontSize] = useState<number>(24);
  const [readMinutesInput, setReadMinutesInput] = useState<number>(10);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<number | null>(null);

  const currentSurah = ALL_SURAHS.find((s) => s.number === selectedSurahNumber) || ALL_SURAHS[0];

  // Get content for selected surah or fallback with authentic opening message
  const surahVerses: AyahItem[] = VERIFIED_SURAHS_CONTENT[selectedSurahNumber] || [
    {
      numberInSurah: 1,
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      transliteration: 'Bismillāhi r-raḥmāni r-raḥīm',
      translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    },
    {
      numberInSurah: 2,
      arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      transliteration: 'Al-ḥamdu lillāhi rabbi l-ʿālamīn',
      translation: 'All praise is due to Allah, Lord of the worlds.',
    },
  ];

  const filteredSurahs = ALL_SURAHS.filter(
    (s) =>
      s.englishName.toLowerCase().includes(searchSurahQuery.toLowerCase()) ||
      s.englishNameTranslation.toLowerCase().includes(searchSurahQuery.toLowerCase()) ||
      s.name.includes(searchSurahQuery) ||
      String(s.number) === searchSurahQuery
  );

  const handleBookmarkAyah = (ayah: AyahItem) => {
    addBookmark({
      surahNumber: currentSurah.number,
      surahName: currentSurah.name,
      surahEnglishName: currentSurah.englishName,
      ayahNumber: ayah.numberInSurah,
      textArabic: ayah.arabic,
      translation: ayah.translation,
      note: `Bookmarked from Surah ${currentSurah.englishName}`,
    });

    // Update last read
    updateQuranPlan({
      lastRead: {
        surahNumber: currentSurah.number,
        surahName: currentSurah.name,
        surahEnglishName: currentSurah.englishName,
        ayahNumber: ayah.numberInSurah,
        timestamp: new Date().toISOString(),
      },
    });
  };

  const handleCopyAyah = (ayah: AyahItem) => {
    const text = `${ayah.arabic}\n\n"${ayah.translation}"\n(Surah ${currentSurah.englishName} ${currentSurah.number}:${ayah.numberInSurah})`;
    navigator.clipboard.writeText(text);
    setCopiedAyah(ayah.numberInSurah);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  const handlePlayAyahAudio = (ayah: AyahItem) => {
    setIsPlayingAudio(ayah.numberInSurah);
    audioService.playChime();
    setTimeout(() => setIsPlayingAudio(null), 1500);
  };

  const handleQuickLog = () => {
    logQuranReading(readMinutesInput, 5);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8 max-w-5xl mx-auto">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">The Holy Quran</h2>
          <p className="text-xs text-slate-400">
            Read, reflect, memorize, and track your daily reading goals
          </p>
        </div>

        {/* Segmented Sub Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#0c1f19] border border-[#d4af37]/20 rounded-2xl overflow-x-auto self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('reader')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSubTab === 'reader'
                ? 'bg-[#183d2f] text-[#f3c669] border border-[#d4af37]/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Reader
          </button>
          <button
            onClick={() => setActiveSubTab('planner')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSubTab === 'planner'
                ? 'bg-[#183d2f] text-[#f3c669] border border-[#d4af37]/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Reading Planner
          </button>
          <button
            onClick={() => setActiveSubTab('bookmarks')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSubTab === 'bookmarks'
                ? 'bg-[#183d2f] text-[#f3c669] border border-[#d4af37]/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bookmarks ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveSubTab('sources')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSubTab === 'sources'
                ? 'bg-[#183d2f] text-[#f3c669] border border-[#d4af37]/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Verified Sources
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: QURAN READER */}
      {activeSubTab === 'reader' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Surah Directory List */}
          <div className="lg:col-span-4 bg-[#0e221b] border border-[#d4af37]/20 rounded-3xl p-4 flex flex-col h-[600px] shadow-sm">
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search surah name or number..."
                value={searchSurahQuery}
                onChange={(e) => setSearchSurahQuery(e.target.value)}
                className="w-full bg-[#081510] border border-[#d4af37]/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filteredSurahs.map((surah) => {
                const isSelected = surah.number === selectedSurahNumber;
                return (
                  <button
                    key={surah.number}
                    onClick={() => setSelectedSurahNumber(surah.number)}
                    className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-all text-left ${
                      isSelected
                        ? 'bg-[#173b2d] border border-[#d4af37]/50 text-white shadow-sm'
                        : 'bg-[#11271f]/60 hover:bg-[#143026] text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold tabular-nums ${
                          isSelected ? 'bg-[#d4af37] text-slate-950' : 'bg-[#091712] text-[#d4af37]'
                        }`}
                      >
                        {surah.number}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{surah.englishName}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                          {surah.englishNameTranslation}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-arabic text-sm font-bold text-[#f3c669] block">
                        {surah.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {surah.numberOfAyahs} ayahs
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Surah Content Viewer */}
          <div className="lg:col-span-8 space-y-4">
            {/* Surah Header Card */}
            <div className="rounded-3xl bg-gradient-to-br from-[#123025] to-[#0c1f18] border border-[#d4af37]/30 p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#d4af37] font-semibold">
                  <span>Surah {currentSurah.number}</span>
                  <span>·</span>
                  <span>{currentSurah.revelationType}</span>
                  <span>·</span>
                  <span>{currentSurah.numberOfAyahs} Verses</span>
                </div>
                <h3 className="text-2xl font-black text-white mt-1">
                  {currentSurah.englishName}
                  <span className="text-xs font-normal text-slate-400 ml-2">
                    ({currentSurah.englishNameTranslation})
                  </span>
                </h3>
              </div>

              <div className="text-right">
                <span className="font-arabic text-3xl font-bold text-[#f3c669]">
                  {currentSurah.name}
                </span>
                <div className="flex items-center gap-2 mt-2 justify-end">
                  <span className="text-[11px] text-slate-400">Text Size:</span>
                  <button
                    onClick={() => setArabicFontSize((s) => Math.max(18, s - 2))}
                    className="w-6 h-6 rounded bg-[#17372b] text-slate-300 text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="text-xs text-white tabular-nums">{arabicFontSize}px</span>
                  <button
                    onClick={() => setArabicFontSize((s) => Math.min(36, s + 2))}
                    className="w-6 h-6 rounded bg-[#17372b] text-slate-300 text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Log Reading Bar */}
            <div className="rounded-2xl bg-[#0f241d] border border-[#d4af37]/20 p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                <span className="text-xs font-medium text-slate-300">
                  Read this Surah? Log progress:
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={readMinutesInput}
                  onChange={(e) => setReadMinutesInput(Number(e.target.value))}
                  className="w-14 bg-[#091712] border border-[#d4af37]/25 rounded-lg px-2 py-1 text-xs text-white text-center"
                />
                <span className="text-xs text-slate-400">min</span>
                <button
                  onClick={handleQuickLog}
                  className="px-3 py-1 rounded-lg bg-[#d4af37] text-slate-950 font-bold text-xs hover:bg-[#e4bd46]"
                >
                  Log Reading
                </button>
              </div>
            </div>

            {/* Ayahs Display */}
            <div className="space-y-4">
              {/* Bismillah Header (except for Surah At-Tawbah 9) */}
              {currentSurah.number !== 9 && currentSurah.number !== 1 && (
                <div className="text-center py-4 bg-[#0d211a] rounded-2xl border border-[#d4af37]/15">
                  <p className="font-arabic text-2xl text-[#f3c669]">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <p className="text-xs text-slate-400 mt-1 italic">
                    In the name of Allah, the Entirely Merciful, the Especially Merciful.
                  </p>
                </div>
              )}

              {surahVerses.map((verse) => (
                <div
                  key={verse.numberInSurah}
                  className="p-5 rounded-2xl bg-[#0e221b]/90 border border-[#d4af37]/15 hover:border-[#d4af37]/35 transition-colors space-y-3"
                >
                  {/* Ayah Number Badge & Actions */}
                  <div className="flex items-center justify-between border-b border-[#d4af37]/10 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#183d2f] text-[#f3c669] text-xs font-bold flex items-center justify-center tabular-nums">
                        {verse.numberInSurah}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {currentSurah.englishName} : {verse.numberInSurah}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handlePlayAyahAudio(verse)}
                        className="p-1.5 rounded-lg hover:bg-[#16362a] text-slate-300 hover:text-[#f3c669] transition-colors"
                        title="Play recitation tone"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleBookmarkAyah(verse)}
                        className="p-1.5 rounded-lg hover:bg-[#16362a] text-slate-300 hover:text-[#f3c669] transition-colors"
                        title="Bookmark Ayah"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleCopyAyah(verse)}
                        className="p-1.5 rounded-lg hover:bg-[#16362a] text-slate-300 hover:text-[#f3c669] transition-colors text-xs"
                        title="Copy Ayah text"
                      >
                        {copiedAyah === verse.numberInSurah ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          'Copy'
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Arabic Text */}
                  <div className="text-right py-1" dir="rtl">
                    <p
                      className="font-arabic text-white leading-loose font-normal"
                      style={{ fontSize: `${arabicFontSize}px` }}
                    >
                      {verse.arabic}
                      <span className="font-sans text-xs text-[#d4af37] border border-[#d4af37]/40 rounded-full px-1.5 py-0.5 mx-1 inline-block tabular-nums">
                        {verse.numberInSurah}
                      </span>
                    </p>
                  </div>

                  {/* Transliteration */}
                  {verse.transliteration && (
                    <p className="text-xs text-emerald-300/90 italic">
                      {verse.transliteration}
                    </p>
                  )}

                  {/* English Translation */}
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {verse.translation}
                  </p>
                </div>
              ))}

              {/* Link to read full surah on verified resources */}
              <div className="p-4 rounded-2xl bg-[#091712] border border-[#d4af37]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>
                    Read complete full <strong>Surah {currentSurah.englishName}</strong> with full audio reciters and word-by-word tafsir:
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://quran.com/${currentSurah.number}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#132e23] border border-[#d4af37]/30 text-[#f3c669] font-semibold flex items-center gap-1 hover:bg-[#183b2d]"
                  >
                    <span>Quran.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={`https://tanzil.net/#${currentSurah.number}:1`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#132e23] border border-[#d4af37]/30 text-[#f3c669] font-semibold flex items-center gap-1 hover:bg-[#183b2d]"
                  >
                    <span>Tanzil.net</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: READING PLANNER */}
      {activeSubTab === 'planner' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Goal Setting Form */}
          <div className="rounded-3xl bg-[#0e221b] border border-[#d4af37]/20 p-6 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white">Quran Reading Goals</h3>
              <p className="text-xs text-slate-400">
                Establish a consistent daily habit of Quran recitation
              </p>
            </div>

            {/* Daily Minute Goal Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Daily Goal in Minutes
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 20, 30].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => updateQuranPlan({ dailyMinutesGoal: mins })}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                      quranPlan.dailyMinutesGoal === mins
                        ? 'bg-[#d4af37] text-slate-950 shadow-md'
                        : 'bg-[#132c22] border border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    {mins} Min
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Pages & Ayahs Goal */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Pages Goal
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quranPlan.dailyPagesGoal}
                  onChange={(e) => updateQuranPlan({ dailyPagesGoal: Number(e.target.value) })}
                  className="w-full bg-[#081510] border border-[#d4af37]/20 rounded-xl p-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Ayahs Goal
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={quranPlan.dailyAyahsGoal}
                  onChange={(e) => updateQuranPlan({ dailyAyahsGoal: Number(e.target.value) })}
                  className="w-full bg-[#081510] border border-[#d4af37]/20 rounded-xl p-2.5 text-sm text-white"
                />
              </div>
            </div>

            {/* Preferred Reading Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Preferred Recitation Time
              </label>
              <select
                value={quranPlan.preferredTime}
                onChange={(e) => updateQuranPlan({ preferredTime: e.target.value })}
                className="w-full bg-[#081510] border border-[#d4af37]/20 rounded-xl p-2.5 text-sm text-white"
              >
                <option value="After Fajr">After Fajr (Blessed morning barakah)</option>
                <option value="After Dhuhr">After Dhuhr</option>
                <option value="After Asr">After Asr</option>
                <option value="After Maghrib">After Maghrib</option>
                <option value="Before Sleep">Before Sleep (Surah Al-Mulk)</option>
              </select>
            </div>

            {/* Quran Reading Reminder */}
            <div className="pt-2 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-[#d4af37]" />
                    <span>Quran Reading Reminder</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Get an alert at your dedicated reading hour
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quranPlan.reminderEnabled}
                    onChange={(e) => updateQuranPlan({ reminderEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#122820] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]" />
                </label>
              </div>

              {quranPlan.reminderEnabled && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Reminder Time</label>
                  <input
                    type="time"
                    value={quranPlan.reminderTime}
                    onChange={(e) => updateQuranPlan({ reminderTime: e.target.value })}
                    className="w-full bg-[#081510] border border-[#d4af37]/20 rounded-xl p-2.5 text-sm text-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Today's Reading Status & Bookmark */}
          <div className="space-y-4">
            <div className="rounded-3xl bg-gradient-to-br from-[#123025] to-[#0c1f18] border border-[#d4af37]/30 p-6 shadow-md">
              <span className="text-xs uppercase text-[#d4af37] font-semibold tracking-wider">
                Today's Progress
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold text-white tabular-nums">
                  {quranPlan.todayMinutesRead}
                </span>
                <span className="text-slate-400 text-sm">
                  / {quranPlan.dailyMinutesGoal} minutes read today
                </span>
              </div>

              <div className="w-full h-3 bg-[#081510] rounded-full overflow-hidden border border-[#d4af37]/20 my-4">
                <div
                  className="h-full bg-gradient-to-r from-[#d4af37] to-[#10b981] rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((quranPlan.todayMinutesRead / Math.max(1, quranPlan.dailyMinutesGoal)) * 100)
                    )}%`,
                  }}
                />
              </div>

              <button
                onClick={() => {
                  logQuranReading(5, 5);
                }}
                className="w-full py-2.5 rounded-xl bg-[#193d2f] hover:bg-[#204c3b] border border-[#d4af37]/30 text-xs font-bold text-[#f3c669] flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>+ Log 5 Minutes Now</span>
              </button>
            </div>

            {/* Last Read Bookmark card */}
            <div className="rounded-3xl bg-[#0e221b] border border-[#d4af37]/20 p-5">
              <div className="flex items-center gap-2 mb-2 text-xs text-[#d4af37] font-semibold">
                <Bookmark className="w-4 h-4" />
                <span>Last Read Bookmark</span>
              </div>
              <h4 className="text-lg font-bold text-white">
                Surah {quranPlan.lastRead.surahEnglishName} ({quranPlan.lastRead.surahName})
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Ayah {quranPlan.lastRead.ayahNumber}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {new Date(quranPlan.lastRead.timestamp).toLocaleDateString()}
                </span>
                <button
                  onClick={() => {
                    setSelectedSurahNumber(quranPlan.lastRead.surahNumber);
                    setActiveSubTab('reader');
                  }}
                  className="text-xs text-[#f3c669] font-bold hover:underline flex items-center gap-1"
                >
                  <span>Resume Reading</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: BOOKMARKS */}
      {activeSubTab === 'bookmarks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Saved Bookmarks</h3>
            <span className="text-xs text-slate-400">{bookmarks.length} saved ayahs</span>
          </div>

          {bookmarks.length === 0 ? (
            <div className="text-center py-16 bg-[#0e221b] border border-[#d4af37]/15 rounded-3xl p-6">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <h4 className="text-base font-bold text-white">No bookmarks yet</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                While reading in the Quran reader, tap the bookmark icon on any ayah to save it here for future reflection and memorization.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="p-5 rounded-2xl bg-[#0e221b] border border-[#d4af37]/20 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-[#d4af37]/10 pb-2">
                      <span className="text-xs font-bold text-[#f3c669]">
                        Surah {bm.surahEnglishName} ({bm.surahNumber}:{bm.ayahNumber})
                      </span>
                      <button
                        onClick={() => removeBookmark(bm.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right py-2" dir="rtl">
                      <p className="font-arabic text-lg text-white">{bm.textArabic}</p>
                    </div>

                    <p className="text-xs text-slate-300 italic">"{bm.translation}"</p>
                    {bm.note && (
                      <p className="text-[11px] text-emerald-300/80 mt-1">Note: {bm.note}</p>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-white/5">
                    <span className="text-[10px] text-slate-500">
                      {new Date(bm.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedSurahNumber(bm.surahNumber);
                        setActiveSubTab('reader');
                      }}
                      className="text-xs text-[#f3c669] font-semibold hover:underline"
                    >
                      Open in Reader
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: VERIFIED EXTERNAL SOURCES */}
      {activeSubTab === 'sources' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0e221b] border border-[#d4af37]/20 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d4af37]" />
              <span>Accurate & Trusted Quran Text Policy</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In accordance with Islamic scholarly standards, Hamdeen uses authenticated text verified against the standard Uthmani script (King Fahd Complex for the Printing of the Holy Quran, Medina). For comprehensive reading of all 6,236 verses with certified audio reciters, word-by-word grammatical breakdowns, and verified translations in over 40 languages, we integrate and direct readers to the following globally acclaimed platforms:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://quran.com/"
              target="_blank"
              rel="noreferrer"
              className="p-6 rounded-3xl bg-[#112920] border border-[#d4af37]/25 hover:border-[#d4af37] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xl font-bold text-white group-hover:text-[#f3c669] transition-colors">
                    Quran.com
                  </h4>
                  <ExternalLink className="w-5 h-5 text-[#d4af37]" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The world's leading digital Quran study portal. Features verse-by-verse audio from Mishary Rashid Alafasy, AbdulBaset AbdulSamad, Al-Sudais, tafsir (Ibn Kathir, Al-Jalalayn), and word-level morphology.
                </p>
              </div>
              <span className="text-xs font-bold text-[#f3c669] mt-4 flex items-center gap-1">
                <span>Visit Quran.com</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>

            <a
              href="https://tanzil.net/"
              target="_blank"
              rel="noreferrer"
              className="p-6 rounded-3xl bg-[#112920] border border-[#d4af37]/25 hover:border-[#d4af37] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xl font-bold text-white group-hover:text-[#f3c669] transition-colors">
                    Tanzil.net
                  </h4>
                  <ExternalLink className="w-5 h-5 text-[#d4af37]" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  An international Quranic project providing verified, highly certified Unicode text of the Holy Quran produced with meticulous cross-verification against authoritative printed Mushafs.
                </p>
              </div>
              <span className="text-xs font-bold text-[#f3c669] mt-4 flex items-center gap-1">
                <span>Visit Tanzil.net</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
