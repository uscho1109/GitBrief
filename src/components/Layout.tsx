import React, { useState } from 'react';
import { Search, Boxes, Loader2, CodeXml, Terminal } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { summarizeRepository } from '../api/summarize';
import { PromptCard } from './PromptCard';
import { ChatSidebar } from './ChatSidebar';
import { MarkdownViewer } from './MarkdownViewer';
import { RepositorySummary } from '../types';

export const Layout: React.FC = () => {
  const { feed, addSummary } = useStore();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<RepositorySummary | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setLoading(true);
    try {
      const result = await summarizeRepository(url);
      addSummary(result);
      setSelectedRepo(result);
      setUrl('');
    } catch (err) {
      alert('Error summarizing repository');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white font-sans selection:bg-[#00F5FF]/30">
      {/* Header */}
      <nav className="sticky top-0 z-40 bg-[#0B0E14]/80 backdrop-blur-md border-b border-[#30363d] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#00F5FF] p-1.5 rounded-lg">
              <Terminal size={24} className="text-[#0B0E14]" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white">GIT<span className="text-[#00F5FF]">BRIEF</span></h1>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl w-full relative group">
            <input
              type="text"
              placeholder="Paste GitHub Repository URL (e.g., https://github.com/facebook/react)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-[#161B22] border border-[#30363d] rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#00F5FF] group-hover:border-[#444c56] transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00F5FF]" size={18} />
            {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00F5FF] animate-spin" size={18} />}
          </form>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 bg-[#161B22] border border-[#30363d] px-4 py-2 rounded-full hover:bg-[#30363d] transition-all"
            >
              <Boxes size={18} className="text-[#00F5FF]" />
              <span className="text-sm font-bold">INVENTORY</span>
            </button>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <CodeXml size={24} className="text-gray-400 hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {feed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-[#161B22] rounded-full flex items-center justify-center mb-6 border border-[#30363d]">
              <Boxes size={40} className="text-[#00F5FF]" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Welcome to the future of OSS Research.</h2>
            <p className="text-gray-400 max-w-md">Paste any repository URL above to get an instant AI-powered brief, architecture map, and community insight.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feed.map((repo) => (
              <PromptCard key={repo.id} repo={repo} onClick={() => setSelectedRepo(repo)} />
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedRepo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0E14]/90 backdrop-blur-sm">
          <div className="bg-[#161B22] border border-[#30363d] w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#30363d] flex justify-between items-start bg-[#0B0E14]">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  {selectedRepo.name}
                  <span className="text-xs bg-green-900/40 text-green-400 border border-green-400/30 px-2 py-1 rounded">
                    {selectedRepo.environment}
                  </span>
                </h2>
                <p className="text-gray-400 mt-1">{selectedRepo.url}</p>
              </div>
              <button onClick={() => setSelectedRepo(null)} className="p-2 hover:bg-[#30363d] rounded-full">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-[#0B0E14]/50">
              <MarkdownViewer content={selectedRepo.summary} />
            </div>
            <div className="p-6 border-t border-[#30363d] flex justify-end gap-3 bg-[#0B0E14]">
              <button 
                onClick={() => setSelectedRepo(null)}
                className="px-6 py-2 rounded-lg border border-[#30363d] hover:bg-[#30363d] font-bold"
              >
                CLOSE
              </button>
              <a 
                href={selectedRepo.url} 
                target="_blank" 
                rel="noreferrer"
                className="px-6 py-2 rounded-lg bg-[#00F5FF] text-[#0B0E14] font-bold hover:brightness-110 flex items-center gap-2"
              >
                VISIT REPOSITORY <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

const X = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
