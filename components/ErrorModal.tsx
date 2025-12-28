
import React from 'react';

interface Props {
  message: string;
  onClose: () => void;
  onRecharge?: () => void;
  isDarkMode: boolean;
}

const ErrorModal: React.FC<Props> = ({ message, onClose, onRecharge, isDarkMode }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className={`relative w-full max-w-xs overflow-hidden rounded-[2.5rem] border p-8 text-center shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ${
        isDarkMode 
          ? 'bg-zinc-900/90 border-red-500/20 text-white' 
          : 'bg-white/90 border-red-500/10 text-zinc-900'
      } backdrop-blur-2xl`}>
        
        {/* Animated Background Glow */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />
        
        <div className="relative z-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h3 className="mb-2 text-xl font-black tracking-tight uppercase">
            Solde Insuffisant
          </h3>
          <p className={`mb-8 text-sm font-medium opacity-60 leading-relaxed`}>
            {message}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onClose}
              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-md ${
                isDarkMode 
                  ? 'bg-white/10 text-white' 
                  : 'bg-zinc-100 text-zinc-900'
              }`}
            >
              Modifier le montant
            </button>
            <button
              onClick={onRecharge}
              className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg bg-red-500 text-white"
            >
              Recharger mon compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
