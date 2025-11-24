
export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  channelAvatar: string;
  views: string;
  postedAt: string;
  duration: string;
  uploadedAt: string;
  description: string;
  category: string;
  tags: string[];
  visibility: 'public' | 'private' | 'unlisted';
  monetization?: boolean;
  scheduledFor?: string;
  // Backend fields
  videoUrl?: string;
  status?: 'processing' | 'ready' | 'failed';
  storagePath?: string;
  transcodingJobId?: string;
  mimeType?: string;
  size?: number;
}

export interface Short {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  views: string;
  likes: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies?: Comment[];
}

export interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum View {
  HOME = 'HOME',
  SHORTS = 'SHORTS',
  WATCH = 'WATCH',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',
  HISTORY = 'HISTORY',
  LIKED_VIDEOS = 'LIKED_VIDEOS',
  STUDIO_DASHBOARD = 'STUDIO_DASHBOARD',
  STUDIO_CONTENT = 'STUDIO_CONTENT',
  STUDIO_ANALYTICS = 'STUDIO_ANALYTICS',
  STUDIO_COPYRIGHT = 'STUDIO_COPYRIGHT',
  STUDIO_GENERATE = 'STUDIO_GENERATE',
  STUDIO_EDIT = 'STUDIO_EDIT',
  STUDIO_UPLOAD = 'STUDIO_UPLOAD',
  STUDIO_SCRIPT = 'STUDIO_SCRIPT',
  STUDIO_MONETIZATION = 'STUDIO_MONETIZATION',
  STUDIO_LIVE = 'STUDIO_LIVE',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  HELP = 'HELP'
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface ScriptInputs {
  topic: string;
  niche: string;
  audience: string;
  tone: string;
  duration: number;
  style: string;
}

export enum ReportReason {
  SPAM = 'Spam or misleading',
  HATE = 'Hateful or abusive content',
  VIOLENCE = 'Violent or repulsive content',
  SEXUAL = 'Sexually explicit content',
  HARASSMENT = 'Harassment or bullying',
  MISINFO = 'Misinformation'
}

export interface SocialLink {
  platform: 'website' | 'twitter' | 'instagram' | 'discord';
  url: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  location?: string;
  phone?: string;
  banner?: string;
  socialLinks?: SocialLink[];
  kycStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAttempts: number;
  isLockedOut: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  loginWithPhone: (phone: string) => Promise<{ error: any }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: any }>;
  loginWithProvider: (provider: 'google' | 'github' | 'discord') => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  submitKYC: (document: File) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export interface VideoUploadDTO {
  userId: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  visibility: 'public' | 'private' | 'unlisted';
  file: File;
  thumbnailFile?: File; // If user uploaded a custom thumbnail
  thumbnailUrl?: string; // If user selected a generated one
}

export interface Channel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner?: string;
  subscribers: number;
  isVerified: boolean;
}

export interface Subscription {
  id: string;
  subscriberId: string;
  channelId: string;
  createdAt: string;
}

export interface Playlist {
  id: string;
  userId: string;
  title: string;
  description?: string;
  visibility: 'public' | 'private' | 'unlisted';
  videoCount: number;
  thumbnail?: string;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  uploadDate?: 'today' | 'week' | 'month' | 'year';
  sortBy?: 'relevance' | 'date' | 'views' | 'rating';
  userId?: string; // For filtering by channel
}

export interface StreamSettings {
  title: string;
  description: string;
  category: string;
  visibility: 'public' | 'private' | 'unlisted';
  streamKey: string;
  serverUrl: string;
  latency: 'normal' | 'low' | 'ultra-low';
}

export interface StreamStats {
  isLive: boolean;
  viewers: number;
  duration: number; // seconds
  bitrate: number; // kbps
  health: 'good' | 'fair' | 'poor' | 'offline';
}

export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

export type LogLevel = 'info' | 'warn' | 'error' | 'audit';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  userId?: string;
}

export interface FraudReport {
  id: string;
  videoId: string;
  userId: string;
  reason: string;
  timestamp: number;
  status: 'pending' | 'reviewed' | 'dismissed';
}

export interface ModerationQueueItem {
  id: string;
  contentType: 'video' | 'comment' | 'post';
  contentId: string;
  reporterId: string;
  reason: ReportReason;
  timestamp: number;
  status: 'pending' | 'resolved';
  contentPreview: {
    title?: string;
    text?: string;
    thumbnail?: string;
    author: string;
  };
}

export type ModerationAction = 'approve' | 'remove' | 'strike' | 'ban_user';

export interface AnalyticsMetrics {
  views: number;
  watchTimeHours: number;
  subscribers: number;
  revenue: number;
  ctr: number; // Click-through rate
  averageViewDuration: string;
}

export interface Demographics {
  age: { [key: string]: number }; // e.g., "18-24": 45
  gender: { [key: string]: number }; // e.g., "Male": 60
  geography: { [key: string]: number }; // e.g., "US": 30
}

export interface RevenueData {
  date: string;
  amount: number;
  rpm: number;
  cpm: number;
}

export type NotificationType = 'email' | 'sms' | 'push' | 'in-app';

export interface NotificationPreference {
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  types: {
    subscription: boolean;
    recommendation: boolean;
    activity: boolean;
    comments: boolean;
    security: boolean; // Usually mandatory
  };
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string; // HTML content
}

export interface ComplianceLog {
  id: string;
  timestamp: string;
  action: string;
  actorId: string;
  targetResource: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
  status: 'logged' | 'flagged' | 'resolved';
}

export interface CopyrightClaim {
  id: string;
  videoId: string;
  videoTitle: string;
  claimant: string;
  type: 'audio' | 'visual' | 'audiovisual';
  timestamp: string; // Timecode in video
  status: 'active' | 'disputed' | 'resolved';
  action: 'monetize' | 'block' | 'track';
}

export interface FraudCheckResult {
  isValid: boolean;
  reason?: string;
  confidenceScore: number;
}
