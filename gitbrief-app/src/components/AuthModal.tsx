import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCircle2 } from 'lucide-react';

const AuthModal: React.FC = () => {
  const { user, login } = useApp();
  const [nickname, setNickname] = useState('');

  if (user.isLoggedIn) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      login(nickname.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0B0E14]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-[#161B22] border border-[#30363d] p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-[#00F5FF]/10 rounded-full flex items-center justify-center mb-4 border border-[#00F5FF]/20">
            <UserCircle2 size={32} className="text-[#00F5FF]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to GitBrief</h1>
          <p className="text-gray-400 text-sm">참여를 위해 멋진 닉네임을 설정해 주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase mb-2 ml-1">Nickname</label>
            <input
              autoFocus
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. CodeWizard"
              className="w-full bg-[#0B0E14] border border-[#30363d] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#00F5FF] focus:ring-1 focus:ring-[#00F5FF]/50 transition-all placeholder:text-gray-700"
              maxLength={15}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#00F5FF] text-[#0B0E14] font-bold py-3 rounded-xl hover:bg-[#00D8E0] transition-colors shadow-[0_0_20px_rgba(0,245,255,0.2)]"
          >
            시작하기
          </button>
        </form>
        
        <p className="mt-6 text-center text-[10px] text-gray-600 font-mono uppercase tracking-widest">
          No Password • No Email • Instant DX
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
