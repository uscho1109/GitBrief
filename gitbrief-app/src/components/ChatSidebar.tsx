import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, MessageSquare } from 'lucide-react';

const ChatSidebar: React.FC = () => {
  const { messages, sendMessage, isChatOpen, setChatOpen, user } = useApp();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <>
      {/* Overlay */}
      {isChatOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setChatOpen(false)}
        />
      )}

      {/* Sidebar (Inventory Style) */}
      <div className={`fixed top-0 right-0 h-full w-[350px] bg-[#161B22] border-l border-[#30363d] z-50 transform transition-transform duration-300 ease-in-out ${isChatOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col shadow-2xl`}>
        <div className="p-4 border-b border-[#30363d] flex justify-between items-center bg-[#0B0E14]">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-[#00F5FF]" />
            <h2 className="text-white font-bold tracking-tight">LIVE CHANNEL</h2>
          </div>
          <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B0E14]/50 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col">
              <span className={`text-[11px] font-mono ${msg.user === user.nickname ? 'text-[#00F5FF] self-end' : 'text-gray-500'}`}>
                {msg.user} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <div className={`mt-1 p-2.5 rounded-lg text-sm max-w-[85%] ${msg.user === user.nickname ? 'bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-white self-end' : 'bg-[#161B22] border border-[#30363d] text-gray-300'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-[#30363d] bg-[#0B0E14]">
          {user.isLoggedIn ? (
            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="메시지 입력..."
                className="w-full bg-[#161B22] border border-[#30363d] rounded-lg py-2.5 pl-3 pr-10 text-sm text-white focus:outline-none focus:border-[#00F5FF] transition-all placeholder:text-gray-600"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00F5FF] transition-colors">
                <Send size={18} />
              </button>
            </div>
          ) : (
            <div className="text-center py-2 text-xs text-gray-500 font-mono">
              채팅에 참여하려면 로그인이 필요합니다.
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default ChatSidebar;
