
import React, { useState, useEffect, useRef } from 'react';
import { AppMode, AppTab, AppTheme, UserProfile, LogEntry, Note } from './types.ts';
import { nfcService } from './services/nfcService.ts';
import { walletService } from './services/walletService.ts';
import { storageService } from './services/storageService.ts';
import { translations, Language } from './translations.ts';
import { FINANCIAL_JARGON } from './constants.ts';
import NfcVisualizer from './components/NfcVisualizer.tsx';
import ModeSelector from './components/ModeSelector.tsx';
import ProfileEditor from './components/ProfileEditor.tsx';
import BottomTabs from './components/BottomTabs.tsx';
import AmountInput from './components/AmountInput.tsx';
import SuccessModal from './components/SuccessModal.tsx';
import ErrorModal from './components/ErrorModal.tsx';
import CardPreview from './components/CardPreview.tsx';
import AiChat from './components/AiChat.tsx';
import NotificationsCenter from './components/NotificationsCenter.tsx';
import OnboardingTour from './components/OnboardingTour.tsx';
import SplashScreen from './components/SplashScreen.tsx';
import ExitConfirmationModal from './components/ExitConfirmationModal.tsx';
import FinanceTools from './components/FinanceTools.tsx';
import WordShareModal from './components/WordShareModal.tsx';
import TopUpModal from './components/TopUpModal.tsx';
import AuthScreen from './components/AuthScreen.tsx';
import NfcDetectionModal from './components/NfcDetectionModal.tsx';
import ProfileDisplay from './components/ProfileDisplay.tsx';
import JargonCarousel from './components/JargonCarousel.tsx';

