
import React, { useEffect, useState } from 'react';

interface Props {
  isDark: boolean;
}

const SplashScreen: React.FC<Props> = ({ isDark }) => {
  const [visible, setVisible] = useState(true);

  return (
    <div className={`fixed inset-0 z-[2000] flex items-center justify-center transition-opacity duration-700 ${
      isDark ? 'bg-[#0a0a0a]' : 'bg-[#fcfcfc]'
    }`}>
      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-1000">
        <h1 className={`text-6xl font-black tracking-tighter ${
          isDark ? 'text-white' : 'text-zinc-900'
        }`}>
          nelo
        </h1>
        <div className="mt-8 flex gap-1">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
