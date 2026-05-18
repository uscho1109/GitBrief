import { RepositorySummary } from '../types';

// [알잘딱 기능 3]: 인프라적 캐싱 로직
// 실제로는 Redis나 DB를 사용하겠지만, 클라이언트 사이드에서의 중복 호출 방지를 위해 Mock Cache 구현
const mockCache: Record<string, RepositorySummary> = {};

export const summarizeRepository = async (url: string): Promise<RepositorySummary> => {
  // 1. 캐시 확인
  if (mockCache[url]) {
    console.log('[Cache Hit] Returning cached summary for:', url);
    return new Promise((resolve) => setTimeout(() => resolve(mockCache[url]), 100)); // 0.1초 만에 반환
  }

  console.log('[Cache Miss] Calling Gemini API for:', url);
  
  // 2. Gemini API 호출 시뮬레이션
  // 실제 구현시: const response = await fetch('/api/gemini/summarize', { method: 'POST', body: JSON.stringify({ url }) });
  await new Promise(resolve => setTimeout(resolve, 1500));

  const newSummary: RepositorySummary = {
    id: Math.random().toString(36).substr(2, 9),
    url,
    name: url.split('/').pop() || 'Awesome-Repo',
    oneLiner: 'A revolutionary open-source project that simplifies complex workflows.',
    description: 'Detailed analysis and guide for the project.',
    techTags: ['TypeScript', 'React', 'Gemini'],
    environment: 'Node.js',
    stars: Math.floor(Math.random() * 10000),
    summary: `# Summary for ${url}\n\n## Overview\nThis project is built with high efficiency.\n\n## Quick Start\n\`\`\`bash\nnpm install && npm start\n\`\`\`\n\n## Architecture\nUses a clean architecture with modular components.`,
    createdAt: new Date().toISOString(),
  };

  // 3. 캐시에 저장
  mockCache[url] = newSummary;
  return newSummary;
};