const App: React.FC = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.WALLET);
  const [mode, setMode] = useState<AppMode>(AppMode.BUSINESS_CARD);
  const [theme, setTheme] = useState<AppTheme>(AppTheme.DARK);
  const [lang, setLang] = useState<Language>('fr');
  const [isActive, setIsActive] = useState(false);
  
  const [onlineBalance, setOnlineBalance] = useState(0);
  const [offlineBalance, setOfflineBalance] = useState(0);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [txAmount, setTxAmount] = useState('10000');
  const [isWordSharing, setIsWordSharing] = useState(false);
  const [wordToShare, setWordToShare] = useState<{term: string, def: string} | null>(null);

  // NFC Detection State
  const [detectedNfc, setDetectedNfc] = useState<any | null>(null);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState<'PAYMENT' | 'PROFILE'>('PAYMENT');
  const [successMsg, setSuccessMsg] = useState('');

  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [flashActive, setFlashActive] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    fullName: "Alex Nelo",
    title: "Expert Lead Fintech",
    company: "Nelo Financial Systems",
    email: "alex@nelo.io",
    phone: "+221 77 123 45 67",
    website: "https://nelo.io",
    socialLinks: [
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/nelo' },
      { platform: 'WhatsApp', url: '+221771234567' }
    ],
    onlineBalance: 450000,
    offlineBalance: 50000,
    currency: "F CFA",
    cardStyle: {
      primaryColor: "#10b981",
      borderRadius: 'rounded-xl'
    },
    settings: {
      soundEnabled: true,
      flashEnabled: true,
      hasCompletedTour: false,
      isRegistered: false
    },
    bio: "Passionate about building secure and seamless financial experiences."
  });

  const isDark = theme === AppTheme.DARK;
  const t = translations[lang];

  // Logic to get jargon history (past days only)
  const getJargonHistory = () => {
    const start = new Date(new Date().getFullYear(), 0, 0);
    const diff = new Date().getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Limit to the last 7 available words or however many past days we want to show
    const historyLimit = 7; 
    const history = [];
    
    for (let i = 0; i < historyLimit; i++) {
      const dayIndex = dayOfYear - (historyLimit - 1 - i);
      if (dayIndex >= 0) {
        history.push(FINANCIAL_JARGON[dayIndex % FINANCIAL_JARGON.length]);
      }
    }
    return history;
  };

  const jargonHistory = getJargonHistory();

  useEffect(() => {
    const initApp = async () => {
      setLogs(storageService.getLogs());
      
      const savedProfile = storageService.getProfile();
      if (savedProfile) {
        setProfile(savedProfile);
        setOnlineBalance(savedProfile.onlineBalance);
        setOfflineBalance(savedProfile.offlineBalance);
      } else {
        setOnlineBalance(profile.onlineBalance);
        setOfflineBalance(profile.offlineBalance);
      }

      const savedTheme = storageService.get<AppTheme>('app_theme');
      if (savedTheme) {
        setTheme(savedTheme);
      }

      const savedLang = storageService.get<Language>('app_lang');
      if (savedLang) {
        setLang(savedLang);
      }

      await new Promise(resolve => setTimeout(resolve, 2500));
      setIsAppReady(true);
    };

    initApp();

    const nfcTimer = setTimeout(() => {
      if (isAuthenticated && !detectedNfc) {
        handleNfcDetected({
          type: 'VCARD',
          payload: {
            fullName: "Sarah Diallo",
            title: "Architecte Logiciel",
            email: "sarah@diallo.dev",
            phone: "+221 70 888 99 00",
            company: "TechSenegal",
            bio: "Building the future of African web.",
            socialLinks: [{ platform: 'LinkedIn', url: '#' }],
            cardStyle: { primaryColor: '#8b5cf6', borderRadius: 'rounded-xl' }
          }
        });
      }
    }, 15000);

    return () => clearTimeout(nfcTimer);
  }, [isAuthenticated]);

  const handleAuthenticated = (phone: string, pin: string) => {
    const updatedProfile = {
      ...profile,
      phone: phone || profile.phone,
      settings: {
        ...profile.settings,
        isRegistered: true,
        hashedPin: pin,
        phoneNumber: phone || profile.settings.phoneNumber
      }
    };
    setProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);
    setIsAuthenticated(true);
    
    if (!updatedProfile.settings.hasCompletedTour) {
      setShowTour(true);
    }
  };

  const handleNfcDetected = (data: any) => {
    playSignalSound(true);
    triggerVisualFlash();
    setDetectedNfc(data);
  };

  const completeTour = () => {
    const updatedProfile = {
      ...profile,
      settings: { ...profile.settings, hasCompletedTour: true }
    };
    setProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);
    setShowTour(false);
  };

  const toggleTheme = () => {
    const nextTheme = isDark ? AppTheme.LIGHT : AppTheme.DARK;
    setTheme(nextTheme);
    storageService.set('app_theme', nextTheme);
  };

  const toggleLang = () => {
    const nextLang = lang === 'fr' ? 'en' : 'fr';
    setLang(nextLang);
    storageService.set('app_lang', nextLang);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);
    setIsEditingProfile(false);
    setStatus(lang === 'fr' ? "Profil mis à jour" : "Profile updated");
    setTimeout(() => setStatus(null), 3000);
  };

  const handleOnlineRecharge = (amount: number) => {
    const newBal = onlineBalance + amount;
    setOnlineBalance(newBal);
    const updated = { ...profile, onlineBalance: newBal, offlineBalance };
    setProfile(updated);
    storageService.saveProfile(updated);
    storageService.addLog({
      id: `rech_${Date.now()}`,
      type: 'RECHARGE',
      status: 'SUCCESS',
      amount,
      currency: profile.currency,
      timestamp: Date.now()
    });
    setLogs(storageService.getLogs());
    triggerSuccess('PROFILE', `Compte rechargé de ${amount.toLocaleString()} ${profile.currency}`);
  };

  const handleTransferToOffline = (amount: number) => {
    if (onlineBalance < amount) return;
    const newOffline = offlineBalance + amount;
    const newOnline = onlineBalance - amount;
    setOnlineBalance(newOnline);
    setOfflineBalance(newOffline);
    const updated = { ...profile, onlineBalance: newOnline, offlineBalance: newOffline };
    setProfile(updated);
    storageService.saveProfile(updated);
    setStatus(lang === 'fr' ? "Transfert Offline réussi" : "Offline top-up success");
    setTimeout(() => setStatus(null), 3000);
  };

  const playSignalSound = (isAlert = false) => {
    if (!profile.settings.soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = isAlert ? 'square' : 'sine';
      oscillator.frequency.setValueAtTime(isAlert ? 440 : 880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + (isAlert ? 1.5 : 0.5));
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + (isAlert ? 1.5 : 0.5));
    } catch (e) {
      console.warn("Audio Context failed", e);
    }
  };

  const triggerVisualFlash = () => {
    if (!profile.settings.flashEnabled) return;
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);
  };

  const triggerSuccess = (type: 'PAYMENT' | 'PROFILE', msg: string) => {
    playSignalSound();
    triggerVisualFlash();
    setSuccessType(type);
    setSuccessMsg(msg);
    setShowSuccess(true);
  };

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setShowError(true);
  };

  const handleNfcAction = async () => {
    if (isActive) {
      setIsActive(false);
      return;
    }

    setIsActive(true);
    setStatus(null);

    try {
      if (mode === AppMode.BUSINESS_CARD) {
        await nfcService.writeVCard(profile);
        storageService.addLog({
          id: Date.now().toString(),
          type: 'PROFILE_SHARE',
          status: 'SUCCESS',
          timestamp: Date.now(),
          metadata: { ...profile }
        });
        triggerSuccess('PROFILE', lang === 'fr' ? "Votre carte de visite personnalisée a été transmise avec succès." : "Your custom business card was successfully shared.");
      } else {
        const amount = parseFloat(txAmount) || 0;
        if (amount <= 0) {
          setStatus(lang === 'fr' ? "Montant invalide" : "Invalid amount");
          setIsActive(false);
          return;
        }

        if (offlineBalance < amount) {
          triggerError(lang === 'fr' ? `Solde Offline insuffisant (${offlineBalance.toLocaleString()} ${profile.currency}).` : `Insufficient Offline balance (${offlineBalance.toLocaleString()} ${profile.currency}).`);
          setIsActive(false);
          return;
        }
        
        const signedTx = await walletService.signTransaction(amount);
        const result = await nfcService.executeSecurePayment(signedTx);
        
        if (result.success) {
          const newOffline = offlineBalance - amount;
          setOfflineBalance(newOffline);
          const updated = { ...profile, offlineBalance: newOffline, onlineBalance };
          setProfile(updated);
          storageService.saveProfile(updated);
          
          storageService.addLog({
            id: signedTx.id,
            type: 'PAYMENT',
            status: 'SUCCESS',
            amount,
            currency: profile.currency,
            timestamp: Date.now()
          });
          triggerSuccess('PAYMENT', lang === 'fr' ? `Paiement de ${amount.toLocaleString()} ${profile.currency} effectué.` : `Payment of ${amount.toLocaleString()} ${profile.currency} completed.`);
        }
      }
    } catch (err) {
      setStatus(lang === 'fr' ? "Erreur NFC" : "NFC Error");
    } finally {
      setIsActive(false);
      setLogs(storageService.getLogs());
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const toggleSetting = (key: keyof typeof profile.settings) => {
    const updatedProfile = {
      ...profile,
      settings: { ...profile.settings, [key]: !profile.settings[key as keyof typeof profile.settings] }
    };
    handleUpdateProfile(updatedProfile);
  };

  const handleExitApp = () => {
    setIsAuthenticated(false);
    setShowExitConfirmation(false);
  };

  const themeClasses = isDark 
    ? 'bg-[#0a0a0a] text-white' 
    : 'bg-[#fcfcfc] text-zinc-900';

  const glassClasses = isDark
    ? 'bg-white/5 border-white/10'
    : 'bg-black/5 border-black/5 shadow-sm';

  const contrastText = isDark ? 'text-white' : 'text-zinc-900';
  const mutedText = isDark ? 'text-zinc-500' : 'text-zinc-400';

  if (!isAppReady) {
    return <SplashScreen isDark={isDark} />;
  }

  if (!isAuthenticated) {
    return (
      <AuthScreen 
        isRegistered={profile.settings.isRegistered}
        storedPin={profile.settings.hashedPin}
        onAuthenticated={handleAuthenticated}
        isDark={isDark}
        lang={lang}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.WALLET:
        return (
          <div className="flex-1 flex flex-col pt-4 overflow-y-auto pb-32 custom-scrollbar">
            <div className="px-6 mb-4" id="header">
              <div className={`glass rounded-[2.5rem] p-6 relative overflow-hidden transition-all duration-500 ${glassClasses}`}>
                <div className="relative z-10 space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className={`${mutedText} text-[8px] font-black uppercase tracking-[0.2em]`}>{t.balanceOnline}</p>
                      <button onClick={() => setIsTopUpOpen(true)} className="px-3 py-1 bg-emerald-500 rounded-lg text-[8px] font-black uppercase text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                        {t.recharge}
                      </button>
                    </div>
                    <div className="flex items-baseline gap-2">
                       <h2 className={`text-3xl font-black tracking-tighter mono ${contrastText}`}>
                        {isBalanceVisible ? onlineBalance.toLocaleString('fr-FR') : '••••••'}
                      </h2>
                      <span className="text-sm font-bold opacity-60">{profile.currency}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center mb-1">
                      <p className={`${mutedText} text-[8px] font-black uppercase tracking-[0.2em]`}>{t.balanceOffline}</p>
                      <button onClick={() => setIsTopUpOpen(true)} className="px-3 py-1 bg-white/10 rounded-lg text-[8px] font-black uppercase text-emerald-500 border border-emerald-500/20 active:scale-95 transition-all">
                        {t.transfer}
                      </button>
                    </div>
                    <div className="flex items-baseline gap-2">
                       <h2 className="text-2xl font-black tracking-tighter mono text-emerald-500">
                        {isBalanceVisible ? offlineBalance.toLocaleString('fr-FR') : '••••••'}
                      </h2>
                      <span className="text-sm font-bold text-emerald-500/60">{profile.currency}</span>
                    </div>
                    <div className="mt-2 w-full h-1 bg-black/20 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${(offlineBalance / 50000) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 space-y-8 flex-1 flex flex-col justify-center">
              <div id="mode-switcher">
                <ModeSelector mode={mode} onChange={setMode} labels={[t.cardPro, t.payment]} />
              </div>
              
              {mode === AppMode.PAYMENT && (
                <AmountInput value={txAmount} onChange={setTxAmount} currency={profile.currency} isDark={isDark} label={t.amount} />
              )}

              <div onClick={handleNfcAction} className="cursor-pointer" id="nfc-viz">
                <NfcVisualizer isActive={isActive} mode={mode} lang={lang} />
              </div>

              {status && (
                <div className="text-center p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-widest animate-bounce">
                  {status}
                </div>
              )}
            </div>
          </div>
        );

      case AppTab.HISTORY:
        return (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto pb-32 animate-in slide-in-from-right duration-300 custom-scrollbar">
            <h2 className={`text-2xl font-black mb-6 tracking-tight ${contrastText}`}>{t.activity}</h2>
            
            <JargonCarousel 
              items={jargonHistory} 
              isDark={isDark} 
              lang={lang}
              onShare={(word) => {
                setWordToShare(word);
                setIsWordSharing(true);
              }} 
            />

            <div className="space-y-4">
              {logs.length === 0 ? (
                <div className="text-center py-24">
                  <p className="text-zinc-500 text-sm font-medium">{lang === 'fr' ? 'Historique vide' : 'History empty'}</p>
                </div>
              ) : (
                logs.map(log => (
                  <div 
                    key={log.id} 
                    onClick={() => {
                      if (log.type === 'NFC_RECEIVE' || log.type === 'PROFILE_SHARE') {
                        setSelectedLog(log);
                      }
                    }}
                    className={`flex items-center justify-between p-5 glass rounded-3xl border transition-all active:scale-[0.98] cursor-pointer ${glassClasses}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${
                        log.type === 'PAYMENT' ? 'bg-orange-500/10 text-orange-500' : 
                        (log.type === 'RECHARGE' ? 'bg-emerald-500/10 text-emerald-500' : 
                        (log.type === 'NFC_RECEIVE' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'))}`}>
                        {log.type === 'PAYMENT' ? '💳' : (log.type === 'RECHARGE' ? '⚡' : (log.type === 'NFC_RECEIVE' ? '📡' : '🤝'))}
                      </div>
                      <div>
                        <p className={`font-black uppercase text-[10px] tracking-widest ${contrastText}`}>
                          {log.type === 'PAYMENT' ? t.payment : (log.type === 'RECHARGE' ? t.recharge : (log.type === 'NFC_RECEIVE' ? 'Reçu via NFC' : 'Carte Envoyée'))}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-bold mt-0.5">{new Date(log.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {log.amount && (
                        <p className={`font-black text-sm ${log.type === 'RECHARGE' ? 'text-emerald-500' : contrastText}`}>
                          {log.type === 'RECHARGE' ? '+' : '-'}{log.amount.toLocaleString()} {log.currency}
                        </p>
                      )}
                      {log.type === 'NFC_RECEIVE' && <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{log.metadata?.fullName}</p>}
                      {log.type === 'PROFILE_SHARE' && <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Partagé</p>}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Detailed Log Modal for Profiles */}
            {selectedLog && (
              <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
                <div className="w-full max-w-sm flex flex-col gap-6">
                  <div className="flex justify-between items-center text-white">
                    <h2 className="font-black uppercase tracking-widest text-sm">Détails de l'échange</h2>
                    <button onClick={() => setSelectedLog(null)} className="p-2 bg-white/10 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                  <ProfileDisplay profile={selectedLog.metadata} isDark={true} />
                </div>
              </div>
            )}
          </div>
        );

      case AppTab.PREVIEW:
        return <CardPreview profile={profile} isDark={isDark} />;

      case AppTab.SETTINGS:
        return (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto pb-32 animate-in slide-in-from-right duration-300 custom-scrollbar">
            <h2 className={`text-2xl font-black mb-6 tracking-tight ${contrastText}`}>{t.settings}</h2>
            
            <div className={`glass rounded-[2.5rem] p-8 mb-8 border text-center relative overflow-hidden transition-all ${glassClasses}`}>
              <div 
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl overflow-hidden bg-cover bg-center`}
                style={{ 
                  backgroundColor: profile.cardStyle.primaryColor,
                  backgroundImage: profile.profileImage ? `url(${profile.profileImage})` : 'none'
                }}
              >
                 {!profile.profileImage && <span className="text-white text-4xl font-black">{profile.fullName.charAt(0)}</span>}
              </div>
              <h3 className={`text-2xl font-black uppercase tracking-tighter ${contrastText}`}>{profile.fullName}</h3>
              <p className="text-zinc-500 text-xs font-bold mt-1 tracking-wide">{profile.title} @ {profile.company}</p>
              
              <button 
                onClick={() => setIsEditingProfile(true)}
                className={`mt-8 w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 shadow-lg ${
                  isDark ? 'bg-white text-black' : 'bg-zinc-900 text-white'
                }`}
              >
                {t.editProfile}
              </button>
            </div>

            <div className="space-y-6">
              <div className={`p-6 glass rounded-[2rem] border transition-all ${glassClasses}`}>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-60">{lang === 'fr' ? 'Préférences Apparence' : 'Appearance Preferences'}</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-black uppercase tracking-widest ${contrastText}`}>{t.darkMode}</span>
                    <button onClick={toggleTheme} className={`w-14 h-7 rounded-full p-1 transition-all ${isDark ? 'bg-emerald-500' : 'bg-zinc-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${isDark ? 'translate-x-7' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/5 pt-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                      <span className={`text-sm font-black uppercase tracking-widest ${contrastText}`}>{t.lang}</span>
                    </div>
                    <button onClick={toggleLang} className={`flex items-center gap-2 py-2 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isDark ? 'bg-white/10 text-emerald-500' : 'bg-black/5 text-emerald-600'}`}>
                       {lang === 'fr' ? 'FR' : 'EN'}
                    </button>
                  </div>
                </div>
              </div>

              <div className={`p-6 glass rounded-[2rem] border transition-all ${glassClasses}`}>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-60">Signaux NFC</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-black uppercase tracking-widest ${contrastText}`}>{t.soundEffects}</span>
                    <button onClick={() => toggleSetting('soundEnabled')} className={`w-14 h-7 rounded-full p-1 transition-all ${profile.settings.soundEnabled ? 'bg-emerald-500' : 'bg-zinc-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${profile.settings.soundEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/5 pt-4">
                    <span className={`text-sm font-black uppercase tracking-widest ${contrastText}`}>{t.flashLed}</span>
                    <button onClick={() => toggleSetting('flashEnabled')} className={`w-14 h-7 rounded-full p-1 transition-all ${profile.settings.flashEnabled ? 'bg-emerald-500' : 'bg-zinc-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${profile.settings.flashEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => setShowExitConfirmation(true)}
                  className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] text-red-500 border border-red-500/20 bg-red-500/5 transition-all active:scale-95"
                >
                  {t.logout}
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`mobile-shell flex flex-col h-screen overflow-hidden transition-colors duration-700 ${themeClasses}`}>
      {flashActive && <div className="fixed inset-0 z-[1000] bg-white pointer-events-none animate-pulse" />}
      
      {showTour && <OnboardingTour isDark={isDark} onComplete={completeTour} lang={lang} onToggleLang={toggleLang} />}

      {isEditingProfile && (
        <ProfileEditor 
          profile={profile} 
          onSave={handleUpdateProfile} 
          onCancel={() => setIsEditingProfile(false)} 
          isDark={isDark}
        />
      )}

      {isChatOpen && (
        <AiChat 
          onClose={() => setIsChatOpen(false)} 
          isDark={isDark}
        />
      )}

      {isNotificationsOpen && (
        <NotificationsCenter
          onClose={() => setIsNotificationsOpen(false)}
          isDark={isDark}
          onReminderAlert={() => playSignalSound(true)}
        />
      )}

      {isToolsOpen && (
        <FinanceTools 
          onClose={() => setIsToolsOpen(false)}
          isDark={isDark}
          currency={profile.currency}
        />
      )}

      {isWordSharing && wordToShare && (
        <WordShareModal 
          term={wordToShare.term}
          definition={wordToShare.def}
          isDark={isDark}
          lang={lang}
          onClose={() => {
            setIsWordSharing(false);
            setWordToShare(null);
          }}
        />
      )}

      {isTopUpOpen && (
        <TopUpModal 
          onClose={() => setIsTopUpOpen(false)}
          onRechargeOnline={handleOnlineRecharge}
          onTransferToOffline={handleTransferToOffline}
          onlineBalance={onlineBalance}
          offlineBalance={offlineBalance}
          isDark={isDark}
          lang={lang}
        />
      )}

      {showExitConfirmation && (
        <ExitConfirmationModal 
          isDark={isDark}
          onConfirm={handleExitApp}
          onCancel={() => setShowExitConfirmation(false)}
        />
      )}

      {showSuccess && (
        <SuccessModal 
          type={successType} 
          message={successMsg} 
          isDarkMode={isDark}
          onClose={() => setShowSuccess(false)} 
        />
      )}

      {showError && (
        <ErrorModal 
          message={errorMsg} 
          isDarkMode={isDark}
          onClose={() => setShowError(false)} 
          onRecharge={() => {
            setShowError(false);
            setIsTopUpOpen(true);
          }}
        />
      )}

      {detectedNfc && (
        <NfcDetectionModal 
          data={detectedNfc}
          isDark={isDark}
          lang={lang}
          onClose={() => setDetectedNfc(null)}
          onAction={() => {
            storageService.addLog({
              id: `nfc_${Date.now()}`,
              type: 'NFC_RECEIVE',
              status: 'SUCCESS',
              timestamp: Date.now(),
              metadata: detectedNfc.payload
            });
            setLogs(storageService.getLogs());
            setDetectedNfc(null);
            setStatus("Information enregistrée");
            setTimeout(() => setStatus(null), 3000);
          }}
        />
      )}

      <div className="flex-1 flex flex-col">
        <div className="p-6 pt-12 flex justify-between items-center">
          <div>
            <h1 className={`text-3xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>nelo</h1>
          </div>
          <div className="flex gap-2">
             <button 
              id="lock-btn"
              onClick={() => setShowExitConfirmation(true)}
              className={`w-10 h-10 rounded-full glass border flex items-center justify-center transition-all active:scale-90 ${glassClasses}`}
             >
               <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
             </button>
             
             <button 
              onClick={toggleLang}
              className={`w-10 h-10 rounded-full glass border flex items-center justify-center transition-all active:scale-90 ${glassClasses}`}
             >
               <div className="flex flex-col items-center">
                 <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                 <span className="text-[6px] font-black uppercase text-emerald-500 mt-0.5">{lang}</span>
               </div>
             </button>

             <button 
              id="tools-btn"
              onClick={() => setIsToolsOpen(true)}
              className={`w-10 h-10 rounded-full glass border flex items-center justify-center transition-all active:scale-90 ${glassClasses}`}
             >
               <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
             </button>
             <button 
              id="chat-btn"
              onClick={() => setIsChatOpen(true)}
              className={`w-10 h-10 rounded-full glass border flex items-center justify-center transition-all active:scale-90 ${glassClasses}`}
             >
               <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
             </button>
             <button 
              id="notif-btn"
              onClick={() => setIsNotificationsOpen(true)}
              className={`w-10 h-10 rounded-full glass border flex items-center justify-center transition-all active:scale-90 ${glassClasses}`}
             >
               <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
             </button>
          </div>
        </div>

        {renderContent()}
      </div>

      <div id="tabs">
        <BottomTabs activeTab={activeTab} onTabChange={setActiveTab} isDark={isDark} lang={lang} />
      </div>
    </div>
  );
};

export default App;
