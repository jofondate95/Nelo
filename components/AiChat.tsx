
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface Props {
  onClose: () => void;
  isDark: boolean;
}

const AiChat: React.FC<Props> = ({ onClose, isDark }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Bonjour ! Je suis l\'assistant Nelo. Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: messages.concat({ role: 'user', text: userMsg }).map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: "Tu es l'assistant IA de l'application Nelo. Nelo est un portefeuille fintech NFC. Fonctions : Partage de carte de visite NDEF, Paiements hors-ligne ISO 7816 sécurisés via compteur monotone. Aide les utilisateurs pour le paramétrage de profil, les erreurs de solde, et le fonctionnement du NFC. Reste concis, professionnel et amical.",
          maxOutputTokens: 500,
        }
      });

      const aiText = response.text || "Désolé, je rencontre une difficulté technique.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Erreur de connexion. Vérifiez votre accès internet." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[150] flex flex-col animate-in fade-in slide-in-from-bottom duration-300 ${isDark ? 'bg-black/80' : 'bg-zinc-100/90'} backdrop-blur-xl`}>
      <div className={`p-6 pt-12 flex justify-between items-center border-b ${isDark ? 'border-white/10' : 'border-black/5'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
          <div>
            <h2 className={`font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>Assistant Nelo</h2>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">IA Connectée</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <svg className={`w-6 h-6 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm transition-all ${
              m.role === 'user' 
                ? 'bg-emerald-500 text-white rounded-tr-none' 
                : (isDark 
                    ? 'bg-white/10 text-white border border-white/5' 
                    : 'bg-white text-zinc-900 border border-zinc-200 shadow-md'
                  ) + ' rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`p-4 rounded-3xl rounded-tl-none ${isDark ? 'bg-white/5' : 'bg-zinc-200'}`}>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`p-6 pb-12 ${isDark ? 'bg-zinc-900/50' : 'bg-white/80 border-t border-zinc-200'}`}>
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Posez votre question..."
            className={`w-full py-4 pl-6 pr-14 rounded-full border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-zinc-600' : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400'
            }`}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white disabled:opacity-50 transition-all active:scale-90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
