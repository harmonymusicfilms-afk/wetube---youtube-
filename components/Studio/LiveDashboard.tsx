
import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, Signal, Key, Settings2, MonitorUp, Webcam, 
  Copy, Eye, MessageSquare, AlertCircle, CheckCircle,
  Globe, Lock, EyeOff, ChevronDown, X, Activity, MoreHorizontal
} from '../Icons';
import Button from '../Button';
import Input from '../Input';
import { useToast } from '../../contexts/ToastContext';
import { generateStreamKey, getStreamServer, getInitialStats, simulateStreamHealth } from '../../services/streamService';
import { StreamSettings, StreamStats } from '../../types';
import { CATEGORIES } from '../../constants';
import LiveChat from '../LiveChat';

const LiveDashboard: React.FC = () => {
  const { success, error } = useToast();
  
  // Setup State
  const [mode, setMode] = useState<'software' | 'webcam'>('software');
  const [streamKey, setStreamKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [serverUrl, setServerUrl] = useState('');
  
  // Stream State
  const [isLive, setIsLive] = useState(false);
  const [stats, setStats] = useState<StreamStats>(getInitialStats());
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Settings Form
  const [title, setTitle] = useState('My Awesome Live Stream');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [visibility, setVisibility] = useState<'public' | 'private' | 'unlisted'>('public');
  const [latency, setLatency] = useState<'normal' | 'low' | 'ultra-low'>('low');

  useEffect(() => {
    setStreamKey(generateStreamKey());
    setServerUrl(getStreamServer());
    
    return () => {
       stopWebcam();
    };
  }, []);

  // Stats Simulation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLive) {
      interval = setInterval(() => {
        setStats(prev => simulateStreamHealth(prev));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      error("Could not access camera/microphone");
      console.error(err);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (mode === 'webcam') {
      startWebcam();
    } else {
      stopWebcam();
    }
  }, [mode]);

  const toggleLive = () => {
    if (isLive) {
      // End Stream
      setIsLive(false);
      setStats(getInitialStats());
      success("Stream ended successfully.");
    } else {
      // Start Stream
      if (!title) {
        error("Please add a title first");
        return;
      }
      setIsLive(true);
      setStats(prev => ({ ...prev, isLive: true, health: 'good' }));
      success("You are now LIVE!");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    success("Copied to clipboard");
  };

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  return (
    <div className="h-[calc(100vh-56px)] bg-[#121212] overflow-hidden flex">
      {/* LEFT: Stream Controls & Preview */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="p-6 border-b border-[#3F3F3F] flex justify-between items-center bg-[#1F1F1F]">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isLive ? 'bg-red-500/20' : 'bg-[#2a2a2a]'}`}>
              <Radio className={`w-6 h-6 ${isLive ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Live Control Room</h1>
              {isLive && <div className="text-xs text-red-500 font-bold uppercase tracking-wider">● Live Now</div>}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-[#121212] rounded-lg p-1 border border-[#3F3F3F]">
              <button 
                onClick={() => !isLive && setMode('software')}
                className={`px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors ${mode === 'software' ? 'bg-[#333] text-white' : 'text-gray-400 hover:text-white'}`}
                disabled={isLive}
              >
                <MonitorUp className="w-4 h-4" /> Streaming Software
              </button>
              <button 
                onClick={() => !isLive && setMode('webcam')}
                className={`px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors ${mode === 'webcam' ? 'bg-[#333] text-white' : 'text-gray-400 hover:text-white'}`}
                disabled={isLive}
              >
                <Webcam className="w-4 h-4" /> Webcam
              </button>
            </div>
            
            <Button 
              variant={isLive ? 'danger' : 'primary'} 
              onClick={toggleLive}
              className="min-w-[120px]"
            >
              {isLive ? 'End Stream' : 'Go Live'}
            </Button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Player */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-black rounded-xl overflow-hidden border border-[#3F3F3F] relative group">
              {mode === 'webcam' ? (
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover transform scale-x-[-1]" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                  {isLive ? (
                    <>
                      <div className="w-20 h-20 bg-[#222] rounded-full flex items-center justify-center animate-pulse">
                         <Signal className="w-10 h-10 text-green-500" />
                      </div>
                      <p className="text-lg font-medium text-white">Receiving signal from software...</p>
                      <p className="text-sm text-gray-400">Excellent Connection</p>
                    </>
                  ) : (
                     <>
                       <MonitorUp className="w-16 h-16 opacity-50" />
                       <p>Connect streaming software to start preview</p>
                     </>
                  )}
                </div>
              )}

              {/* Live Overlay */}
              {isLive && (
                 <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold uppercase">
                    Live • {formatTime(stats.duration)}
                 </div>
              )}
            </div>

            {/* Stream Metadata Form */}
            <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                     <Settings2 className="w-5 h-5 text-blue-400" /> Stream Settings
                  </h3>
                  <Button variant="secondary" size="sm">Edit</Button>
               </div>

               <div className="space-y-4">
                  <Input 
                     label="Title" 
                     value={title} 
                     onChange={(e) => setTitle(e.target.value)} 
                     disabled={isLive}
                  />
                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-gray-300">Description</label>
                     <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-[#121212] border border-[#3F3F3F] rounded-lg px-4 py-2 text-white resize-none h-24 focus:outline-none focus:border-wetube-red"
                        disabled={isLive}
                     />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300">Category</label>
                        <select 
                           value={category}
                           onChange={(e) => setCategory(e.target.value)}
                           className="w-full bg-[#121212] border border-[#3F3F3F] rounded-lg px-4 py-2.5 text-white focus:outline-none"
                           disabled={isLive}
                        >
                           {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300">Visibility</label>
                        <select 
                           value={visibility}
                           onChange={(e) => setVisibility(e.target.value as any)}
                           className="w-full bg-[#121212] border border-[#3F3F3F] rounded-lg px-4 py-2.5 text-white focus:outline-none"
                           disabled={isLive}
                        >
                           <option value="public">Public</option>
                           <option value="unlisted">Unlisted</option>
                           <option value="private">Private</option>
                        </select>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Key & Health */}
          <div className="space-y-6">
             {/* Stream Key (Only show in software mode) */}
             {mode === 'software' && (
               <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6">
                  <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                     <Key className="w-5 h-5 text-yellow-500" /> Stream Key
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                     Paste this key into OBS or your streaming software. Keep it secret!
                  </p>
                  
                  <div className="space-y-4">
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Stream URL</label>
                        <div className="flex gap-2">
                           <input disabled value={serverUrl} className="flex-1 bg-[#121212] border border-[#3F3F3F] rounded px-3 py-1.5 text-sm text-gray-300" />
                           <button onClick={() => copyToClipboard(serverUrl)} className="p-2 hover:bg-[#333] rounded text-gray-400"><Copy className="w-4 h-4" /></button>
                        </div>
                     </div>

                     <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Stream Key</label>
                        <div className="flex gap-2">
                           <input 
                              disabled 
                              type={showKey ? "text" : "password"} 
                              value={streamKey} 
                              className="flex-1 bg-[#121212] border border-[#3F3F3F] rounded px-3 py-1.5 text-sm text-gray-300 font-mono" 
                           />
                           <button onClick={() => setShowKey(!showKey)} className="p-2 hover:bg-[#333] rounded text-gray-400">
                              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                           </button>
                           <button onClick={() => copyToClipboard(streamKey)} className="p-2 hover:bg-[#333] rounded text-gray-400"><Copy className="w-4 h-4" /></button>
                        </div>
                     </div>

                     <div className="space-y-1 pt-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Latency</label>
                        <div className="flex gap-2 bg-[#121212] p-1 rounded border border-[#3F3F3F]">
                           {['Normal', 'Low', 'Ultra-low'].map(l => (
                              <button 
                                 key={l}
                                 onClick={() => setLatency(l.toLowerCase() as any)}
                                 className={`flex-1 text-xs py-1 rounded ${latency === l.toLowerCase() ? 'bg-[#333] text-white font-bold shadow' : 'text-gray-500 hover:text-gray-300'}`}
                              >
                                 {l}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
             )}

             {/* Stream Health */}
             <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6">
                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                   <Activity className="w-5 h-5 text-green-500" /> Stream Health
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-[#121212] p-3 rounded-lg border border-[#3F3F3F]">
                      <div className="text-xs text-gray-500 mb-1">Bitrate</div>
                      <div className="text-xl font-bold text-white">{isLive ? stats.bitrate : 0} <span className="text-xs text-gray-500 font-normal">kbps</span></div>
                   </div>
                   <div className="bg-[#121212] p-3 rounded-lg border border-[#3F3F3F]">
                      <div className="text-xs text-gray-500 mb-1">FPS</div>
                      <div className="text-xl font-bold text-white">{isLive ? 60 : 0}</div>
                   </div>
                </div>
                
                {isLive ? (
                   <div className="mt-4 flex items-center gap-2 text-green-500 text-sm font-medium bg-green-500/10 p-2 rounded">
                      <CheckCircle className="w-4 h-4" /> Excellent Connection
                   </div>
                ) : (
                   <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm font-medium bg-gray-800 p-2 rounded">
                      <AlertCircle className="w-4 h-4" /> Stream is offline
                   </div>
                )}
             </div>
             
             {/* Analytics Summary */}
             <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-6">
                <h3 className="font-bold text-white text-lg mb-4">Real-time Analytics</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center border-b border-[#303030] pb-2">
                      <span className="text-gray-400 text-sm">Concurrent Viewers</span>
                      <span className="text-white font-bold text-lg">{stats.viewers}</span>
                   </div>
                   <div className="flex justify-between items-center border-b border-[#303030] pb-2">
                      <span className="text-gray-400 text-sm">Chat Rate</span>
                      <span className="text-white font-bold text-lg">{isLive ? 12 : 0} <span className="text-xs font-normal">msgs/min</span></span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Likes</span>
                      <span className="text-white font-bold text-lg">{Math.floor(stats.viewers * 0.4)}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Live Chat Dock */}
      <div className="w-[350px] border-l border-[#3F3F3F] flex flex-col bg-[#1F1F1F]">
         <div className="p-3 border-b border-[#3F3F3F] bg-[#1F1F1F] flex justify-between items-center">
            <div className="text-sm font-bold text-white">Top Chat</div>
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
         </div>
         <div className="flex-1 overflow-hidden">
            <LiveChat isCreatorMode={true} />
         </div>
      </div>
    </div>
  );
};

export default LiveDashboard;
