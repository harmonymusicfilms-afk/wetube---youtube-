import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, Loader2 } from './Icons';
import { ChatMessage } from '../types';
import { createChatSession } from '../services/gemini';
import { Chat } from '@google/genai';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: 'Hi! I am your Wetube Assistant. Ask me anything about video creation, trends, or finding content.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!chatSessionRef.current) {
      chatSessionRef.current = createChatSession();
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const resultStream = await chatSessionRef.current.sendMessageStream({
        message: userMsg.text
      });
      
      const modelMsgId = (Date.now() + 1).toString();
      let fullText = "";

      // Initial placeholder
      setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', timestamp: Date.now() }]);

      for await (const chunk of resultStream) {
        const text = chunk.text || ""; // Access text property directly
        fullText += text;
        setMessages(prev => prev.map(msg => 
          msg.id === modelMsgId ? { ...msg, text: fullText } : msg
        ));
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "Sorry, I encountered an error. Please try again.", 
        timestamp: Date.now() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* FAB */}
      {!isOpen && (
        <button 
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-wetube-red hover:bg-red-600 text-white p-4 rounded-full shadow-xl z-50 transition-all hover:scale-110"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-wetube-gray p-4 flex justify-between items-center border-b border-[#3F3F3F]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-wetube-red" />
              <h3 className="font-bold text-white">Wetube Assistant</h3>
            </div>
            <button onClick={toggleChat} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#121212]">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-wetube-gray text-white rounded-br-none' 
                      : 'bg-wetube-red text-white rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-[#1F1F1F] border-t border-[#3F3F3F]">
            <div className="flex items-center gap-2 bg-[#121212] rounded-full px-4 py-2 border border-[#3F3F3F] focus-within:border-gray-500">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about videos..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-500"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()}
                className={`p-1 rounded-full ${input.trim() ? 'text-wetube-red hover:bg-[#2A2A2A]' : 'text-gray-600'}`}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;