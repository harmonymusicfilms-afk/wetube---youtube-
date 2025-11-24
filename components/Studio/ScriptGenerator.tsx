import React, { useState } from 'react';
import { FileText, Loader2, Sparkles, CheckCircle, Trash2, Film, Copy } from '../Icons';
import { generateViralScript } from '../../services/gemini';
import { ScriptInputs } from '../../types';
import Input from '../Input';
import Button from '../Button';
import { useToast } from '../../contexts/ToastContext';

const ScriptGenerator: React.FC = () => {
  const { success } = useToast();
  const [inputs, setInputs] = useState<ScriptInputs>({
    topic: '',
    niche: '',
    audience: '',
    tone: 'motivational',
    duration: 30,
    style: 'storytelling'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!inputs.topic || !inputs.niche) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const scriptContent = await generateViralScript(inputs);
      setResult(scriptContent);
    } catch (err) {
      setError("Failed to generate script. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: keyof ScriptInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setInputs({
      topic: '',
      niche: '',
      audience: '',
      tone: 'motivational',
      duration: 30,
      style: 'storytelling'
    });
    setResult(null);
    setError(null);
  };

  const getHashtags = () => {
    if (!result) return '';
    const matches = result.match(/#[a-zA-Z0-9_]+/g);
    return matches ? matches.join(' ') : '';
  };

  const handleCopyHashtags = () => {
    const hashtags = getHashtags();
    if (hashtags) {
      navigator.clipboard.writeText(hashtags);
      success("Hashtags copied to clipboard!");
    }
  };

  const handleCopyAll = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      success("Full script copied!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-wetube-red" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Viral Shorts Script Generator</h1>
        <p className="text-gray-400">Create addictive Hinglish scripts with B-roll, tags, and thumbnail text.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left: Input Form */}
        <div className="xl:col-span-1 bg-[#1F1F1F] rounded-2xl p-6 border border-[#3F3F3F] h-fit">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-wetube-red" /> Script Details
            </h3>
            <button 
              onClick={handleClear}
              className="text-gray-500 hover:text-white transition-colors"
              title="Reset form"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-5">
            <Input 
              label="Topic"
              placeholder="e.g., Why 5AM is a scam"
              value={inputs.topic}
              onChange={(e) => handleInputChange('topic', e.target.value)}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Niche"
                placeholder="e.g., Productivity"
                value={inputs.niche}
                onChange={(e) => handleInputChange('niche', e.target.value)}
              />
              <Input 
                label="Audience"
                placeholder="e.g., Students"
                value={inputs.audience}
                onChange={(e) => handleInputChange('audience', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Tone</label>
              <select 
                value={inputs.tone}
                onChange={(e) => handleInputChange('tone', e.target.value)}
                className="w-full bg-[#121212] border border-[#3F3F3F] rounded-lg px-4 py-2.5 text-white focus:border-wetube-red focus:outline-none appearance-none"
              >
                <option value="funny">Funny</option>
                <option value="motivational">Motivational</option>
                <option value="educational">Educational</option>
                <option value="dramatic">Dramatic</option>
                <option value="cinematic">Cinematic</option>
                <option value="savage">Savage</option>
                <option value="emotional">Emotional</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Style Type</label>
              <select 
                value={inputs.style}
                onChange={(e) => handleInputChange('style', e.target.value)}
                className="w-full bg-[#121212] border border-[#3F3F3F] rounded-lg px-4 py-2.5 text-white focus:border-wetube-red focus:outline-none appearance-none"
              >
                <option value="storytelling">Storytelling</option>
                <option value="normal facts">Normal Facts</option>
                <option value="suspense">Suspense</option>
                <option value="tips">Tips</option>
                <option value="hacks">Hacks</option>
                <option value="drama">Drama</option>
                <option value="comedy">Comedy</option>
                <option value="fast-paced value">Fast-paced Value</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Duration: {inputs.duration}s</label>
              <input 
                type="range" 
                min="15" 
                max="60" 
                step="1"
                value={inputs.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                className="w-full h-2 bg-[#3F3F3F] rounded-lg appearance-none cursor-pointer accent-wetube-red"
              />
            </div>

            <Button 
              variant="primary" 
              onClick={handleGenerate} 
              isLoading={isGenerating}
              disabled={!inputs.topic || !inputs.niche}
              className="w-full mt-2"
            >
              Generate Scripts
            </Button>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>
        </div>

        {/* Right: Output Display */}
        <div className="xl:col-span-2 bg-[#1F1F1F] rounded-2xl p-8 border border-[#3F3F3F] min-h-[600px] shadow-xl">
          {result ? (
            <div className="animate-in fade-in duration-500 h-full flex flex-col">
               <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#3F3F3F]">
                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-500" /> Generated Scripts
                 </h2>
                 <div className="flex gap-2">
                   {getHashtags() && (
                     <Button variant="secondary" size="sm" onClick={handleCopyHashtags} icon={<Copy className="w-3 h-3" />}>
                       Hashtags
                     </Button>
                   )}
                   <Button variant="secondary" size="sm" onClick={handleCopyAll}>
                     Copy All
                   </Button>
                 </div>
               </div>
               <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                 <div className="prose prose-invert max-w-none whitespace-pre-wrap text-gray-300 text-sm leading-relaxed font-mono bg-[#121212] p-6 rounded-xl border border-[#333]">
                   {result}
                 </div>
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
              {isGenerating ? (
                <>
                  <Loader2 className="w-12 h-12 animate-spin text-wetube-red" />
                  <div className="text-center">
                    <p className="text-white font-medium text-lg">Cooking up viral concepts...</p>
                    <p className="text-sm text-gray-400 mt-1">Generating 3 variations, B-roll, and hashtags...</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-[#121212] rounded-full flex items-center justify-center border border-[#333] shadow-inner relative">
                    <Sparkles className="w-10 h-10 opacity-30 text-wetube-red" />
                    <div className="absolute -right-2 -bottom-2 bg-wetube-red rounded-full p-2">
                       <Film className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <p className="text-lg font-medium">Fill in the details and hit Generate</p>
                  <p className="text-sm text-gray-600 max-w-xs text-center">
                    Gemini 3 Pro will create 3 viral variations including scene-by-scene B-roll, 15 SEO hashtags, and 5 thumbnails.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScriptGenerator;