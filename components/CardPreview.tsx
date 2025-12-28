
import React from 'react';
import { UserProfile } from '../types';
import ProfileDisplay from './ProfileDisplay.tsx';

interface Props {
  profile: UserProfile;
  isDark: boolean;
}

const CardPreview: React.FC<Props> = ({ profile, isDark }) => {
  const contrastText = isDark ? 'text-white' : 'text-zinc-900';

  return (
    <div className={`flex-1 flex flex-col p-6 animate-in fade-in duration-500 pb-32 overflow-y-auto custom-scrollbar`}>
      <h2 className={`text-2xl font-black mb-6 tracking-tight ${contrastText}`}>Visualiseur</h2>
      <ProfileDisplay profile={profile} isDark={isDark} />
    </div>
  );
};

export default CardPreview;
