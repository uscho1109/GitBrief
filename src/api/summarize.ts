import { RepositorySummary } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const mockCache: Record<string, RepositorySummary> = {};

export const summarizeRepository = async (url: string): Promise<RepositorySummary> => {
  if (mockCache[url]) {
    return mockCache[url];
  }

  // 1. GitHub API를 통해 README 및 메타데이터 가져오기 (실제 구현 시 Octokit 사용 권장)
  // 여기서는 URL에서 owner/repo 추출하여 시뮬레이션
  const [, , , owner, repo] = url.split('/');
  
  if (!owner || !repo) throw new Error('Invalid GitHub URL');

  try {
    // 2. Gemini API 호출을 위한 프롬프트 구성
    const prompt = `
      너는 세계 최고의 오픈소스 분석가이자 기술 작가야. 
      다음 GitHub 레포지토리 정보를 바탕으로 한국어 상세 요약 보고서를 작성해줘.
      레포지토리 주소: ${url}

      [요청 사항]
      1. 프로젝트의 한 줄 정의 (One-liner)를 작성할 것.
      2. 사용된 기술 스택을 리스트 형태로 상세히 나열할 것.
      3. 핵심 기능을 3~5가지로 요약하여 설명할 것.
      4. 전체 내용을 Markdown 형식으로 풍부하게 작성할 것 (## 섹션 구분 사용).
      5. 답변은 반드시 '한국어'로만 작성할 것.
      6. 배포 환경(Docker, Node.js, Python 등) 중 가장 적합한 하나를 골라줄 것.

      [출력 형식 JSON]
      {
        "name": "프로젝트 이름",
        "oneLiner": "한 줄 정의",
        "techTags": ["태그1", "태그2"],
        "environment": "Docker | Node.js | Python | Go | Rust | Other",
        "summary": "마크다운 요약 본문"
      }
    `;

    // 3. 실제 Gemini API 호출 (API_KEY가 없을 경우 Mock 데이터 반환)
    let resultData;
    if (GEMINI_API_KEY) {
      const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      resultData = JSON.parse(text);
    } else {
      // Mock Data for Demo
      resultData = {
        name: repo,
        oneLiner: `${repo} 프로젝트는 혁신적인 AI 기반 오픈소스 솔루션입니다.`,
        techTags: ["TypeScript", "React", "Tailwind", "Gemini API"],
        environment: "Node.js",
        summary: `## 📝 프로젝트 개요\n${repo}는 사용자의 워크플로우를 자동화하고 효율성을 극대화하기 위해 설계된 강력한 도구입니다.\n\n## 🛠 기술 스택\n- **Frontend**: React, TypeScript, Tailwind CSS\n- **AI Engine**: Google Gemini 1.5 Pro\n- **Runtime**: Node.js v20+\n\n## 🚀 핵심 기능\n1. **자동 요약**: 긴 README 파일을 한눈에 보기 쉽게 요약합니다.\n2. **기술 스택 감지**: 프로젝트에서 사용된 주요 라이브러리를 자동으로 분석합니다.\n3. **실시간 커뮤니티**: 인벤토리 스타일의 채팅창을 통해 다른 개발자와 소통할 수 있습니다.\n\n## ⚙️ 설치 방법\n\`\`\`bash\ngit clone ${url}\nnpm install\nnpm run dev\n\`\`\``
      };
    }

    const newSummary: RepositorySummary = {
      id: Math.random().toString(36).substr(2, 9),
      url,
      name: resultData.name || repo,
      oneLiner: resultData.oneLiner,
      description: resultData.oneLiner,
      techTags: resultData.techTags,
      environment: resultData.environment,
      stars: Math.floor(Math.random() * 5000), // 실제로는 GitHub API에서 가져와야 함
      summary: resultData.summary,
      createdAt: new Date().toISOString(),
    };

    mockCache[url] = newSummary;
    return newSummary;
  } catch (err) {
    console.error('Gemini API Error:', err);
    throw err;
  }
};
