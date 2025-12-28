
import React, { useState } from 'react';
import { UserProfile, SocialLink } from '../types';

interface Props {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  onCancel: () => void;
  isDark: boolean;
}

const ProfileEditor: React.FC<Props> = ({ profile, onSave, onCancel, isDark }) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialChange = (index: number, field: keyof SocialLink, value: string) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFormData(prev => ({ ...prev, socialLinks: updatedLinks }));
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: 'LinkedIn', url: '' }]
    }));
  };

  const removeSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClass = `w-full ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'} border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm`;
  const labelClass = `text-[10px] font-bold ${isDark ? 'text-zinc-500' : 'text-zinc-400'} uppercase tracking-widest ml-1 mb-1 block`;

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
      <div className={`w-full max-w-lg ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/10'} border rounded-[2.5rem] p-6 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in slide-in-from-bottom duration-300 shadow-2xl`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>Mon Profil Public</h2>
          <button onClick={onCancel} className="text-zinc-500 hover:text-zinc-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8 pb-6">
          <section className="space-y-4">
            <h3 className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>Visuels</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Photo de Profil</label>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full overflow-hidden border ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'} flex-shrink-0`}>
                    {formData.profileImage ? (
                      <img src={formData.profileImage} className="w-full h-full object-cover" alt="Avatar" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'profileImage')} className="text-[10px] text-zinc-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-emerald-500/10 file:text-emerald-500" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Photo de Couverture</label>
                <div className="flex flex-col gap-2">
                  <div className={`w-full h-12 rounded-xl overflow-hidden border ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                    {formData.coverImage ? (
                      <img src={formData.coverImage} className="w-full h-full object-cover" alt="Couverture" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500 italic text-[10px]">Rectangulaire</div>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'coverImage')} className="text-[10px] text-zinc-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-emerald-500/10 file:text-emerald-500" />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>Identité Professionnelle</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nom Complet</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Titre / Poste</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputClass} required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Email (NFC)</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Téléphone (NFC)</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} required />
              </div>
            </div>
            <div>
              <label className={labelClass}>Description Bio / Note</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} className={`${inputClass} min-h-[80px] py-2`} placeholder="Quelques mots sur vous..." />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>Détails Personnels (Optionnels)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Âge</label>
                <input type="text" name="age" value={formData.age || ''} onChange={handleChange} placeholder="Ex: 28 ans" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Lieu d'habitation</label>
                <input type="text" name="residence" value={formData.residence || ''} onChange={handleChange} placeholder="Dakar, Sénégal" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Situation Matrimoniale</label>
                <select name="maritalStatus" value={formData.maritalStatus || ''} onChange={handleChange} className={inputClass}>
                  <option value="">Non précisé</option>
                  <option value="Célibataire">Célibataire</option>
                  <option value="Marié(e)">Marié(e)</option>
                  <option value="Divorcé(e)">Divorcé(e)</option>
                  <option value="Veuf/Veuve">Veuf/Veuve</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Nombre d'enfants</label>
                <input type="text" name="childrenCount" value={formData.childrenCount || ''} onChange={handleChange} placeholder="Ex: 2" className={inputClass} />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>Réseaux Sociaux</h3>
              <button type="button" onClick={addSocialLink} className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest px-2 py-1 bg-emerald-500/10 rounded-lg">+ Ajouter</button>
            </div>
            {formData.socialLinks.map((link, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className={labelClass}>Plateforme</label>
                  <select value={link.platform} onChange={(e) => handleSocialChange(index, 'platform', e.target.value)} className={inputClass}>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="X (Twitter)">X / Twitter</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="GitHub">GitHub</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>
                <div className="flex-[2]">
                  <label className={labelClass}>Lien URL</label>
                  <input type="text" value={link.url} onChange={(e) => handleSocialChange(index, 'url', e.target.value)} className={inputClass} placeholder="Lien ou numéro" />
                </div>
                <button type="button" onClick={() => removeSocialLink(index)} className="mb-1 p-3 text-red-500 bg-red-500/10 rounded-xl">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </section>

          <div className="flex gap-4 pt-4 sticky bottom-0 bg-inherit pb-2">
            <button type="button" onClick={onCancel} className={`flex-1 py-4 rounded-2xl font-bold text-sm ${isDark ? 'bg-white/5 text-zinc-400' : 'bg-black/5 text-zinc-500'}`}>Annuler</button>
            <button type="submit" className="flex-1 py-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditor;
