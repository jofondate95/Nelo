
import React from 'react';
import { UserProfile } from '../types';

interface Props {
  profile: Partial<UserProfile>;
  isDark: boolean;
}

const ProfileDisplay: React.FC<Props> = ({ profile, isDark }) => {
  const contrastText = isDark ? 'text-white' : 'text-zinc-900';
  const mutedText = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const cardBg = isDark ? 'bg-zinc-900 border-white/5' : 'bg-white border-black/5';

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />;
      case 'github': return <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />;
      case 'whatsapp': return <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-7.6-12.7 8.38 8.38 0 013.8.9L21 3.5z" />;
      case 'instagram': return <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm5-1a1 1 0 100 2 1 1 0 000-2z" />;
      default: return <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />;
    }
  };

  return (
    <div className={`w-full max-w-sm mx-auto shadow-2xl overflow-hidden rounded-[2.5rem] border transition-all ${cardBg}`}>
      <div 
        className="h-32 w-full relative bg-cover bg-center" 
        style={{ 
          backgroundColor: (profile.cardStyle?.primaryColor || '#10b981') + '22',
          backgroundImage: profile.coverImage ? `url(${profile.coverImage})` : 'none'
        }}
      >
         <div 
           className={`absolute -bottom-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 shadow-xl flex items-center justify-center overflow-hidden bg-cover bg-center transition-all`}
           style={{ 
             borderColor: isDark ? '#18181b' : '#fff', 
             backgroundColor: profile.cardStyle?.primaryColor || '#10b981',
             backgroundImage: profile.profileImage ? `url(${profile.profileImage})` : 'none'
           }}
         >
            {!profile.profileImage && (
              <span className="text-white text-3xl font-black">
                {profile.fullName?.charAt(0)}
              </span>
            )}
         </div>
      </div>

      <div className="pt-14 pb-8 px-6">
        <div className="text-center mb-6">
          <h3 className={`text-2xl font-black ${contrastText}`}>{profile.fullName}</h3>
          <p className="text-emerald-500 font-bold text-sm tracking-wide uppercase mt-1">{profile.title}</p>
          <p className={`${mutedText} text-xs mt-1`}>{profile.company}</p>
        </div>

        {profile.bio && (
          <div className={`mb-6 p-4 rounded-2xl border text-sm italic ${isDark ? 'bg-white/5 border-white/5 text-zinc-300' : 'bg-zinc-50 border-zinc-100 text-zinc-600'}`}>
            "{profile.bio}"
          </div>
        )}

        {(profile.age || profile.maritalStatus || profile.residence) && (
          <div className={`mb-6 p-4 rounded-2xl space-y-2 text-[10px] font-bold uppercase tracking-widest ${isDark ? 'bg-black/20 text-zinc-400' : 'bg-zinc-100/50 text-zinc-500'}`}>
            {profile.age && <div className="flex justify-between"><span>Âge</span><span className={contrastText}>{profile.age}</span></div>}
            {profile.maritalStatus && <div className="flex justify-between"><span>Statut</span><span className={contrastText}>{profile.maritalStatus}</span></div>}
            {profile.childrenCount && <div className="flex justify-between"><span>Enfants</span><span className={contrastText}>{profile.childrenCount}</span></div>}
            {profile.residence && <div className="flex justify-between"><span>Ville</span><span className={contrastText}>{profile.residence}</span></div>}
          </div>
        )}

        <div className="space-y-3">
           <div className="grid grid-cols-2 gap-3">
             {profile.phone && (
               <a href={`tel:${profile.phone}`} className="flex items-center justify-center gap-2 py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                 Appeler
               </a>
             )}
             {profile.email && (
               <a href={`mailto:${profile.email}`} className="flex items-center justify-center gap-2 py-4 bg-white/10 border border-white/10 text-emerald-500 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                 Email
               </a>
             )}
           </div>

           <div className="grid grid-cols-2 gap-3">
             {(profile.socialLinks || []).map((link, idx) => (
               <a 
                 key={idx}
                 href={link.url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className={`flex items-center justify-center gap-2 py-3 px-4 text-[10px] font-bold border rounded-2xl transition-all active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-zinc-900'}`}
               >
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                   {getPlatformIcon(link.platform)}
                 </svg>
                 {link.platform}
               </a>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;
