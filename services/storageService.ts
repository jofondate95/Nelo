
import { UserProfile, Note } from '../types';

/**
 * Nelo Storage Service
 */
export const storageService = {
  get: <T,>(key: string): T | null => {
    const data = localStorage.getItem(`nelo_${key}`);
    return data ? JSON.parse(data) : null;
  },

  set: (key: string, value: any): void => {
    localStorage.setItem(`nelo_${key}`, JSON.stringify(value));
  },

  incrementCounter: (): number => {
    const current = storageService.get<number>('monotonic_counter') || 0;
    const next = current + 1;
    storageService.set('monotonic_counter', next);
    return next;
  },

  getLogs: (): any[] => {
    return storageService.get<any[]>('tx_logs') || [];
  },

  addLog: (log: any): void => {
    const logs = storageService.getLogs();
    storageService.set('tx_logs', [log, ...logs].slice(0, 50));
  },

  getProfile: (): UserProfile | null => {
    return storageService.get<UserProfile>('user_profile');
  },

  saveProfile: (profile: UserProfile): void => {
    storageService.set('user_profile', profile);
  },

  getNotes: (): Note[] => {
    return storageService.get<Note[]>('notes') || [];
  },

  saveNotes: (notes: Note[]): void => {
    storageService.set('notes', notes);
  }
};
