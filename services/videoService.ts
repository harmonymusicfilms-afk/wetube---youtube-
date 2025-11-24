
import { supabase, isSupabaseConfigured } from './supabase';
import { Video, VideoUploadDTO } from '../types';
import { mockStore } from './mockStore';

// Validation Constants
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export const validateVideoFile = (file: File): string | null => {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return "Invalid file type. Please upload MP4, WebM, or MOV.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File size exceeds 500MB limit.";
  }
  return null;
};

export const getVideoMetadata = (file: File): Promise<{ duration: number; width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      });
    };
    video.onerror = () => reject("Failed to load video metadata");
    video.src = URL.createObjectURL(file);
  });
};

export const uploadVideo = async (
  data: VideoUploadDTO, 
  onProgress: (progress: number) => void
): Promise<Video> => {
  
  const validationError = validateVideoFile(data.file);
  if (validationError) {
    throw new Error(validationError);
  }

  // MOCK MODE
  if (!isSupabaseConfigured) {
    console.log("Mocking video upload...");
    const totalSteps = 20;
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      onProgress((i / totalSteps) * 100);
    }
    
    const newVideo: Video = {
      id: Date.now().toString(),
      title: data.title,
      thumbnail: data.thumbnailUrl || "https://picsum.photos/seed/video/640/360",
      channelName: "You", 
      channelAvatar: "https://ui-avatars.com/api/?name=You&background=ef4444&color=fff",
      views: "0 views",
      postedAt: "Just now",
      duration: "10:00", 
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: data.description,
      category: data.category,
      tags: data.tags,
      visibility: data.visibility,
      status: 'ready',
      videoUrl: URL.createObjectURL(data.file) 
    };
    
    // Add to centralized store so it appears in feed and content manager
    mockStore.addVideo(newVideo);
    
    return newVideo;
  }

  // REAL SUPABASE UPLOAD
  try {
    // 1. Get Metadata
    const metadata = await getVideoMetadata(data.file);
    const durationFormatted = formatDuration(metadata.duration);

    // 2. Upload Video File
    // Organize by User ID: userId/timestamp_filename.ext
    const fileExt = data.file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const videoPath = `${data.userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(videoPath, data.file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;
    onProgress(50); // 50% done (video uploaded)

    // 3. Upload Thumbnail (if custom file provided)
    let thumbnailPath = null;
    let publicThumbnailUrl = data.thumbnailUrl; // Default to generated/selected URL

    if (data.thumbnailFile) {
      const thumbExt = data.thumbnailFile.name.split('.').pop();
      const thumbName = `${Date.now()}_thumb.${thumbExt}`;
      const thumbPath = `${data.userId}/${thumbName}`;
      
      const { error: thumbError } = await supabase.storage
        .from('thumbnails')
        .upload(thumbPath, data.thumbnailFile);
      
      if (thumbError) throw thumbError;
      
      thumbnailPath = thumbPath;
      const { data: publicUrlData } = supabase.storage.from('thumbnails').getPublicUrl(thumbPath);
      publicThumbnailUrl = publicUrlData.publicUrl;
    }
    
    onProgress(80); // 80% done (thumbnail handled)

    // 4. Create Database Record
    const { data: videoRecord, error: dbError } = await supabase
      .from('videos')
      .insert({
        user_id: data.userId,
        title: data.title,
        description: data.description,
        video_path: videoPath,
        thumbnail_path: thumbnailPath,
        duration: metadata.duration,
        status: 'ready', // Direct to ready for MVP, usually 'processing'
        visibility: data.visibility,
        category: data.category,
        tags: data.tags,
        mime_type: data.file.type,
        size: data.file.size
      })
      .select()
      .single();

    if (dbError) throw dbError;
    onProgress(100);

    // 5. Construct Client Video Object
    return {
      id: videoRecord.id,
      title: videoRecord.title,
      thumbnail: publicThumbnailUrl || "",
      channelName: "You", // This should come from auth context
      channelAvatar: "", 
      views: "0 views",
      postedAt: "Just now",
      duration: durationFormatted,
      uploadedAt: new Date(videoRecord.created_at).toLocaleDateString(),
      description: videoRecord.description,
      category: videoRecord.category,
      tags: videoRecord.tags,
      visibility: videoRecord.visibility as 'public' | 'private' | 'unlisted',
      status: videoRecord.status,
      storagePath: videoPath,
      transcodingJobId: videoRecord.transcoding_job_id,
      mimeType: videoRecord.mime_type,
      size: videoRecord.size
    };

  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

export const deleteVideo = async (videoId: string, userId: string, storagePath: string, thumbnailPath?: string) => {
  if (!isSupabaseConfigured) {
      mockStore.deleteVideo(videoId);
      return;
  }

  try {
    // 1. Delete DB Record
    const { error: dbError } = await supabase
      .from('videos')
      .delete()
      .match({ id: videoId, user_id: userId });

    if (dbError) throw dbError;

    // 2. Delete Video File
    if (storagePath) {
      await supabase.storage.from('videos').remove([storagePath]);
    }

    // 3. Delete Thumbnail File
    if (thumbnailPath) {
      await supabase.storage.from('thumbnails').remove([thumbnailPath]);
    }
    
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
};

// Helper to format seconds into MM:SS
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
