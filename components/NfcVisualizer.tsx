
import React from 'react';
import { Language } from '../translations.ts';

interface Props {
  isActive: boolean;
  mode: 'BUSINESS_CARD' | 'PAYMENT';
  lang: Language;
}

export default function NfcVisualizer({ isActive, mode, lang }: Props) {
  const getLabel = () => {
    if (isActive) {
      if (mode === 'PAYMENT') {
        return lang === 'fr' ? 'Prêt pour le paiement...' : 'Ready for payment...';
      }
      return lang === 'fr' ? 'Approchez un téléphone...' : 'Bring a phone closer...';
    }
    return lang === 'fr' ? 'Appuyez pour activer le NFC' : 'Tap to activate NFC';
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
        {/* Animated Rings */}
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 nfc-pulse"></div>
            <div className="absolute -inset-4 rounded-full border border-emerald-500/10 nfc-pulse" style={{ animationDelay: '0.5s' }}></div>
          </>
        )}
        
        {/* NFC Icon */}
        <div className={`z-10 transition-colors ${isActive ? 'text-emerald-400' : 'text-zinc-600'}`}>
          <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3m0 18a10.003 10.003 0 01-8.213-4.288m8.213 4.288a10 10 0 0110-10V5a2 2 0 00-2-2h-3.536a2 2 0 00-1.414.586L4 12" />
          </svg>
        </div>
      </div>
      
      <p className="mt-6 font-medium text-zinc-400 text-sm">
        {getLabel()}
      </p>
    </div>
  );
}
