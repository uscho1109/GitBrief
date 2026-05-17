import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';

interface Props {
  content: string;
}

const MarkdownViewer: React.FC<Props> = ({ content }) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="prose prose-invert max-w-none prose-pre:bg-[#161B22] prose-pre:border prose-pre:border-[#30363d]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && match) {
              return (
                <div className="relative group">
                  <button
                    onClick={() => handleCopy(codeString)}
                    className="absolute right-2 top-2 p-1.5 rounded-md bg-[#0B0E14] border border-[#30363d] text-gray-400 hover:text-[#00F5FF] hover:border-[#00F5FF] transition-all opacity-0 group-hover:opacity-100"
                    title="Copy code"
                  >
                    {copiedText === codeString ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                  {copiedText === codeString && (
                    <span className="absolute right-10 top-2.5 text-[10px] text-green-500 animate-in fade-in duration-300">
                      Copied!
                    </span>
                  )}
                  <pre className={className} {...props}>
                    <code>{children}</code>
                  </pre>
                </div>
              );
            }
            return <code className={className} {...props}>{children}</code>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
