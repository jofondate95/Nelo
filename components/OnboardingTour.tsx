
import React, { useState } from 'react';
import { translations, Language } from '../translations';

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'center';
}

interface Props {
  onComplete: () => void;
  isDark: boolean;
  lang: Language;
  onToggleLang: () => void;
}

const OnboardingTour: React.FC<Props> = ({ onComplete, isDark, lang, onToggleLang }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const t = translations[lang];

  const steps: TourStep[] = [
    {
      target: 'header',
      title: t.welcome,
      content: t.welcomeDesc,
      position: 'center'
    },
    {
      target: 'chat-btn',
      title: t.aiAssistant,
      content: t.aiAssistantDesc,
      position: 'bottom'
    },
    {
      target: 'notif-btn',
      title: 'Notes & Rappels',
      content: t.notifDesc,
      position: 'bottom'
    },
    {
      target: 'mode-switcher',
      title: t.modes,
      content: t.modesDesc,
      position: 'bottom'
    },
    {
      target: 'nfc-viz',
      title: t.nfcAction,
      content: t.nfcActionDesc,
      position: 'top'
    },
    {
      target: 'tabs',
      title: t.navigation,
      content: t.navigationDesc,
      position: 'top'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
      <div className={`relative w-full max-w-sm rounded-[2.5rem] p-8 border shadow-2xl animate-in zoom-in-95 duration-300 ${isDark ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-black/5 text-zinc-900'}`}>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
             <button 
              onClick={onToggleLang}
              className="p-2 rounded-full bg-emerald-500/10 text-emerald-500 transition-transform active:scale-90"
              title="Change Language"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </button>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Guide Nelo • {currentStep + 1}/{steps.length}</span>
          </div>
          <button onClick={onComplete} className="text-zinc-500 hover:text-zinc-700 text-[10px] font-bold uppercase tracking-widest">{t.skip}</button>
        </div>

        <h3 className="text-xl font-black mb-3 tracking-tighter">{step.title}</h3>
        <p className={`text-sm leading-relaxed mb-8 opacity-70 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
          {step.content}
        </p>

        <div className="flex gap-3">
          <button 
            onClick={handleNext}
            className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            {currentStep === steps.length - 1 ? t.start : t.next}
          </button>
        </div>

        {/* Pointer indicator simulation */}
        <div className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-500 rotate-45 ${step.position === 'top' ? '-bottom-2' : '-top-2'}`} />
      </div>
    </div>
  );
};

export default OnboardingTour;
