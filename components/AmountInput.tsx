
import React from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  currency: string;
  isDark: boolean;
  label?: string;
}

const AmountInput: React.FC<Props> = ({ value, onChange, currency, isDark, label = "Montant personnalisé" }) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      onChange(val);
    }
  };

  const contrastText = isDark ? 'text-white' : 'text-zinc-900';

  return (
    <div className="flex flex-col items-center mb-4">
      <div className="relative group w-full max-w-[280px]">
        <input
          type="text"
          value={value}
          onChange={handleInput}
          placeholder="0"
          className={`bg-transparent text-5xl font-black tracking-tighter text-center w-full ${contrastText} focus:outline-none placeholder:opacity-10`}
          autoFocus
        />
        <div className="text-center mt-2">
           <span className="text-sm font-black text-emerald-500 uppercase tracking-widest">{currency}</span>
        </div>
      </div>
      <p className="text-zinc-500 text-[9px] uppercase font-black tracking-[0.3em] mt-4 opacity-60">{label}</p>
    </div>
  );
};

export default AmountInput;
