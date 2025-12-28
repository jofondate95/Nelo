
import React from 'react';
import { Language, translations } from '../translations.ts';
import ProfileDisplay from './ProfileDisplay.tsx';

interface NfcData {
  type: 'VCARD' | 'PAYMENT_REQ';
  payload: any;
}

interface Props {
  data: NfcData;
  isDark: boolean;
  lang: Language;
  onClose: () => void;
  onAction: () => void;
}

export default function NfcDetectionModal({ data, isDark, lang, onClose, onAction }: Props) {
  const t = translations[lang];
  const isVcard = data.type === 'VCARD';

  return (
    <div className="fixed inset-0 z-[3000] flex flex-col animate-in fade-in duration-500 bg-black/90 backdrop-blur-3xl overflow-y-auto custom-scrollbar">
      {/* Header Bar */}
      <div className="sticky top-0 z-[3100] p-6 pt-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3m0 18a10.003 10.003 0 01-8.213-4.288m8.213 4.288a10 10 0 0110-10V5a2 2 0 00-2-2h-3.536a2 2 0 00-1.414.586L4 12" />
             </svg>
          </div>
          <h2 className="text-white text-lg font-black tracking-tight">{t.nfcDetected}</h2>
        </div>
        <button onClick={onClose} className="p-3 bg-white/10 rounded-full text-white transition-all active:scale-90">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center pb-20">
        {isVcard ? (
          <div className="w-full max-w-sm animate-in slide-in-from-bottom duration-700">
            <ProfileDisplay profile={data.payload} isDark={true} />
            <div className="mt-8 px-2">
               <button 
                onClick={onAction}
                className="w-full py-5 bg-emerald-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all"
              >
                {t.nfcSaveContact}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm p-10 bg-zinc-900 border border-white/10 rounded-[3rem] text-center shadow-2xl animate-in zoom-in-95 duration-500">
             <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Demande de paiement reçue</p>
             <h3 className="text-4xl font-black text-white tracking-tighter mb-8">{data.payload.amount} {data.payload.currency}</h3>
             
             <button 
              onClick={onAction}
              className="w-full py-5 bg-emerald-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
            >
              {t.payment}
            </button>
          </div>
        )}
        
        <p className="mt-12 text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em]">Protocole de lecture Nelo Sécurisé</p>
      </div>
    </div>
  );
}
