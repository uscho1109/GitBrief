import React from 'react';
import { Github, ExternalLink, Star, Package } from 'lucide-react';
import { RepositorySummary } from '../types';

export const PromptCard: React.FC<{ repo: RepositorySummary; onClick: () => void }> = ({ repo, onClick }) => {
  const envColors: Record<string, string> = {
    Docker: 'bg-blue-900/40 text-blue-400 border-blue-400/30',
    'Node.js': 'bg-green-900/40 text-green-400 border-green-400/30',
    Python: 'bg-yellow-900/40 text-yellow-400 border-yellow-400/30',
    Go: 'bg-cyan-900/40 text-cyan-400 border-cyan-400/30',
    Other: 'bg-gray-800 text-gray-400 border-gray-600',
  };

  return (
    <div 
      onClick={onClick}
      className="group relative bg-[#161B22] border border-[#30363d] rounded-xl p-5 hover:border-[#00F5FF]/50 transition-all duration-300 cursor-pointer flex flex-col gap-3"
    >
      <div className="flex justify-between items-start">
        <span className={`px-2 py-1 rounded text-[10px] font-bold border ${envColors[repo.environment] || envColors.Other}`}>
          {repo.environment}
        </span>
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-[#30363d] rounded-md transition-colors" title="View on GitHub">
            <Github size={16} className="text-gray-400 group-hover:text-white" />
          </button>
          <button className="p-1.5 hover:bg-[#30363d] rounded-md transition-colors" title="Open Link">
            <ExternalLink size={16} className="text-gray-400 group-hover:text-[#00F5FF]" />
          </button>
        </div>
      </div>

      <div className="mt-1">
        <h3 className="text-lg font-bold text-white group-hover:text-[#00F5FF] truncate">{repo.name}</h3>
        <p className="text-sm text-gray-400 line-clamp-2 mt-1 leading-relaxed">{repo.oneLiner}</p>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {repo.techTags.map(tag => (
          <span key={tag} className="text-[11px] bg-[#0B0E14] text-gray-300 px-2 py-0.5 rounded border border-[#30363d]">
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between text-[12px] text-gray-500">
        <div className="flex items-center gap-1">
          <Star size={12} className="text-yellow-500" />
          <span>{repo.stars.toLocaleString()}</span>
        </div>
        <span>{new Date(repo.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};
