import React from 'react';
import { Repository } from '../types';
import { ExternalLink, Star, Calendar, Box, Code2 } from 'lucide-react';
import MarkdownViewer from './MarkdownViewer';

interface Props {
  repo: Repository;
}

const PromptCard: React.FC<Props> = ({ repo }) => {
  const getEnvColor = (env: string) => {
    switch (env) {
      case 'Docker': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Node.js': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Python': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Go': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Rust': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="bg-[#161B22] border border-[#30363d] rounded-2xl overflow-hidden flex flex-col hover:border-[#00F5FF]/50 transition-all group shadow-lg">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${getEnvColor(repo.environment)}`}>
            <Box size={10} />
            {repo.environment}
          </div>
          <div className="flex gap-2">
            <a 
              href={repo.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-white transition-colors p-1"
            >
              <Star size={18} />
            </a>
            <a 
              href={repo.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-[#00F5FF] transition-colors p-1"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#00F5FF] transition-colors truncate">
          {repo.name}
        </h3>
        <p className="text-xs text-gray-500 font-mono mb-4">{repo.full_name}</p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {repo.tags.map(tag => (
            <span key={tag} className="text-[10px] bg-[#0B0E14] text-gray-400 px-2 py-0.5 rounded border border-[#30363d]">
              #{tag}
            </span>
          ))}
        </div>

        <div className="bg-[#0B0E14] rounded-xl p-4 border border-[#30363d] mb-4">
          <MarkdownViewer content={repo.summary} />
        </div>
      </div>

      <div className="px-5 py-3 bg-[#0B0E14]/50 border-t border-[#30363d] flex justify-between items-center text-[11px] font-mono text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          {new Date(repo.created_at).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1">
          <Star size={12} className="text-yellow-500/50" />
          {repo.stars.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
