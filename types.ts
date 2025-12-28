
export enum AppMode {
  BUSINESS_CARD = 'BUSINESS_CARD',
  PAYMENT = 'PAYMENT'
}

export enum AppTab {
  WALLET = 'WALLET',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS',
  PREVIEW = 'PREVIEW'
}

export enum AppTheme {
  LIGHT = 'LIGHT',
  DARK = 'DARK'
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface CardStyle {
  primaryColor: string;
  borderRadius: 'rounded-none' | 'rounded-xl' | 'rounded-full';
}

export interface AppSettings {
  soundEnabled: boolean;
  flashEnabled: boolean;
  hasCompletedTour: boolean;
  isRegistered: boolean;
  hashedPin?: string;
  phoneNumber?: string;
}

export interface Note {
  id: string;
  content: string;
  type: 'NOTE' | 'REMINDER';
  reminderTime?: string; // ISO string
  isCompleted: boolean;
  createdAt: number;
}

export interface UserProfile {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  socialLinks: SocialLink[];
  onlineBalance: number;
  offlineBalance: number;
  currency: string;
  cardStyle: CardStyle;
  profileImage?: string;
  coverImage?: string;
  settings: AppSettings;
  age?: string;
  maritalStatus?: string;
  childrenCount?: string;
  residence?: string;
  bio?: string;
}

export interface TransactionPayload {
  id: string;
  amount: number;
  timestamp: number;
  monotonicCounter: number;
  currency: string;
  signature?: string;
}

export interface NfcResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface LogEntry {
  id: string;
  type: 'PAYMENT' | 'PROFILE_SHARE' | 'RECHARGE' | 'NFC_RECEIVE';
  status: 'PENDING' | 'SYNCED' | 'SUCCESS';
  amount?: number;
  currency?: string;
  timestamp: number;
  metadata?: any;
}
