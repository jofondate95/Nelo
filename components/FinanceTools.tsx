
import React, { useState } from 'react';

interface Props {
  onClose: () => void;
  isDark: boolean;
  currency: string;
}

type ToolTab = 'CALC' | 'CONV';

const FinanceTools: React.FC<Props> = ({ onClose, isDark, currency }) => {
  const [activeTool, setActiveTool] = useState<ToolTab>('CALC');
  const [isSharing, setIsSharing] = useState(false);

  // Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // Converter State
  const [convAmount, setConvAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('XOF');

  const exchangeRates: Record<string, number> = {
    'EUR': 655.957,
    'USD': 605.50,
    'XOF': 1,
    'XAF': 1,
    'GBP': 765.20,
    'JPY': 4.05
  };

  const currencies = Object.keys(exchangeRates);

  // Calculator Logic
  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setCalcDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setCalcDisplay(calcDisplay === '0' ? digit : calcDisplay + digit);
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(calcDisplay);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      let newValue = currentValue;

      switch (operator) {
        case '+': newValue = currentValue + inputValue; break;
        case '-': newValue = currentValue - inputValue; break;
        case '*': newValue = currentValue * inputValue; break;
        case '/': newValue = currentValue / inputValue; break;
      }
      setPrevValue(newValue);
      setCalcDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const clearCalc = () => {
    setCalcDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  // Converter Logic
  const getConvertedAmount = () => {
    const amount = parseFloat(convAmount) || 0;
    const rateFrom = exchangeRates[fromCurrency];
    const rateTo = exchangeRates[toCurrency];
    const result = (amount * rateFrom) / rateTo;
    return result.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
  };

  const handleShare = () => {
    setIsSharing(true);
    // Simulate screenshot processing
    setTimeout(() => {
      // Logic for sharing would go here
    }, 1000);
  };

  const glassBtn = isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-zinc-900';

  return (
    <div className={`fixed inset-0 z-[150] flex flex-col animate-in fade-in slide-in-from-bottom duration-300 ${isDark ? 'bg-black/90' : 'bg-zinc-50/95'} backdrop-blur-2xl`}>
      <div className={`p-6 pt-12 flex justify-between items-center border-b ${isDark ? 'border-white/10' : 'border-black/5'}`}>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTool('CALC')}
            className={`text-sm font-black uppercase tracking-tighter transition-all ${activeTool === 'CALC' ? 'text-emerald-500 scale-110' : 'text-zinc-500'}`}
          >
            Calculatrice
          </button>
          <button 
            onClick={() => setActiveTool('CONV')}
            className={`text-sm font-black uppercase tracking-tighter transition-all ${activeTool === 'CONV' ? 'text-emerald-500 scale-110' : 'text-zinc-500'}`}
          >
            Convertisseur
          </button>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center">
        {activeTool === 'CALC' ? (
          <div className="w-full max-w-xs mx-auto space-y-4 animate-in fade-in zoom-in duration-300">
            <div className={`p-6 rounded-[2rem] text-right border ${isDark ? 'bg-black/40 border-white/5' : 'bg-white border-black/5 shadow-inner'}`}>
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 h-4">
                {prevValue !== null ? `${prevValue} ${operator || ''}` : ''}
              </div>
              <div className={`text-4xl font-black tracking-tighter truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {calcDisplay}
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {['7', '8', '9', '/'].map(btn => (
                <button key={btn} onClick={() => btn === '/' ? performOperation('/') : inputDigit(btn)} className={`h-16 rounded-2xl font-black text-lg border transition-all active:scale-90 ${btn === '/' ? 'bg-emerald-500 text-white border-transparent' : glassBtn}`}>
                  {btn === '/' ? '÷' : btn}
                </button>
              ))}
              {['4', '5', '6', '*'].map(btn => (
                <button key={btn} onClick={() => btn === '*' ? performOperation('*') : inputDigit(btn)} className={`h-16 rounded-2xl font-black text-lg border transition-all active:scale-90 ${btn === '*' ? 'bg-emerald-500 text-white border-transparent' : glassBtn}`}>
                  {btn === '*' ? '×' : btn}
                </button>
              ))}
              {['1', '2', '3', '-'].map(btn => (
                <button key={btn} onClick={() => btn === '-' ? performOperation('-') : inputDigit(btn)} className={`h-16 rounded-2xl font-black text-lg border transition-all active:scale-90 ${btn === '-' ? 'bg-emerald-500 text-white border-transparent' : glassBtn}`}>
                  {btn}
                </button>
              ))}
              {['0', 'C', '=', '+'].map(btn => (
                <button key={btn} onClick={() => {
                  if (btn === 'C') clearCalc();
                  else if (btn === '=') performOperation('=');
                  else if (btn === '+') performOperation('+');
                  else inputDigit('0');
                }} className={`h-16 rounded-2xl font-black text-lg border transition-all active:scale-90 ${btn === '=' || btn === '+' ? 'bg-emerald-500 text-white border-transparent' : (btn === 'C' ? 'bg-red-500/10 text-red-500 border-red-500/20' : glassBtn)}`}>
                  {btn}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <h3 className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>Simulateur de Change</h3>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-2">Taux du Marché Temps Réel (Simulé)</p>
            </div>

            <div id="converter-capture-area" className="space-y-4">
              <div className={`p-6 rounded-[2.5rem] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">Montant à convertir</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="number" 
                    value={convAmount} 
                    onChange={(e) => setConvAmount(e.target.value)}
                    className={`flex-1 bg-transparent text-3xl font-black tracking-tighter focus:outline-none ${isDark ? 'text-white' : 'text-zinc-900'}`}
                  />
                  <select 
                    value={fromCurrency} 
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className={`p-3 rounded-xl font-black text-xs uppercase tracking-widest focus:outline-none ${glassBtn}`}
                  >
                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-center -my-4 relative z-10">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                </div>
              </div>

              <div className={`p-6 rounded-[2.5rem] border ${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-200 shadow-sm'}`}>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Résultat Estimé</label>
                  <select 
                    value={toCurrency} 
                    onChange={(e) => setToCurrency(e.target.value)}
                    className={`p-3 rounded-xl font-black text-xs uppercase tracking-widest focus:outline-none ${glassBtn}`}
                  >
                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="text-3xl font-black tracking-tighter text-emerald-500">
                  {getConvertedAmount()} <span className="text-sm opacity-60 ml-1">{toCurrency}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleShare}
              className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              Partager Capture d'écran
            </button>
          </div>
        )}
      </div>

      {isSharing && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className={`relative w-full max-w-xs rounded-[2.5rem] p-8 border shadow-2xl animate-in zoom-in-95 duration-300 ${isDark ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-black/5 text-zinc-900'}`}>
              <h4 className="text-lg font-black uppercase tracking-tighter mb-4">Capture prête !</h4>
              <p className="text-xs opacity-60 mb-8 font-medium">Votre simulation de change a été capturée. Partagez-la maintenant :</p>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                {['WhatsApp', 'Insta', 'LinkedIn'].map(social => (
                  <button key={social} onClick={() => setIsSharing(false)} className={`flex flex-col items-center gap-2 p-3 rounded-2xl ${glassBtn}`}>
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    </div>
                    <span className="text-[8px] font-black uppercase">{social}</span>
                  </button>
                ))}
              </div>

              <button onClick={() => setIsSharing(false)} className="w-full py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-emerald-500 text-white">Fermer</button>
           </div>
        </div>
      )}

      <div className="p-12 text-center">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Nelo Financial Tools v1.0</p>
      </div>
    </div>
  );
};

export default FinanceTools;
