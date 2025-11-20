import React, { useState, useRef } from 'react';
import { ImageIcon, Loader2, Upload, Sparkles, X } from '../Icons';
import { editImage } from '../../services/gemini';

const ImageEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setEditedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt) return;

    setIsProcessing(true);
    setError(null);

    try {
      const resultUrl = await editImage(selectedImage, prompt);
      setEditedImage(resultUrl);
    } catch (err) {
      setError("Failed to edit image. Please try again.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
    setEditedImage(null);
    setPrompt('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8 text-wetube-red" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Magic Image Editor</h1>
        <p className="text-gray-400">Upload an image and tell Gemini 2.5 Flash to transform it.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input Area */}
        <div className="bg-[#1F1F1F] rounded-2xl p-6 border border-[#3F3F3F] flex flex-col gap-6 h-fit">
          {!selectedImage ? (
            <div 
              className="border-2 border-dashed border-[#3F3F3F] rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-[#252525] hover:border-gray-500 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-10 h-10 text-gray-500 mb-3" />
              <p className="text-gray-300 font-medium">Click to upload image</p>
              <p className="text-gray-600 text-sm mt-1">PNG, JPG up to 5MB</p>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-[#3F3F3F]">
              <img src={selectedImage} alt="Original" className="w-full object-contain max-h-64" />
              <button 
                onClick={clearSelection}
                className="absolute top-2 right-2 bg-black/60 p-1 rounded-full text-white hover:bg-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 text-xs rounded text-white">Original</div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-300">Editing Instruction</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={!selectedImage}
              placeholder="e.g., 'Add a retro filter', 'Remove the person in the background', 'Make it snow'"
              className="bg-[#121212] border border-[#3F3F3F] rounded-lg px-4 py-3 text-white focus:border-wetube-red focus:outline-none transition-colors resize-none h-24 disabled:opacity-50"
            />
            <button
              onClick={handleEdit}
              disabled={isProcessing || !prompt || !selectedImage}
              className="w-full bg-wetube-red hover:bg-red-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Apply Magic Edit
            </button>
             {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          </div>
        </div>

        {/* Right: Result Area */}
        <div className="bg-[#1F1F1F] rounded-2xl p-6 border border-[#3F3F3F] flex flex-col items-center justify-center min-h-[400px]">
           {editedImage ? (
             <div className="w-full flex flex-col gap-4 animate-in fade-in duration-500">
                <div className="relative rounded-xl overflow-hidden border border-[#3F3F3F] bg-black">
                  <img src={editedImage} alt="Edited" className="w-full object-contain" />
                  <div className="absolute bottom-2 left-2 bg-wetube-red px-2 py-1 text-xs rounded text-white font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Edited
                  </div>
                </div>
                <div className="flex justify-center">
                  <a 
                    href={editedImage} 
                    download="wetube-edited.png"
                    className="text-wetube-red hover:underline text-sm font-medium"
                  >
                    Download Image
                  </a>
                </div>
             </div>
           ) : (
             <div className="text-center text-gray-500">
               {isProcessing ? (
                 <div className="flex flex-col items-center gap-3">
                   <Loader2 className="w-10 h-10 animate-spin text-wetube-red" />
                   <p>Gemini is processing your image...</p>
                 </div>
               ) : (
                 <>
                   <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-20" />
                   <p>Edited result will appear here</p>
                 </>
               )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;