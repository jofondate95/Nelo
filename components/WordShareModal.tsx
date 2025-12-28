
import React from 'react';
import { Language, translations } from '../translations.ts';

interface Props {
  term: string;
  definition: string;
  isDark: boolean;
  lang: Language;
  onClose: () => void;
}

export default function WordShareModal({ term, definition, isDark, lang, onClose }: Props) {
  const t = translations[lang];
  const glassBtn = isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-zinc-900';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`relative w-full max-w-xs rounded-[2.5rem] p-8 border shadow-2xl animate-in zoom-in-95 duration-300 ${isDark ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-black/5 text-zinc-900'}`}>
        <h4 className="text-lg font-black uppercase tracking-tighter mb-4">{t.captured}</h4>
        
        {/* Stylized Preview of the shared image */}
        <div className={`mb-6 p-6 rounded-3xl border ${isDark ? 'bg-black/40 border-white/10' : 'bg-zinc-50 border-zinc-200'} text-left`}>
           <div className="flex items-center gap-2 mb-4">
             <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] font-black text-white">N</div>
             <span className="text-[10px] font-black tracking-widest uppercase opacity-50">Nelo Wisdom</span>
           </div>
           <h5 className="text-xl font-black text-emerald-500 mb-2">{term}</h5>
           <p className="text-xs leading-relaxed opacity-80">{definition}</p>
        </div>

        <p className="text-xs opacity-60 mb-8 font-medium">{t.shareReady}</p>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          {['WhatsApp', 'Insta', 'LinkedIn'].map(social => (
            <button key={social} onClick={onClose} className={`flex flex-col items-center gap-2 p-3 rounded-2xl ${glassBtn} transition-all active:scale-90`}>
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              </div>
              <span className="text-[8px] font-black uppercase">{social}</span>
            </button>
          ))}
        </div>

        <button onClick={onClose} className="w-full py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-emerald-500 text-white active:scale-95 transition-all">
          {t.close}
        </button>
      </div>
    </div>
  );
}
