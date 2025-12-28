
import React, { useState } from 'react';
import { Language, translations } from '../translations.ts';

interface Props {
  onClose: () => void;
  onRechargeOnline: (amount: number) => void;
  onTransferToOffline: (amount: number) => void;
  onlineBalance: number;
  offlineBalance: number;
  isDark: boolean;
  lang: Language;
}

export default function TopUpModal({ onClose, onRechargeOnline, onTransferToOffline, onlineBalance, offlineBalance, isDark, lang }: Props) {
  const [activeTab, setActiveTab] = useState<'ONLINE' | 'OFFLINE'>('ONLINE');
  const [amount, setAmount] = useState('5000');
  const [provider, setProvider] = useState<string | null>(null);
  const t = translations[lang];

  const providers = [
    { id: 'mtn', name: 'MTN', color: '#FFCC00', icon: 'M' },
    { id: 'orange', name: 'Orange', color: '#FF6600', icon: 'O' },
    { id: 'moov', name: 'Moov', color: '#0066CC', icon: 'M' },
    { id: 'wave', name: 'Wave', color: '#1BA1E2', icon: 'W' },
    { id: 'card', name: 'Carte', color: '#10b981', icon: '💳' },
  ];

  const handleOnlineRecharge = () => {
    const val = parseInt(amount);
    if (val > 0 && provider) {
      onRechargeOnline(val);
      onClose();
    }
  };

  const handleOfflineTransfer = () => {
    const val = parseInt(amount);
    const maxTransfer = Math.min(onlineBalance, 50000 - offlineBalance);
    if (val > 0 && val <= maxTransfer) {
      onTransferToOffline(val);
      onClose();
    }
  };

  const maxOfflineCanReceive = 50000 - offlineBalance;

  const glassClasses = isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5';
  const textContrast = isDark ? 'text-white' : 'text-zinc-900';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`relative w-full max-w-sm rounded-[2.5rem] p-8 border shadow-2xl animate-in zoom-in-95 duration-300 ${isDark ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-black/5 text-zinc-900'}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black uppercase tracking-tighter">{t.rechargeTitle}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex p-1 bg-black/10 rounded-2xl mb-8">
          <button 
            onClick={() => setActiveTab('ONLINE')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ONLINE' ? 'bg-emerald-500 text-white shadow-lg' : 'text-zinc-500'}`}
          >
            {t.onlineRecharge}
          </button>
          <button 
            onClick={() => setActiveTab('OFFLINE')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'OFFLINE' ? 'bg-emerald-500 text-white shadow-lg' : 'text-zinc-500'}`}
          >
            {t.offlineTopup}
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2 block">{t.amount}</label>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full p-4 rounded-2xl border text-2xl font-black focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}
            />
          </div>

          {activeTab === 'ONLINE' ? (
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-4 block">{t.selectProvider}</label>
              <div className="grid grid-cols-3 gap-3">
                {providers.map(p => (
                  <button 
                    key={p.id} 
                    onClick={() => setProvider(p.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all active:scale-95 ${provider === p.id ? 'border-emerald-500 bg-emerald-500/10' : (isDark ? 'border-white/5' : 'border-black/5')}`}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black" style={{ backgroundColor: p.color }}>
                      {p.icon}
                    </div>
                    <span className="text-[8px] font-black uppercase">{p.name}</span>
                  </button>
                ))}
              </div>
              <button 
                onClick={handleOnlineRecharge}
                disabled={!provider}
                className="w-full py-4 mt-8 rounded-2xl bg-emerald-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-30"
              >
                Payer avec {provider?.toUpperCase() || '...'}
              </button>
            </div>
          ) : (
            <div>
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase">Capacité Offline restante</span>
                  <span className="text-xs font-black text-emerald-500">{maxOfflineCanReceive.toLocaleString()} F CFA</span>
                </div>
                <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500" 
                    style={{ width: `${(offlineBalance / 50000) * 100}%` }}
                  />
                </div>
              </div>

              <button 
                onClick={handleOfflineTransfer}
                disabled={parseInt(amount) > maxOfflineCanReceive || parseInt(amount) > onlineBalance}
                className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-30"
              >
                {parseInt(amount) > maxOfflineCanReceive ? t.maxOfflineReach : t.transferBtn}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
