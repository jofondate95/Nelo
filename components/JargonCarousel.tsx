
import React, { useState } from 'react';

interface JargonItem {
  term: string;
  def: string;
}

interface Props {
  items: JargonItem[];
  isDark: boolean;
  onShare: (item: JargonItem) => void;
  lang: 'fr' | 'en';
}

export default function JargonCarousel({ items, isDark, onShare, lang }: Props) {
  const [currentIndex, setCurrentIndex] = useState(items.length - 1);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const activeWord = items[currentIndex];
  const contrastText = isDark ? 'text-white' : 'text-zinc-900';
  const isToday = currentIndex === items.length - 1;

  return (
    <div className="relative w-full group">
      <div className={`p-6 mb-8 rounded-[2rem] border transition-all duration-500 overflow-hidden relative ${
        isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100 shadow-sm'
      }`}>
        {/* Background Decoration */}
        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'}`} />

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">
                {lang === 'fr' ? 'Mot du jour' : 'Word of the day'}
              </h3>
              {!isToday && (
                <span className="px-2 py-0.5 rounded-full bg-zinc-500/20 text-zinc-500 text-[7px] font-black uppercase">
                  {lang === 'fr' ? 'Passé' : 'Past'}
                </span>
              )}
            </div>
            <h4 className={`text-2xl font-black tracking-tighter animate-in slide-in-from-left duration-300 ${contrastText}`}>
              {activeWord.term}
            </h4>
          </div>
          <button 
            onClick={() => onShare(activeWord)}
            className="p-3 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-90 hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>

        <p className={`text-sm leading-relaxed mb-6 relative z-10 animate-in fade-in duration-500 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
          {activeWord.def}
        </p>

        {/* Carousel Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-emerald-500/10 relative z-10">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`p-2 rounded-xl transition-all ${currentIndex === 0 ? 'opacity-20 grayscale' : 'hover:bg-emerald-500/10 active:scale-90'}`}
          >
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex gap-1.5">
            {items.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-4 bg-emerald-500' : 'w-1.5 bg-emerald-500/20'
                }`} 
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            disabled={isToday}
            className={`p-2 rounded-xl transition-all ${isToday ? 'opacity-20 grayscale' : 'hover:bg-emerald-500/10 active:scale-90'}`}
          >
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
