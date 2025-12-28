
import React from 'react';

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
  isDark: boolean;
}

const ExitConfirmationModal: React.FC<Props> = ({ onConfirm, onCancel, isDark }) => {
  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onCancel}
      />
      <div className={`relative w-full max-w-xs overflow-hidden rounded-[2.5rem] border p-8 text-center shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ${
        isDark 
          ? 'bg-zinc-900/90 border-white/10 text-white' 
          : 'bg-white/90 border-black/5 text-zinc-900'
      } backdrop-blur-2xl`}>
        
        <div className="relative z-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-500/10">
            <svg className="h-8 w-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>

          <h3 className="mb-2 text-xl font-black tracking-tight uppercase">
            Quitter Nelo ?
          </h3>
          <p className={`mb-8 text-sm font-medium opacity-60 leading-relaxed`}>
            Voulez-vous vraiment vous déconnecter ou fermer la session en cours ?
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="w-full py-4 rounded-2xl font-bold text-sm bg-red-500 text-white shadow-lg active:scale-95 transition-all"
            >
              Oui, se déconnecter
            </button>
            <button
              onClick={onCancel}
              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                isDark ? 'bg-white/5 text-white' : 'bg-zinc-100 text-zinc-900'
              }`}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmationModal;
