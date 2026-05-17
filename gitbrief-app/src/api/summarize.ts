import { Repository, SummaryCache } from '../types';

/**
 * [알잘딱 기능] Gemini API 호출 및 캐싱 로직
 * - 이미 요청했던 URL은 캐시에서 즉시 반환 (0.1초 미만)
 * - 새로운 URL은 Gemini API (모의) 호출 후 결과 반환
 */
export const summarizeRepo = async (url: string, cache: SummaryCache): Promise<Repository> => {
  // 1. 캐시 확인 (알잘딱 성능 최적화)
  if (cache[url]) {
    console.log('[Cache Hit] Returning existing summary for:', url);
    return new Promise((resolve) => setTimeout(() => resolve(cache[url]), 100));
  }

  console.log('[Cache Miss] Calling Gemini API for:', url);

  // 2. Gemini API 호출 시뮬레이션 (실제 구현 시 fetch(`${GEMINI_ENDPOINT}`, ...))
  await new Promise((resolve) => setTimeout(resolve, 1500)); // AI 처리 지연 시뮬레이션

  const repoName = url.split('/').pop() || 'unknown-repo';
  
  // 모의 응답 데이터 (AI가 분석한 것으로 가정)
  const mockResult: Repository = {
    id: Math.random().toString(36).substring(7),
    name: repoName.charAt(0).toUpperCase() + repoName.slice(1),
    full_name: url.replace('https://github.com/', ''),
    description: `${repoName}은 현대적인 웹 개발을 위한 고성능 오픈소스 라이브러리입니다.`,
    url: url,
    stars: Math.floor(Math.random() * 50000),
    tags: ['React', 'TypeScript', 'Frontend', 'DX'],
    environment: detectEnvironment(repoName), // 환경 감지 로직
    summary: `### 🚀 한 줄 요약
**${repoName}**은(는) 개발자 경험을 극대화하는 강력한 툴킷입니다.

### 🛠 주요 기능
- **고성능 렌더링**: 가상 DOM을 활용한 최적화
- **강력한 타입 시스템**: TS 기반의 안정적인 코드 작성
- **원클릭 배포**: CI/CD 파이프라인 완벽 지원

### 📦 설치 방법
\`\`\`bash
npm install ${repoName}
\`\`\`
`,
    created_at: new Date().toISOString(),
  };

  return mockResult;
};

// [알잘딱] 레포 이름이나 키워드로 배포 환경 감지 (모의 AI 로직)
const detectEnvironment = (name: string): Repository['environment'] => {
  const n = name.toLowerCase();
  if (n.includes('docker')) return 'Docker';
  if (n.includes('react') || n.includes('node') || n.includes('next')) return 'Node.js';
  if (n.includes('flask') || n.includes('django') || n.includes('python')) return 'Python';
  if (n.includes('rust')) return 'Rust';
  if (n.includes('go')) return 'Go';
  return 'Unknown';
};
