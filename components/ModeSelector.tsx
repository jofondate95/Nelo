
import React from 'react';
import { AppMode } from '../types';

interface Props {
  mode: AppMode;
  onChange: (mode: AppMode) => void;
  labels?: [string, string];
}

const ModeSelector: React.FC<Props> = ({ mode, onChange, labels = ["Carte Pro", "Paiement"] }) => {
  return (
    <div className="p-1 glass rounded-2xl flex border border-white/5 shadow-inner">
      <button 
        onClick={() => onChange(AppMode.BUSINESS_CARD)}
        className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === AppMode.BUSINESS_CARD ? 'bg-white text-black shadow-lg' : 'text-zinc-500'}`}
      >
        {labels[0]}
      </button>
      <button 
        onClick={() => onChange(AppMode.PAYMENT)}
        className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === AppMode.PAYMENT ? 'bg-white text-black shadow-lg' : 'text-zinc-500'}`}
      >
        {labels[1]}
      </button>
    </div>
  );
};

export default ModeSelector;
