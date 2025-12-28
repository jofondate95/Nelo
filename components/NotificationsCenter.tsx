
import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { storageService } from '../services/storageService';

interface Props {
  onClose: () => void;
  isDark: boolean;
  onReminderAlert: () => void;
}

const NotificationsCenter: React.FC<Props> = ({ onClose, isDark, onReminderAlert }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<'NOTE' | 'REMINDER'>('NOTE');
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    setNotes(storageService.getNotes());
  }, []);

  const handleSaveNote = () => {
    if (!newContent.trim()) return;
    const newNote: Note = {
      id: Date.now().toString(),
      content: newContent,
      type: newType,
      reminderTime: newType === 'REMINDER' ? reminderTime : undefined,
      isCompleted: false,
      createdAt: Date.now()
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    storageService.saveNotes(updated);
    setIsAdding(false);
    setNewContent('');
    setReminderTime('');
  };

  const handleDelete = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    storageService.saveNotes(updated);
  };

  const toggleComplete = (id: string) => {
    const updated = notes.map(n => n.id === id ? { ...n, isCompleted: !n.isCompleted } : n);
    setNotes(updated);
    storageService.saveNotes(updated);
  };

  return (
    <div className={`fixed inset-0 z-[150] flex flex-col animate-in fade-in duration-300 ${isDark ? 'bg-black/90' : 'bg-zinc-50/95'} backdrop-blur-2xl`}>
      <div className={`p-6 pt-12 flex justify-between items-center border-b ${isDark ? 'border-white/10' : 'border-black/5'}`}>
        <h2 className={`text-xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>Notes & Rappels</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {notes.length === 0 && !isAdding && (
          <div className="text-center py-20 opacity-40">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            <p className="text-sm font-bold uppercase tracking-widest">Aucune note ou rappel</p>
          </div>
        )}

        {notes.map(note => (
          <div key={note.id} className={`p-5 rounded-3xl border transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-zinc-200 shadow-sm'} ${note.isCompleted ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${note.type === 'REMINDER' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'}`}>
                    {note.type === 'REMINDER' ? 'Rappel' : 'Note'}
                  </span>
                  {note.reminderTime && (
                    <span className="text-[10px] text-zinc-500 font-bold">{new Date(note.reminderTime).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
                  )}
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white' : 'text-zinc-800'} ${note.isCompleted ? 'line-through' : ''}`}>
                  {note.content}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleComplete(note.id)} className={`p-2 rounded-xl ${note.isCompleted ? 'text-emerald-500 bg-emerald-500/10' : 'text-zinc-500 bg-zinc-500/10'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </button>
                <button onClick={() => handleDelete(note.id)} className="p-2 rounded-xl text-red-500 bg-red-500/10">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className={`p-6 border-t animate-in slide-in-from-bottom duration-300 ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]'}`}>
          <div className="space-y-4">
            <textarea
              autoFocus
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Votre note ou tâche..."
              className={`w-full p-4 rounded-2xl border min-h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
              }`}
            />
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Type</label>
                <div className="flex gap-2">
                  <button onClick={() => setNewType('NOTE')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newType === 'NOTE' ? 'bg-emerald-500 text-white shadow-lg' : (isDark ? 'bg-white/5 text-zinc-500' : 'bg-zinc-100 text-zinc-400')}`}>Note</button>
                  <button onClick={() => setNewType('REMINDER')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newType === 'REMINDER' ? 'bg-orange-500 text-white shadow-lg' : (isDark ? 'bg-white/5 text-zinc-500' : 'bg-zinc-100 text-zinc-400')}`}>Rappel</button>
                </div>
              </div>
              {newType === 'REMINDER' && (
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Heure</label>
                  <input
                    type="datetime-local"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className={`w-full py-3 px-4 rounded-xl text-[10px] border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-900'}`}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsAdding(false)} className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 text-zinc-500' : 'bg-zinc-100 text-zinc-400'}`}>Annuler</button>
              <button onClick={handleSaveNote} className="flex-[2] py-4 rounded-2xl bg-emerald-500 text-white font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {!isAdding && (
        <div className="p-6 pb-20 flex justify-center">
          <button 
            onClick={() => setIsAdding(true)}
            className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 active:scale-90 transition-all"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsCenter;
