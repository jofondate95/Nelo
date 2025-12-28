
import React from 'react';

interface Props {
  type: 'PAYMENT' | 'PROFILE';
  message: string;
  onClose: () => void;
  isDarkMode: boolean;
}

const SuccessModal: React.FC<Props> = ({ type, message, onClose, isDarkMode }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className={`relative w-full max-w-xs overflow-hidden rounded-[2.5rem] border p-8 text-center shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ${
        isDarkMode 
          ? 'bg-zinc-900/80 border-white/10 text-white' 
          : 'bg-white/80 border-black/5 text-zinc-900'
      } backdrop-blur-2xl`}>
        
        {/* Animated Background Glow */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />
        
        <div className="relative z-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
            {type === 'PAYMENT' ? (
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )}
          </div>

          <h3 className="mb-2 text-xl font-black tracking-tight uppercase">
            {type === 'PAYMENT' ? 'Paiement Validé' : 'Carte Envoyée'}
          </h3>
          <p className={`mb-8 text-sm font-medium opacity-60 leading-relaxed`}>
            {message}
          </p>

          <button
            onClick={onClose}
            className={`w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg ${
              isDarkMode 
                ? 'bg-white text-black' 
                : 'bg-zinc-900 text-white'
            }`}
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
