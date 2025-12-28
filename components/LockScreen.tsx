
import React, { useState } from 'react';

interface Props {
  onUnlock: () => void;
  isDark: boolean;
}

const LockScreen: React.FC<Props> = ({ onUnlock, isDark }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const correctPin = '5555';

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === correctPin) {
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 800);
        }
      }
    }
  };

  const clear = () => setPin('');

  return (
    <div className="fixed inset-0 z-[3000] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 backdrop-blur-[40px] bg-black/40">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-black tracking-tighter text-white mb-2">nelo</h1>
        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Appareil Verrouillé</p>
      </div>

      <div className="flex gap-4 mb-12">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
              pin.length > i 
                ? (error ? 'bg-red-500 border-red-500 scale-125' : 'bg-emerald-500 border-emerald-500 scale-110') 
                : 'border-white/30'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 w-full max-w-[280px]">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigit(digit)}
            className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-2xl font-black text-white active:bg-white/20 transition-all"
          >
            {digit}
          </button>
        ))}
        <button onClick={clear} className="w-16 h-16 rounded-full flex items-center justify-center text-[10px] font-black text-zinc-500 uppercase tracking-widest">Effacer</button>
        <button onClick={() => handleDigit('0')} className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-2xl font-black text-white active:bg-white/20 transition-all">0</button>
        <div className="w-16 h-16" />
      </div>

      <p className="mt-12 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Code par défaut: 5555</p>
    </div>
  );
};

export default LockScreen;
