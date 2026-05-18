import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ChatSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { auth, messages, sendMessage, login } = useStore();
  const [input, setInput] = useState('');
  const [nicknameInput, setNicknameInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (nicknameInput.trim()) {
      login(nicknameInput.trim());
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#161B22] border-l border-[#30363d] z-50 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-[#30363d] flex justify-between items-center bg-[#0B0E14]">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-[#00F5FF]" />
              <h2 className="font-bold text-white tracking-tight">LIVE BRIEF CHAT</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-[#30363d] rounded-full text-gray-400">
              <X size={20} />
            </button>
          </div>

          {!auth.isLoggedIn ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-6">
              <div className="w-16 h-16 bg-[#30363d] rounded-full flex items-center justify-center">
                <User size={32} className="text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Join the Community</h3>
                <p className="text-gray-400 mt-2 text-sm">Enter a nickname to start chatting with other developers.</p>
              </div>
              <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Enter Nickname..."
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  className="bg-[#0B0E14] border border-[#30363d] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00F5FF] w-full"
                  autoFocus
                />
                <button type="submit" className="bg-[#00F5FF] text-[#0B0E14] font-bold py-3 rounded-lg hover:brightness-110 transition-all">
                  START CHATTING
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#30363d]">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.nickname === auth.nickname ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-gray-500">{msg.nickname}</span>
                      <span className="text-[10px] text-gray-600">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className={`px-3 py-2 rounded-2xl text-sm max-w-[85%] ${
                      msg.nickname === auth.nickname 
                        ? 'bg-[#00F5FF] text-[#0B0E14] rounded-tr-none' 
                        : 'bg-[#30363d] text-white rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <form onSubmit={handleSend} className="p-4 bg-[#0B0E14] border-t border-[#30363d] flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-[#161B22] border border-[#30363d] rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00F5FF]"
                />
                <button type="submit" className="p-2 bg-[#00F5FF] text-[#0B0E14] rounded-full hover:scale-105 transition-transform">
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
