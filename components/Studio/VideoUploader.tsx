import React, { useState, useRef, useCallback } from 'react';
import { CloudUpload, FileVideo, X, CheckCircle, Loader2, AlertCircle, ChevronDown, Lock, Globe, EyeOff } from '../Icons';
import { Video } from '../../types';
import Button from '../Button';
import Input from '../Input';
import { useToast } from '../../contexts/ToastContext';
import { CATEGORIES } from '../../constants';

interface VideoUploaderProps {
  onVideoPublished: (video: Video) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoPublished }) => {
  const { success, error } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Upload & Processing States
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'unlisted'>('public');
  const [generatedThumbnail, setGeneratedThumbnail] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const startSimulation = (fileName: string) => {
    // Reset states
    setUploadProgress(0);
    setProcessingProgress(0);
    setIsUploading(true);
    setIsProcessing(false);
    setIsCompleted(false);
    
    // Generate a deterministic mock thumbnail based on filename
    const seed = fileName.replace(/[^a-zA-Z0-9]/g, '');
    setGeneratedThumbnail(`https://picsum.photos/seed/${seed}/640/360`);

    // Phase 1: Simulate Upload
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setIsUploading(false);
          startProcessing();
          return 100;
        }
        return prev + 8; // Upload speed
      });
    }, 200);
  };

  const startProcessing = () => {
    setIsProcessing(true);
    // Phase 2: Simulate Processing
    const processInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(processInterval);
          setIsProcessing(false);
          setIsCompleted(true);
          success("Checks complete. Video is ready.");
          return 100;
        }
        return prev + 5; // Processing speed
      });
    }, 150);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/')) {
        setFile(droppedFile);
        setTitle(droppedFile.name.replace(/\.[^/.]+$/, ""));
        startSimulation(droppedFile.name);
      } else {
        error("Please upload a valid video file");
      }
    }
  }, [error]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
      startSimulation(selectedFile.name);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
    setProcessingProgress(0);
    setIsUploading(false);
    setIsProcessing(false);
    setIsCompleted(false);
    setTitle('');
    setDescription('');
    setTags('');
    setCategory(CATEGORIES[0]);
    setVisibility('public');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePublish = () => {
    if (!isCompleted || !title) {
      error("Please wait for processing to complete");
      return;
    }

    const newVideo: Video = {
      id: Date.now().toString(),
      title: title,
      thumbnail: generatedThumbnail,
      channelName: "You",
      channelAvatar: "https://ui-avatars.com/api/?name=You&background=ef4444&color=fff",
      views: "0 views",
      postedAt: "Just now",
      duration: "10:00",
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: description,
      category: category,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      visibility: visibility
    };

    onVideoPublished(newVideo);
    success("Video published successfully!");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <CloudUpload className="w-8 h-8 text-wetube-red" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Upload Video</h1>
        <p className="text-gray-400">Share your story with the world.</p>
      </div>

      {!file ? (
        <div 
          className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[400px] ${
            isDragging 
              ? 'border-wetube-red bg-[#1F1F1F]' 
              : 'border-[#3F3F3F] bg-[#121212] hover:bg-[#1F1F1F] hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-24 h-24 bg-[#1F1F1F] rounded-full flex items-center justify-center mb-6 shadow-lg">
             <CloudUpload className={`w-10 h-10 ${isDragging ? 'text-wetube-red' : 'text-gray-400'}`} />
          </div>
          <p className="text-xl font-semibold text-white mb-2">Drag and drop video files to upload</p>
          <p className="text-gray-500 mb-6">Your videos will be private until you publish them.</p>
          <Button variant="primary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
            Select Files
          </Button>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="video/*" 
            className="hidden" 
            onChange={handleFileSelect}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Left: Video Preview & Status */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl overflow-hidden shadow-lg relative">
               <div className="aspect-video bg-black flex items-center justify-center relative group overflow-hidden">
                  {isCompleted ? (
                    <img src={generatedThumbnail} alt="Preview" className="w-full h-full object-cover animate-in fade-in duration-700" />
                  ) : (
                    <FileVideo className={`w-16 h-16 ${isUploading || isProcessing ? 'text-gray-600' : 'text-gray-700'}`} />
                  )}

                  {/* Overlays for Uploading/Processing */}
                  {(isUploading || isProcessing) && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 backdrop-blur-sm z-10">
                       <Loader2 className="w-10 h-10 text-wetube-red animate-spin" />
                       <div className="flex flex-col items-center">
                         <p className="text-white font-bold tracking-wide text-sm">
                           {isUploading ? 'UPLOADING MEDIA' : 'PROCESSING VIDEO'}
                         </p>
                         <p className="text-xs text-gray-400 mt-1 font-mono">
                           {isUploading ? `${uploadProgress}%` : `${processingProgress}%`}
                         </p>
                       </div>
                    </div>
                  )}
                  
                  {/* Ready Badge */}
                  {isCompleted && (
                    <div className="absolute top-2 right-2 z-20">
                      <div className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-md">
                        <CheckCircle className="w-3 h-3" /> READY
                      </div>
                    </div>
                  )}
               </div>
               
               <div className="p-4 border-t border-[#3F3F3F]">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col overflow-hidden mr-2">
                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Filename</div>
                        <div className="text-sm text-white font-medium truncate" title={file.name}>{file.name}</div>
                    </div>
                    <button onClick={handleRemoveFile} className="text-gray-400 hover:text-white p-1 hover:bg-[#303030] rounded-full transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Progress Bars */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className={`font-medium ${isCompleted ? "text-green-400" : isProcessing ? "text-blue-400" : "text-wetube-red"}`}>
                            {isUploading ? 'Uploading...' : isProcessing ? 'Processing HD...' : 'Complete'}
                        </span>
                    </div>
                    <div className="w-full bg-[#303030] h-1.5 rounded-full overflow-hidden">
                        <div 
                        className={`h-full transition-all duration-300 ease-out ${
                            isCompleted ? "bg-green-500" : 
                            isProcessing ? "bg-blue-500" : "bg-wetube-red"
                        }`}
                        style={{ width: isUploading ? `${uploadProgress}%` : isProcessing ? `${processingProgress}%` : '100%' }}
                        ></div>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Right: Details Form */}
          <div className="lg:col-span-2 bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6 flex flex-col gap-6">
             <div className="flex items-center justify-between border-b border-[#3F3F3F] pb-4">
               <div>
                  <h2 className="text-xl font-bold text-white">Video Details</h2>
                  <p className="text-xs text-gray-400 mt-1">Add a title and description to your video</p>
               </div>
               {isCompleted ? (
                 <div className="flex items-center gap-2 text-green-500 text-sm font-bold bg-green-500/10 px-3 py-1.5 rounded-full">
                   <CheckCircle className="w-4 h-4" />
                   Checks Passed
                 </div>
               ) : (
                 <div className="flex items-center gap-2 text-gray-500 text-sm">
                   <Loader2 className="w-4 h-4 animate-spin" />
                   {isUploading ? "Uploading..." : "Processing..."}
                 </div>
               )}
             </div>

             <div className="space-y-6">
               <Input 
                 label="Title (required)"
                 placeholder="Add a title that describes your video"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
               />

               <div className="space-y-2">
                 <label className="block text-sm font-medium text-gray-300">Description</label>
                 <textarea 
                   value={description}
                   onChange={(e) => setDescription(e.target.value)}
                   className="w-full bg-[#121212] border border-[#3F3F3F] rounded-lg px-4 py-3 text-white focus:border-wetube-red focus:outline-none transition-colors h-32 resize-none placeholder:text-gray-500"
                   placeholder="Tell viewers about your video"
                 />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Category Selection */}
                 <div className="space-y-2">
                   <label className="block text-sm font-medium text-gray-300">Category</label>
                   <div className="relative">
                     <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-[#121212] border border-[#3F3F3F] rounded-lg pl-4 pr-10 py-2.5 text-white appearance-none focus:border-wetube-red focus:outline-none transition-colors cursor-pointer"
                     >
                       {CATEGORIES.map(cat => (
                         <option key={cat} value={cat}>{cat}</option>
                       ))}
                     </select>
                     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                       <ChevronDown className="w-4 h-4" />
                     </div>
                   </div>
                 </div>

                 {/* Tags Input */}
                 <Input 
                   label="Tags"
                   placeholder="gaming, funny, review (comma separated)"
                   value={tags}
                   onChange={(e) => setTags(e.target.value)}
                 />
               </div>

               {/* Visibility Selection */}
               <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">Visibility</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                     <div 
                        onClick={() => setVisibility('public')}
                        className={`cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all hover:bg-[#2a2a2a] ${visibility === 'public' ? 'bg-[#2a2a2a] border-wetube-red' : 'bg-[#121212] border-[#3F3F3F]'}`}
                     >
                        <Globe className={`w-5 h-5 ${visibility === 'public' ? 'text-wetube-red' : 'text-gray-400'}`} />
                        <div>
                           <div className="text-sm font-medium text-white">Public</div>
                           <div className="text-[10px] text-gray-500">Everyone can watch</div>
                        </div>
                     </div>
                     
                     <div 
                        onClick={() => setVisibility('unlisted')}
                        className={`cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all hover:bg-[#2a2a2a] ${visibility === 'unlisted' ? 'bg-[#2a2a2a] border-wetube-red' : 'bg-[#121212] border-[#3F3F3F]'}`}
                     >
                        <EyeOff className={`w-5 h-5 ${visibility === 'unlisted' ? 'text-wetube-red' : 'text-gray-400'}`} />
                        <div>
                           <div className="text-sm font-medium text-white">Unlisted</div>
                           <div className="text-[10px] text-gray-500">Anyone with link</div>
                        </div>
                     </div>

                     <div 
                        onClick={() => setVisibility('private')}
                        className={`cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all hover:bg-[#2a2a2a] ${visibility === 'private' ? 'bg-[#2a2a2a] border-wetube-red' : 'bg-[#121212] border-[#3F3F3F]'}`}
                     >
                        <Lock className={`w-5 h-5 ${visibility === 'private' ? 'text-wetube-red' : 'text-gray-400'}`} />
                        <div>
                           <div className="text-sm font-medium text-white">Private</div>
                           <div className="text-[10px] text-gray-500">Only you can watch</div>
                        </div>
                     </div>
                  </div>
               </div>
             </div>

             <div className="pt-4 mt-auto flex justify-end gap-3">
               <Button variant="ghost" onClick={handleRemoveFile}>
                 Cancel
               </Button>
               <Button 
                 variant="primary" 
                 onClick={handlePublish}
                 disabled={!isCompleted || !title}
               >
                 Publish Video
               </Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;