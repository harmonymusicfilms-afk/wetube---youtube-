
import { Video } from '../types';
import { MOCK_VIDEOS } from '../constants';

// Global In-Memory Store to persist data during the session
// In a real app, this would be the database (Supabase)
class MockStore {
  private videos: Video[] = [...MOCK_VIDEOS];
  private likedVideoIds: Set<string> = new Set();
  private historyVideoIds: string[] = [];
  private subscribers: Set<string> = new Set();

  // --- Videos ---
  getVideos(): Video[] {
    return [...this.videos];
  }

  getVideoById(id: string): Video | undefined {
    return this.videos.find(v => v.id === id);
  }

  addVideo(video: Video) {
    this.videos.unshift(video);
  }

  deleteVideo(id: string) {
    this.videos = this.videos.filter(v => v.id !== id);
  }

  // --- Interactions ---
  likeVideo(videoId: string, userId: string) {
    // Simple toggle
    if (this.likedVideoIds.has(videoId)) {
        this.likedVideoIds.delete(videoId);
        return false;
    } else {
        this.likedVideoIds.add(videoId);
        return true;
    }
  }

  isLiked(videoId: string): boolean {
      return this.likedVideoIds.has(videoId);
  }

  getLikedVideos(): Video[] {
      // In mock, we assume all likes belong to current user
      return this.videos.filter(v => this.likedVideoIds.has(v.id));
  }

  addToHistory(videoId: string) {
      // Move to top
      this.historyVideoIds = [videoId, ...this.historyVideoIds.filter(id => id !== videoId)];
  }

  getHistory(): Video[] {
      // Map IDs to videos, filtering out any that might have been deleted
      return this.historyVideoIds
        .map(id => this.videos.find(v => v.id === id))
        .filter((v): v is Video => !!v);
  }

  // --- Subscriptions ---
  subscribe(channelId: string) {
      this.subscribers.add(channelId);
  }
  
  unsubscribe(channelId: string) {
      this.subscribers.delete(channelId);
  }

  isSubscribed(channelId: string): boolean {
      return this.subscribers.has(channelId);
  }
}

export const mockStore = new MockStore();
