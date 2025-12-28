
import React from 'react';
import { AppTab } from '../types';
import { translations, Language } from '../translations';

interface Props {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  isDark: boolean;
  lang: Language;
}

const BottomTabs: React.FC<Props> = ({ activeTab, onTabChange, isDark, lang }) => {
  const t = translations[lang];
  const tabs = [
    { id: AppTab.WALLET, label: t.wallet, icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-emerald-500' : (isDark ? 'text-zinc-600' : 'text-zinc-400')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )},
    { id: AppTab.HISTORY, label: t.activity, icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-emerald-500' : (isDark ? 'text-zinc-600' : 'text-zinc-400')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { id: AppTab.PREVIEW, label: t.preview, icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-emerald-500' : (isDark ? 'text-zinc-600' : 'text-zinc-400')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )},
    { id: AppTab.SETTINGS, label: t.profile, icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-emerald-500' : (isDark ? 'text-zinc-600' : 'text-zinc-400')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 px-4 pb-10 pt-4 flex justify-around items-center border-t backdrop-blur-2xl transition-all ${isDark ? 'bg-black/90 border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]' : 'bg-white/90 border-black/5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]'}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className="flex flex-col items-center gap-1 transition-all active:scale-90"
        >
          {tab.icon(activeTab === tab.id)}
          <span className={`text-[9px] font-black uppercase tracking-widest ${activeTab === tab.id ? (isDark ? 'text-white' : 'text-zinc-900') : 'text-zinc-500'}`}>
            {tab.label}
          </span>
          {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5 shadow-lg shadow-emerald-500/50 animate-pulse" />}
        </button>
      ))}
    </div>
  );
};

export default BottomTabs;
