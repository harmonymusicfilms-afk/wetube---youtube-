
import { supabase, isSupabaseConfigured } from './supabase';
import { Video, Comment, SearchFilters } from '../types';
import { MOCK_COMMENTS } from '../constants';
import { mockStore } from './mockStore';

// --- Helper to Map Backend Video to Frontend Video ---
const mapVideo = (record: any): Video => ({
  id: record.id,
  title: record.title,
  thumbnail: record.thumbnail_path 
    ? supabase.storage.from('thumbnails').getPublicUrl(record.thumbnail_path).data.publicUrl
    : (record.thumbnail_url || ''),
  channelName: record.channels?.name || "Unknown",
  channelAvatar: record.channels?.avatar_url || "",
  views: `${record.views} views`,
  postedAt: new Date(record.created_at).toLocaleDateString(),
  duration: formatDuration(record.duration),
  uploadedAt: new Date(record.created_at).toLocaleDateString(),
  description: record.description,
  category: record.category,
  tags: record.tags || [],
  visibility: record.visibility,
  videoUrl: record.video_path 
    ? supabase.storage.from('videos').getPublicUrl(record.video_path).data.publicUrl 
    : undefined,
  status: record.status
});

function formatDuration(seconds: number): string {
  if (!seconds) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}


// --- Videos API ---

export const VideoAPI = {
  getAll: async (filters?: SearchFilters): Promise<Video[]> => {
    if (!isSupabaseConfigured) {
        // Mock Filtering from Central Store
        let result = mockStore.getVideos();
        
        if (filters?.userId) {
             // For mock, we assume the user is the author if they uploaded it (checking channelName for 'You' or 'Demo User')
             // In real app this matches user_id
             result = result.filter(v => v.channelName === 'You' || v.channelName === 'Demo User');
        }

        if (filters?.query) {
            const q = filters.query.toLowerCase();
            result = result.filter(v => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q));
        }
        if (filters?.category && filters.category !== 'All') {
            result = result.filter(v => v.category === filters.category);
        }
        return result;
    }

    let query = supabase
      .from('videos')
      .select(`
        *,
        channels:user_id ( name, avatar_url )
      `);
      
    // If we are filtering by user (e.g. Studio Content), we don't need to check 'public' visibility
    if (filters?.userId) {
       query = query.eq('user_id', filters.userId);
    } else {
       query = query.eq('status', 'ready').eq('visibility', 'public');
    }

    if (filters?.query) {
      query = query.textSearch('text_search', filters.query, {
        type: 'websearch',
        config: 'english'
      });
    }

    if (filters?.category && filters.category !== 'All') {
      query = query.eq('category', filters.category);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    
    return data.map(mapVideo);
  },

  getById: async (id: string): Promise<Video | null> => {
    if (!isSupabaseConfigured) {
      return mockStore.getVideoById(id) || null;
    }

    const { data, error } = await supabase
      .from('videos')
      .select(`*, channels:user_id ( name, avatar_url )`)
      .eq('id', id)
      .single();

    if (error) return null;
    return mapVideo(data);
  },

  getHistory: async (): Promise<Video[]> => {
    if (!isSupabaseConfigured) {
        return mockStore.getHistory();
    }
    // Backend implementation would query 'views' table
    return []; 
  },

  getLiked: async (): Promise<Video[]> => {
    if (!isSupabaseConfigured) {
        return mockStore.getLikedVideos();
    }
    // Backend implementation would query 'likes' table
    return [];
  },

  addToHistory: async (videoId: string) => {
      if (!isSupabaseConfigured) {
          mockStore.addToHistory(videoId);
          return;
      }
      // Handled by AnalyticsAPI recordView usually
  },

  likeVideo: async (videoId: string): Promise<boolean> => {
      if (!isSupabaseConfigured) {
          return mockStore.likeVideo(videoId, 'current-user');
      }
      // Real DB implementation
      return true;
  }
};

// --- Comments API ---

export const CommentAPI = {
    getByVideoId: async (videoId: string): Promise<Comment[]> => {
        if (!isSupabaseConfigured) return MOCK_COMMENTS;

        const { data, error } = await supabase
            .from('comments')
            .select(`
                *,
                users:user_id ( name, avatar_url )
            `)
            .eq('video_id', videoId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map((c: any) => ({
            id: c.id,
            author: c.users?.name || 'Unknown',
            avatar: c.users?.avatar_url || '',
            text: c.content,
            timestamp: new Date(c.created_at).toLocaleDateString(),
            likes: c.likes || 0,
            dislikes: 0,
            replies: [] 
        }));
    },

    create: async (videoId: string, text: string, userId: string) => {
        if (!isSupabaseConfigured) return { id: Date.now().toString() };

        const { data, error } = await supabase
            .from('comments')
            .insert({
                video_id: videoId,
                user_id: userId,
                content: text
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};

// --- Subscriptions API ---

export const SubscriptionAPI = {
    subscribe: async (channelId: string, userId: string) => {
        if (!isSupabaseConfigured) {
            mockStore.subscribe(channelId);
            return;
        }
        const { error } = await supabase.from('subscriptions').insert({ channel_id: channelId, subscriber_id: userId });
        if (error) throw error;
    },
    unsubscribe: async (channelId: string, userId: string) => {
        if (!isSupabaseConfigured) {
            mockStore.unsubscribe(channelId);
            return;
        }
        const { error } = await supabase.from('subscriptions').delete().match({ channel_id: channelId, subscriber_id: userId });
        if (error) throw error;
    },
    checkStatus: async (channelId: string, userId: string): Promise<boolean> => {
        if (!isSupabaseConfigured) {
            return mockStore.isSubscribed(channelId);
        }
        const { count, error } = await supabase
            .from('subscriptions')
            .select('*', { count: 'exact', head: true })
            .match({ channel_id: channelId, subscriber_id: userId });
        
        if (error) return false;
        return (count || 0) > 0;
    }
};

// --- Analytics API ---

export const AnalyticsAPI = {
    recordView: async (videoId: string, userId?: string) => {
        if (!isSupabaseConfigured) {
            mockStore.addToHistory(videoId);
            return;
        }
        
        await supabase.from('views').insert({
            video_id: videoId,
            user_id: userId || null, 
            duration_watched: 0 
        });

        await supabase.rpc('increment_view_count', { video_id: videoId });
    }
};
