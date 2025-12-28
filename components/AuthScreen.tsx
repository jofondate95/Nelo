
import React, { useState } from 'react';
import { Language, translations } from '../translations.ts';

interface Props {
  onAuthenticated: (phoneNumber: string, pin: string) => void;
  isRegistered: boolean;
  storedPin?: string;
  isDark: boolean;
  lang: Language;
}

type AuthStep = 'CHOICE' | 'PHONE' | 'CODE' | 'PIN_SETUP' | 'PIN_ENTRY';

export default function AuthScreen({ onAuthenticated, isRegistered, storedPin, isDark, lang }: Props) {
  // Si déjà enregistré, on va direct au PIN, sinon on propose le choix
  const [step, setStep] = useState<AuthStep>(isRegistered ? 'PIN_ENTRY' : 'CHOICE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  
  const t = translations[lang];

  const handlePhoneSubmit = () => {
    if (phoneNumber.length >= 8) {
      setStep('CODE');
    }
  };

  const handleCodeSubmit = () => {
    if (code === '1234') { // Mock OTP
      setStep('PIN_SETUP');
    } else {
      setError('Code invalide (utilisez 1234)');
    }
  };

  const handlePinSetup = () => {
    if (pin.length === 4 && pin === confirmPin) {
      onAuthenticated(phoneNumber, pin);
    } else if (pin !== confirmPin) {
      setError('Les codes ne correspondent pas');
    }
  };

  const handlePinEntry = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        // En mode démo, si pas encore enregistré, n'importe quel code 4 chiffres marche ou on définit un code par défaut
        // Mais l'utilisateur demande : "S'il clic sur connecté juste le code qu'il met et avance"
        // On va autoriser l'accès si le PIN match ou si on est en "connexion libre" démo
        if (isRegistered) {
           if (newPin === storedPin) {
             onAuthenticated('', newPin);
           } else {
             setError(t.authWrongPin);
             setTimeout(() => {
               setPin('');
               setError('');
             }, 1000);
           }
        } else {
           // Si pas encore enregistré mais qu'il a choisi "Se connecter" (cas particulier démo)
           // On peut imaginer qu'il se connecte à un compte existant non stocké localement
           onAuthenticated('Session Invité', newPin);
        }
      }
    }
  };

  const clearPin = () => setPin('');

  const renderChoiceStep = () => (
    <div className="space-y-12 animate-in fade-in zoom-in duration-500 text-center">
      <div>
        <h1 className="text-6xl font-black tracking-tighter mb-4">nelo</h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] opacity-60">Bienvenue sur votre Wallet NFC</p>
      </div>

      <div className="space-y-4 w-full">
        <button 
          onClick={() => setStep('PHONE')}
          className="w-full py-6 rounded-[2rem] bg-emerald-500 text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all"
        >
          S'inscrire
        </button>
        <button 
          onClick={() => setStep('PIN_ENTRY')}
          className={`w-full py-6 rounded-[2rem] border font-black text-sm uppercase tracking-widest active:scale-95 transition-all ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-black/10 text-zinc-900'}`}
        >
          Se connecter
        </button>
      </div>
      
      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest opacity-40">Sécurisé par protocole Nelo ISO-7816</p>
    </div>
  );

  const renderPhoneStep = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
      <button onClick={() => setStep('CHOICE')} className="p-2 text-zinc-500 hover:text-white transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <div className="text-center">
        <h2 className="text-2xl font-black tracking-tight">{t.authPhone}</h2>
        <p className="text-zinc-500 text-sm mt-2 opacity-60">Utilisez votre mobile pour vous identifier</p>
      </div>
      <div className="relative">
        <input 
          type="tel" 
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+221 ..."
          className={`w-full p-6 rounded-[2rem] border text-xl font-black text-center focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}
        />
      </div>
      <button 
        onClick={handlePhoneSubmit}
        disabled={phoneNumber.length < 8}
        className="w-full py-5 rounded-[2rem] bg-emerald-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-30"
      >
        {t.authContinue}
      </button>
    </div>
  );

  const renderCodeStep = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-black tracking-tight">{t.authCode}</h2>
        <p className="text-zinc-500 text-sm mt-2 opacity-60">{t.authSmsSent} {phoneNumber}</p>
      </div>
      <div className="flex justify-center gap-3">
        {[0, 1, 2, 3].map((i) => (
          <input 
            key={i}
            type="text"
            maxLength={1}
            value={code[i] || ''}
            onChange={(e) => setCode(prev => prev + e.target.value)}
            className={`w-14 h-20 rounded-2xl border text-3xl font-black text-center focus:outline-none ${isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-center text-xs font-bold">{error}</p>}
      <button 
        onClick={handleCodeSubmit}
        className="w-full py-5 rounded-[2rem] bg-emerald-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
      >
        {t.authVerify}
      </button>
      <p className="text-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Test: Utilisez 1234</p>
    </div>
  );

  const renderPinSetup = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-black tracking-tight">{t.authPinSetup}</h2>
        <p className="text-zinc-500 text-sm mt-2 opacity-60">Sécurisez votre compte Nelo</p>
      </div>
      <div className="space-y-4">
        <input 
          type="password" 
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="PIN (4 chiffres)"
          className={`w-full p-5 rounded-2xl border text-center text-2xl font-black tracking-[1em] focus:outline-none ${isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}
        />
        <input 
          type="password" 
          maxLength={4}
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value)}
          placeholder="Confirmer PIN"
          className={`w-full p-5 rounded-2xl border text-center text-2xl font-black tracking-[1em] focus:outline-none ${isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}
        />
      </div>
      {error && <p className="text-red-500 text-center text-xs font-bold">{error}</p>}
      <button 
        onClick={handlePinSetup}
        disabled={pin.length !== 4 || pin !== confirmPin}
        className="w-full py-5 rounded-[2rem] bg-emerald-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-30"
      >
        Finaliser l'inscription
      </button>
    </div>
  );

  const renderPinEntry = () => (
    <div className="space-y-12 animate-in fade-in zoom-in duration-500">
      {!isRegistered && (
        <button onClick={() => setStep('CHOICE')} className="p-2 text-zinc-500 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
      )}
      <div className="text-center">
        <h1 className="text-4xl font-black tracking-tighter mb-4">nelo</h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">{t.authPinEntry}</p>
      </div>

      <div className="flex gap-4 justify-center">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
              pin.length > i 
                ? (error ? 'bg-red-500 border-red-500 animate-shake' : 'bg-emerald-500 border-emerald-500 scale-125') 
                : (isDark ? 'border-white/20' : 'border-black/10')
            }`}
          />
        ))}
      </div>

      {error && <p className="text-red-500 text-center text-[10px] font-black uppercase tracking-widest animate-pulse">{error}</p>}

      <div className="grid grid-cols-3 gap-6 w-full max-w-[280px] mx-auto">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            onClick={() => handlePinEntry(digit)}
            className={`w-16 h-16 rounded-full border flex items-center justify-center text-2xl font-black active:scale-90 transition-all ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-black/5 text-zinc-900'}`}
          >
            {digit}
          </button>
        ))}
        <button onClick={clearPin} className="w-16 h-16 rounded-full flex items-center justify-center text-[10px] font-black text-zinc-500 uppercase tracking-widest">Effacer</button>
        <button onClick={() => handlePinEntry('0')} className={`w-16 h-16 rounded-full border flex items-center justify-center text-2xl font-black active:scale-90 transition-all ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-black/5 text-zinc-900'}`}>0</button>
      </div>
      
      {isRegistered && (
        <p className="text-center text-[9px] font-bold text-zinc-500 uppercase tracking-widest opacity-40">Compte sécurisé lié au {profilePhoneSuffix()}</p>
      )}
    </div>
  );

  const profilePhoneSuffix = () => {
    // Petit utilitaire pour afficher la fin du numéro si existant
    return "...";
  }

  return (
    <div className={`fixed inset-0 z-[2000] flex flex-col items-center justify-center p-8 backdrop-blur-[60px] ${isDark ? 'bg-black/80' : 'bg-white/90'}`}>
      <div className="w-full max-w-sm">
        {step === 'CHOICE' && renderChoiceStep()}
        {step === 'PHONE' && renderPhoneStep()}
        {step === 'CODE' && renderCodeStep()}
        {step === 'PIN_SETUP' && renderPinSetup()}
        {step === 'PIN_ENTRY' && renderPinEntry()}
      </div>
    </div>
  );
}
