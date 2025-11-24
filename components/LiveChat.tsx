
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MoreVertical, ThumbsUp, Smile } from './Icons';
import Input from './Input';

interface LiveChatMessage {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: number;
  isModerator?: boolean;
  isOwner?: boolean;
}

interface LiveChatProps {
  isCreatorMode?: boolean;
}

const LiveChat: React.FC<LiveChatProps> = ({ isCreatorMode = false }) => {
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock initial messages
  useEffect(() => {
    setMessages([
      { id: '1', user: 'Alex Tech', avatar: 'https://ui-avatars.com/api/?name=Alex', message: 'Can\'t wait for this!', timestamp: Date.now() - 10000 },
      { id: '2', user: 'Sarah Design', avatar: 'https://ui-avatars.com/api/?name=Sarah', message: 'Hello from London! 🇬🇧', timestamp: Date.now() - 5000 },
    ]);

    // Simulate incoming messages
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const mockNames = ['John', 'Emma', 'Mike', 'Lisa', 'David'];
        const mockMsgs = ['Awesome!', 'Cool setup', 'Is this live?', 'Love the content', 'Hi everyone'];
        const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
        
        const msg: LiveChatMessage = {
          id: Date.now().toString(),
          user: randomName,
          avatar: `https://ui-avatars.com/api/?name=${randomName}&background=random`,
          message: mockMsgs[Math.floor(Math.random() * mockMsgs.length)],
          timestamp: Date.now()
        };
        
        setMessages(prev => [...prev.slice(-50), msg]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;

    const msg: LiveChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      avatar: 'https://ui-avatars.com/api/?name=You&background=purple&color=fff',
      message: newMessage,
      timestamp: Date.now(),
      isOwner: isCreatorMode
    };

    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F] border-l border-[#3F3F3F]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-2 items-start group animate-in fade-in slide-in-from-bottom-1 duration-200">
            <img src={msg.avatar} alt={msg.user} className="w-6 h-6 rounded-full mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className={`text-xs font-bold ${msg.isOwner ? 'text-yellow-500' : msg.isModerator ? 'text-blue-400' : 'text-gray-400'}`}>
                  {msg.user}
                </span>
                {msg.isOwner && <span className="bg-yellow-500/20 text-yellow-500 text-[10px] px-1 rounded">Owner</span>}
              </div>
              <p className="text-sm text-white break-words leading-tight">{msg.message}</p>
            </div>
            <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-[#3F3F3F] bg-[#1F1F1F]">
        <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">Y</div>
              <span className="text-xs text-gray-400">Chat as You</span>
           </div>
           <div className="relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Say something..."
                className="w-full bg-[#121212] border border-[#3F3F3F] rounded-full pl-4 pr-10 py-2 text-sm text-white focus:outline-none focus:border-gray-500 placeholder-gray-600"
                maxLength={200}
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-transparent text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
           </div>
           <div className="flex justify-between items-center px-1">
              <button type="button" className="text-gray-400 hover:text-yellow-500">
                <Smile className="w-5 h-5" />
              </button>
              <span className="text-xs text-gray-600">{newMessage.length}/200</span>
           </div>
        </form>
      </div>
    </div>
  );
};

export default LiveChat;
