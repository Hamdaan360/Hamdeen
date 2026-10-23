import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_DUAS, getDuaOfTheDay } from '../data/duasData';
import { DuaItem } from '../types';
import { audioService } from '../utils/audioService';
import {
  Heart,
  Share2,
  Copy,
  Check,
  Volume2,
  Bookmark,
  Sparkles,
  Search,
} from 'lucide-react';

export const DuaOfTheDay: React.FC = () => {
  const { favoriteDuaIds, toggleFavoriteDua } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const featuredDua = getDuaOfTheDay(new Date());

  const categories = [
    { id: 'all', label: 'All Duas' },
    { id: 'daily', label: 'Daily Life' },
    { id: 'morning_evening', label: 'Morning & Evening' },
    { id: 'protection', label: 'Protection' },
    { id: 'forgiveness', label: 'Forgiveness' },
    { id: 'hardship', label: 'Hardship & Relief' },
    { id: 'guidance', label: 'Guidance & Knowledge' },
  ];

  const filteredDuas = ALL_DUAS.filter((dua) => {
    const matchesCategory = selectedCategory === 'all' || dua.category === selectedCategory;
    const matchesSearch =
      dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.transliteration.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (dua: DuaItem) => {
    const text = `${dua.title}\n\n${dua.arabic}\n\n${dua.transliteration}\n\n"${dua.translation}"\n\n— Reference: ${dua.reference}\n(From Hamdeen Islamic Companion)`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (dua: DuaItem) => {
    const text = `${dua.title}\n\n${dua.arabic}\n\n"${dua.translation}"\n\n— ${dua.reference}`;
    if (navigator.share) {
      navigator.share({ title: dua.title, text }).catch(() => {});
    } else {
      handleCopy(dua);
    }
  };

  const handlePlayAudio = () => {
    audioService.playChime();
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Supplications & Duas</h2>
          <p className="text-xs text-slate-400">Authentic prayers from the Noble Quran and Sahih Sunnah</p>
        </div>
      </div>

      {/* Featured Dua Card matching image */}
      <div className="rounded-3xl bg-gradient-to-br from-[#123025] to-[#0c1f18] border border-[#d4af37]/35 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs font-bold text-[#f3c669] uppercase tracking-wider">
              Dua of the Day
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePlayAudio}
              className="p-2 rounded-xl bg-[#16382b] text-slate-300 hover:text-white"
              title="Listen to chime"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavoriteDua(featuredDua.id)}
              className={`p-2 rounded-xl transition-colors ${
                favoriteDuaIds.includes(featuredDua.id)
                  ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                  : 'bg-[#16382b] text-slate-300 hover:text-white'
              }`}
              title="Add to Favorites"
            >
              <Heart
                className="w-4 h-4"
                fill={favoriteDuaIds.includes(featuredDua.id) ? 'currentColor' : 'none'}
              />
            </button>
            <button
              onClick={() => handleShare(featuredDua)}
              className="p-2 rounded-xl bg-[#16382b] text-slate-300 hover:text-white"
              title="Share Dua"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="my-4 text-right" dir="rtl">
          <p className="font-arabic text-2xl sm:text-3xl text-white leading-loose font-normal">
            {featuredDua.arabic}
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#d4af37]/20">
          <p className="text-xs text-emerald-300 italic font-medium">
            {featuredDua.transliteration}
          </p>
          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
            "{featuredDua.translation}"
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-slate-400">
            <span className="text-[#f3c669] font-medium">{featuredDua.reference}</span>
            {featuredDua.benefits && (
              <span className="text-slate-400 italic text-[11px]">{featuredDua.benefits}</span>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search supplications by keyword, theme, or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0e221b] border border-[#d4af37]/20 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#d4af37] text-slate-950 shadow-md'
                  : 'bg-[#10241c] border border-white/5 text-slate-300 hover:text-white hover:bg-[#143026]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Duas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDuas.map((dua) => {
          const isFav = favoriteDuaIds.includes(dua.id);
          const isCopied = copiedId === dua.id;

          return (
            <div
              key={dua.id}
              className="rounded-3xl bg-[#0e221b] border border-[#d4af37]/20 p-5 flex flex-col justify-between space-y-4 hover:border-[#d4af37]/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#d4af37]/10 pb-2.5">
                  <h4 className="text-sm font-bold text-white max-w-[220px] truncate">
                    {dua.title}
                  </h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFavoriteDua(dua.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isFav ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title="Favorite"
                    >
                      <Heart className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => handleCopy(dua)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                      title="Copy"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleShare(dua)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="my-3 text-right" dir="rtl">
                  <p className="font-arabic text-xl text-white leading-loose">
                    {dua.arabic}
                  </p>
                </div>

                <p className="text-xs text-emerald-300/90 italic mt-2">
                  {dua.transliteration}
                </p>
                <p className="text-xs text-slate-200 mt-1.5 leading-relaxed">
                  "{dua.translation}"
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                <span className="text-[#f3c669] font-medium">{dua.reference}</span>
                <span className="capitalize text-slate-500">{dua.category.replace('_', ' ')}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
