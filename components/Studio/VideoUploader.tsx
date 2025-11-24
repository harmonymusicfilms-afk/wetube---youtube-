
import React, { useState, useRef, useCallback } from 'react';
import { CloudUpload, FileVideo, X, CheckCircle, Loader2, AlertCircle, ChevronDown, Lock, Globe, EyeOff, ImageIcon, DollarSign, FileCheck, Calendar } from '../Icons';
import { Video } from '../../types';
import Button from '../Button';
import Input from '../Input';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { CATEGORIES } from '../../constants';
import { uploadVideo } from '../../services/videoService';

interface VideoUploaderProps {
  onVideoPublished: (video: Video) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoPublished }) => {
  const { success, error: showError } = useToast();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Upload & Processing States
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  
  // Tags State
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const [visibility, setVisibility] = useState<'public' | 'private' | 'unlisted'>('public');
  
  // Thumbnail State
  const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]);
  const [customThumbnail, setCustomThumbnail] = useState<string | null>(null);
  const [customThumbnailFile, setCustomThumbnailFile] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string>('');
  
  // Advanced Settings
  const [monetization, setMonetization] = useState(false);
  const [copyrightChecked, setCopyrightChecked] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [scheduleDate, setScheduleDate] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const generatePlaceholders = (fileName: string) => {
     // Generate 3 deterministic mock thumbnails based on filename (simulation)
    const seed = fileName.replace(/[^a-zA-Z0-9]/g, '');
    const genThumbs = [
      `https://picsum.photos/seed/${seed}/640/360`,
      `https://picsum.photos/seed/${seed}2/640/360`,
      `https://picsum.photos/seed/${seed}3/640/360`
    ];
    setGeneratedThumbnails(genThumbs);
    if (!selectedThumbnail && !customThumbnail) {
        setSelectedThumbnail(genThumbs[0]);
    }
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
        generatePlaceholders(droppedFile.name);
      } else {
        showError("Please upload a valid video file");
      }
    }
  }, [showError]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
      generatePlaceholders(selectedFile.name);
    }
  };

  const handleThumbSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setCustomThumbnailFile(file);
        const reader = new FileReader();
        reader.onload = () => {
           const result = reader.result as string;
           setCustomThumbnail(result);
           setSelectedThumbnail(result);
        };
        reader.readAsDataURL(file);
     }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setIsCompleted(false);
    setTitle('');
    setDescription('');
    setTags([]);
    setTagInput('');
    setCategory(CATEGORIES[0]);
    setVisibility('public');
    setMonetization(false);
    setCopyrightChecked(false);
    setCustomThumbnail(null);
    setCustomThumbnailFile(null);
    setGeneratedThumbnails([]);
    setSelectedThumbnail('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handlePublish = async () => {
    if (!file || !title) {
      showError("Please fill in all required fields");
      return;
    }

    if (!copyrightChecked) {
       showError("Please confirm you own the rights to this content");
       return;
    }
    
    if (!user) {
        showError("You must be logged in to publish");
        return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
        const newVideo = await uploadVideo({
            userId: user.id,
            title,
            description,
            category,
            tags,
            visibility,
            file,
            thumbnailFile: customThumbnailFile || undefined,
            thumbnailUrl: selectedThumbnail
        }, (progress) => {
            setUploadProgress(progress);
        });

        // Enhance user info from current session since backend might return raw data
        const finalVideo = {
            ...newVideo,
            channelName: user.name,
            channelAvatar: user.avatar
        };

        setIsCompleted(true);
        setIsUploading(false);
        success("Video published successfully!");
        onVideoPublished(finalVideo);
        
        // Reset form after short delay or keep it? 
        // For now, let's keep it in "Complete" state so user sees it.
    } catch (err) {
        console.error(err);
        showError("Failed to upload video. Please try again.");
        setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 pb-20">
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
                  {(isCompleted || selectedThumbnail) ? (
                    <img src={selectedThumbnail} alt="Preview" className="w-full h-full object-cover animate-in fade-in duration-700" />
                  ) : (
                    <FileVideo className={`w-16 h-16 ${isUploading ? 'text-gray-600' : 'text-gray-700'}`} />
                  )}

                  {/* Overlays for Uploading/Processing */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 backdrop-blur-sm z-10">
                       <Loader2 className="w-10 h-10 text-wetube-red animate-spin" />
                       <div className="flex flex-col items-center">
                         <p className="text-white font-bold tracking-wide text-sm">
                           UPLOADING & PROCESSING
                         </p>
                         <p className="text-xs text-gray-400 mt-1 font-mono">
                           {Math.round(uploadProgress)}%
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
                    {!isUploading && !isCompleted && (
                        <button onClick={handleRemoveFile} className="text-gray-400 hover:text-white p-1 hover:bg-[#303030] rounded-full transition-colors">
                        <X className="w-4 h-4" />
                        </button>
                    )}
                  </div>
                  
                  {/* Progress Bars */}
                  {(isUploading || isCompleted) && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className={`font-medium ${isCompleted ? "text-green-400" : "text-wetube-red"}`}>
                                {isCompleted ? 'Upload Complete' : 'Uploading...'}
                            </span>
                        </div>
                        <div className="w-full bg-[#303030] h-1.5 rounded-full overflow-hidden">
                            <div 
                            className={`h-full transition-all duration-300 ease-out ${isCompleted ? "bg-green-500" : "bg-wetube-red"}`}
                            style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                      </div>
                  )}
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
               {isCompleted && (
                 <div className="flex items-center gap-2 text-green-500 text-sm font-bold bg-green-500/10 px-3 py-1.5 rounded-full">
                   <CheckCircle className="w-4 h-4" />
                   Published
                 </div>
               )}
             </div>

             <div className="space-y-6">
               <Input 
                 label="Title (required)"
                 placeholder="Add a title that describes your video"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 disabled={isUploading || isCompleted}
               />

               <div className="space-y-2">
                 <label className="block text-sm font-medium text-gray-300">Description</label>
                 <textarea 
                   value={description}
                   onChange={(e) => setDescription(e.target.value)}
                   className="w-full bg-[#121212] border border-[#3F3F3F] rounded-lg px-4 py-3 text-white focus:border-wetube-red focus:outline-none transition-colors h-32 resize-none placeholder:text-gray-500"
                   placeholder="Tell viewers about your video"
                   disabled={isUploading || isCompleted}
                 />
               </div>

               {/* Thumbnail Selection */}
               <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Thumbnail</label>
                  <p className="text-xs text-gray-500 mb-2">Select or upload a picture that shows what's in your video.</p>
                  <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                     <div 
                        onClick={() => !isUploading && !isCompleted && thumbInputRef.current?.click()}
                        className={`w-40 h-24 shrink-0 border-2 border-dashed border-[#3F3F3F] rounded-lg flex flex-col items-center justify-center transition-colors text-gray-400 ${isUploading || isCompleted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-gray-400'}`}
                     >
                        <ImageIcon className="w-6 h-6 mb-1" />
                        <span className="text-xs">Upload file</span>
                        <input ref={thumbInputRef} type="file" className="hidden" accept="image/*" onChange={handleThumbSelect} />
                     </div>
                     
                     {customThumbnail && (
                        <div 
                          onClick={() => !isUploading && !isCompleted && setSelectedThumbnail(customThumbnail)}
                          className={`w-40 h-24 shrink-0 rounded-lg overflow-hidden border-2 relative ${selectedThumbnail === customThumbnail ? 'border-wetube-red' : 'border-transparent opacity-80'} ${isUploading || isCompleted ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-100'}`}
                        >
                           <img src={customThumbnail} className="w-full h-full object-cover" />
                        </div>
                     )}

                     {generatedThumbnails.map((thumb, idx) => (
                       <div 
                          key={idx}
                          onClick={() => !isUploading && !isCompleted && setSelectedThumbnail(thumb)}
                          className={`w-40 h-24 shrink-0 rounded-lg overflow-hidden border-2 relative transition-all ${selectedThumbnail === thumb ? 'border-wetube-red scale-105 shadow-lg' : 'border-transparent opacity-80'} ${isUploading || isCompleted ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-100'}`}
                       >
                          <img src={thumb} className="w-full h-full object-cover" />
                       </div>
                     ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Category Selection */}
                 <div className="space-y-2">
                   <label className="block text-sm font-medium text-gray-300">Category</label>
                   <div className="relative">
                     <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={isUploading || isCompleted}
                        className="w-full bg-[#121212] border border-[#3F3F3F] rounded-lg pl-4 pr-10 py-2.5 text-white appearance-none focus:border-wetube-red focus:outline-none transition-colors cursor-pointer disabled:opacity-50"
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
                 <div className="space-y-2">
                   <label className="block text-sm font-medium text-gray-300">Tags</label>
                   <div className={`bg-[#121212] border border-[#3F3F3F] rounded-lg px-3 py-2 flex flex-wrap gap-2 focus-within:border-wetube-red transition-colors min-h-[46px] ${isUploading || isCompleted ? 'opacity-50 pointer-events-none' : ''}`}>
                      {tags.map(tag => (
                        <div key={tag} className="bg-[#2a2a2a] text-white text-sm px-2 py-1 rounded flex items-center gap-1 animate-in fade-in zoom-in duration-200">
                           <span>{tag}</span>
                           <button onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500 transition-colors">
                             <X className="w-3 h-3" />
                           </button>
                        </div>
                      ))}
                      <input 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder={tags.length > 0 ? "" : "Add a tag..."}
                        className="bg-transparent border-none outline-none text-white flex-1 min-w-[120px] text-sm h-7 py-0.5 placeholder:text-gray-500"
                        disabled={isUploading || isCompleted}
                      />
                   </div>
                   <p className="text-[10px] text-gray-500 pl-1">Press Enter or comma to add tags</p>
                 </div>
               </div>

               {/* Visibility Selection */}
               <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">Visibility</label>
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${isUploading || isCompleted ? 'opacity-50 pointer-events-none' : ''}`}>
                     {['public', 'unlisted', 'private'].map((vis) => (
                        <div 
                           key={vis}
                           onClick={() => setVisibility(vis as any)}
                           className={`cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all hover:bg-[#2a2a2a] hover:border-gray-500 group ${visibility === vis ? 'bg-[#2a2a2a] border-wetube-red' : 'bg-[#121212] border-[#3F3F3F]'}`}
                        >
                           {vis === 'public' && <Globe className={`w-5 h-5 ${visibility === 'public' ? 'text-wetube-red' : 'text-gray-400 group-hover:text-gray-300'}`} />}
                           {vis === 'unlisted' && <EyeOff className={`w-5 h-5 ${visibility === 'unlisted' ? 'text-wetube-red' : 'text-gray-400 group-hover:text-gray-300'}`} />}
                           {vis === 'private' && <Lock className={`w-5 h-5 ${visibility === 'private' ? 'text-wetube-red' : 'text-gray-400 group-hover:text-gray-300'}`} />}
                           <div>
                              <div className="text-sm font-medium text-white capitalize">{vis}</div>
                              <div className="text-[10px] text-gray-500">
                                 {vis === 'public' ? 'Everyone can watch' : vis === 'unlisted' ? 'Anyone with link' : 'Only you can watch'}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                  
                  {/* Schedule Option */}
                  {visibility === 'private' && !isUploading && !isCompleted && (
                     <div className="mt-2 animate-in slide-in-from-top-2 fade-in">
                        <div className="flex items-center gap-2 mb-1">
                           <Calendar className="w-4 h-4 text-gray-400" />
                           <span className="text-sm font-medium text-gray-300">Schedule (Optional)</span>
                        </div>
                        <input 
                           type="datetime-local" 
                           className="bg-[#121212] border border-[#3F3F3F] rounded px-3 py-2 text-white text-sm w-full"
                           value={scheduleDate}
                           onChange={(e) => setScheduleDate(e.target.value)}
                        />
                     </div>
                  )}
               </div>

               {/* Monetization Toggle */}
               <div className={`flex items-center justify-between p-4 bg-[#121212] border border-[#3F3F3F] rounded-xl ${isUploading || isCompleted ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="flex items-center gap-3">
                     <div className="bg-[#2a2a2a] p-2 rounded-full">
                        <DollarSign className="w-5 h-5 text-green-500" />
                     </div>
                     <div>
                        <div className="text-sm font-bold text-white">Monetization</div>
                        <div className="text-xs text-gray-400">Earn money from ads on this video</div>
                     </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" className="sr-only peer" checked={monetization} onChange={() => setMonetization(!monetization)} />
                     <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
               </div>
               
               {/* Advanced Settings Toggle */}
               <div className={`${isUploading || isCompleted ? 'opacity-50 pointer-events-none' : ''}`}>
                  <button 
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-gray-400 text-sm font-bold flex items-center gap-1 hover:text-white"
                  >
                     {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
                     <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showAdvanced && (
                     <div className="mt-4 space-y-4 pl-2 border-l-2 border-[#303030] animate-in slide-in-from-top-2 fade-in">
                        <label className="flex items-center gap-3 cursor-pointer">
                           <input 
                              type="checkbox" 
                              checked={allowComments} 
                              onChange={() => setAllowComments(!allowComments)}
                              className="accent-wetube-red w-4 h-4" 
                           />
                           <span className="text-sm text-gray-300">Allow all comments</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                           <input type="checkbox" defaultChecked className="accent-wetube-red w-4 h-4" />
                           <span className="text-sm text-gray-300">Show how many viewers like this video</span>
                        </label>
                     </div>
                  )}
               </div>

               {/* Copyright Declaration */}
               <div className={`flex items-start gap-3 p-4 bg-blue-900/20 border border-blue-800 rounded-xl ${isUploading || isCompleted ? 'opacity-50 pointer-events-none' : ''}`}>
                  <FileCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                     <h4 className="text-sm font-bold text-blue-400 mb-1">Copyright Declaration</h4>
                     <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                        By publishing this video, you certify that you own all rights to the content or have obtained necessary licenses.
                     </p>
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                           type="checkbox" 
                           checked={copyrightChecked}
                           onChange={() => setCopyrightChecked(!copyrightChecked)}
                           className="accent-blue-500 w-4 h-4"
                        />
                        <span className="text-xs font-bold text-white">I certify that I have the rights to this content.</span>
                     </label>
                  </div>
               </div>

             </div>

             <div className="pt-4 mt-auto flex justify-end gap-3">
               {!isCompleted ? (
                   <>
                        <Button variant="ghost" onClick={handleRemoveFile} disabled={isUploading}>
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={handlePublish}
                            disabled={isUploading || !title || !copyrightChecked}
                            isLoading={isUploading}
                        >
                            {isUploading ? 'Uploading...' : 'Publish Video'}
                        </Button>
                   </>
               ) : (
                   <Button variant="primary" onClick={handleRemoveFile}>
                       Upload Another
                   </Button>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
