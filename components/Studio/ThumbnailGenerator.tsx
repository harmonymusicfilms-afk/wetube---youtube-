import React, { useState } from 'react';
import { Wand2, Loader2, Sparkles } from '../Icons';
import { generateThumbnail } from '../../services/gemini';
import { GeneratedImage } from '../../types';

const ThumbnailGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const imageUrl = await generateThumbnail(prompt);
      setResult({ url: imageUrl, prompt });
    } catch (err) {
      setError("Failed to generate thumbnail. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wand2 className="w-8 h-8 text-wetube-red" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">AI Thumbnail Generator</h1>
        <p className="text-gray-400">Describe your video concept and let Imagen 4 create the perfect thumbnail.</p>
      </div>

      <div className="bg-[#1F1F1F] rounded-2xl p-6 border border-[#3F3F3F] shadow-lg">
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-gray-300">Prompt</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A futuristic city with flying cars, neon lights, cinematic lighting, 8k"
              className="flex-1 bg-[#121212] border border-[#3F3F3F] rounded-lg px-4 py-3 text-white focus:border-wetube-red focus:outline-none transition-colors"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="bg-wetube-red hover:bg-red-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 transition-all"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Generate
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {result && (
          <div className="mt-8 border-t border-[#3F3F3F] pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-semibold text-white mb-4">Result</h3>
            <div className="relative group rounded-xl overflow-hidden aspect-video bg-black border border-[#3F3F3F]">
              <img 
                src={result.url} 
                alt={result.prompt} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button className="bg-white text-black px-4 py-2 rounded-full font-medium hover:scale-105 transition-transform">
                  Download
                </button>
                <button className="bg-[#1F1F1F] text-white border border-white/20 px-4 py-2 rounded-full font-medium hover:bg-[#2F2F2F] transition-colors">
                  Use as Thumbnail
                </button>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-3 text-center italic">
              Generated with imagen-4.0-generate-001
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThumbnailGenerator;