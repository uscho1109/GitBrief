import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Github, LayoutGrid, MessageSquare, LogOut } from 'lucide-react';
import AuthModal from './AuthModal';
import ChatSidebar from './ChatSidebar';
import { summarizeRepo } from '../api/summarize';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, setChatOpen, addRepository, cache } = useApp();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes('github.com')) {
      alert('유효한 GitHub URL을 입력해 주세요.');
      return;
    }

    setLoading(true);
    try {
      // 알잘딱 캐싱 로직: API 호출 전 캐시 확인은 summarizeRepo 내부 혹은 여기서 수행
      const result = await summarizeRepo(url, cache);
      addRepository(result);
      setUrl('');
    } catch (error) {
      console.error(error);
      alert('요약 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-gray-300 font-sans selection:bg-[#00F5FF]/30 selection:text-[#00F5FF]">
      <AuthModal />
      <ChatSidebar />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0B0E14]/80 backdrop-blur-md border-b border-[#30363d] z-30 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#00F5FF] to-[#0057FF] rounded-lg flex items-center justify-center text-[#0B0E14]">
            <Github size={20} weight="fill" />
          </div>
          <span className="text-white font-black tracking-tighter text-xl italic">GitBrief</span>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-12 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00F5FF] transition-colors" size={18} />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/facebook/react"
            className="w-full bg-[#161B22] border border-[#30363d] rounded-full py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[#00F5FF] focus:ring-1 focus:ring-[#00F5FF]/20 transition-all"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
              <span className="w-1 h-1 bg-[#00F5FF] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1 h-1 bg-[#00F5FF] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1 h-1 bg-[#00F5FF] rounded-full animate-bounce"></span>
            </div>
          )}
        </form>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setChatOpen(true)}
            className="p-2 hover:bg-[#161B22] rounded-lg text-gray-400 hover:text-[#00F5FF] transition-all relative"
          >
            <MessageSquare size={22} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0B0E14]"></span>
          </button>
          
          <div className="h-6 w-px bg-[#30363d] mx-2"></div>
          
          {user.isLoggedIn && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">{user.nickname}</span>
              <button onClick={logout} className="text-gray-500 hover:text-red-400 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {children}
      </main>
      
      {/* Background Glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00F5FF]/5 blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0057FF]/5 blur-[120px] pointer-events-none -z-10"></div>
    </div>
  );
};

export default Layout;
