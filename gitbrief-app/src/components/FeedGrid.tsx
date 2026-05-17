import React from 'react';
import { useApp } from '../context/AppContext';
import PromptCard from './PromptCard';
import { LayoutGrid, Sparkles } from 'lucide-react';

const FeedGrid: React.FC = () => {
  const { feed } = useApp();

  if (feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center border-2 border-dashed border-[#30363d] rounded-3xl p-12 bg-[#161B22]/20">
        <div className="w-16 h-16 bg-[#00F5FF]/5 rounded-full flex items-center justify-center mb-6">
          <Sparkles size={32} className="text-[#00F5FF]/30" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Explore the Open Source World</h2>
        <p className="text-gray-500 max-w-sm">GitHub 레포지토리 URL을 입력하여 AI 요약과 실시간 인사이트를 얻어보세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 border-b border-[#30363d] pb-4">
        <LayoutGrid size={20} className="text-[#00F5FF]" />
        <h2 className="text-white font-bold tracking-tight">EXPLORE FEED</h2>
        <span className="bg-[#00F5FF]/10 text-[#00F5FF] text-[10px] px-2 py-0.5 rounded-full border border-[#00F5FF]/20 ml-2">
          {feed.length} Repos
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feed.map((repo) => (
          <PromptCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
};

export default FeedGrid;
