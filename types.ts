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
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum View {
  HOME = 'HOME',
  WATCH = 'WATCH',
  STUDIO_GENERATE = 'STUDIO_GENERATE',
  STUDIO_EDIT = 'STUDIO_EDIT',
  STUDIO_UPLOAD = 'STUDIO_UPLOAD'
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}