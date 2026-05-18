import { RepositorySummary } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const mockCache: Record<string, RepositorySummary> = {};

export const summarizeRepository = async (url: string): Promise<RepositorySummary> => {
  if (mockCache[url]) {
    return mockCache[url];
  }

  const [, , , owner, repo] = url.split('/');
  if (!owner || !repo) throw new Error('Invalid GitHub URL');

  try {
    const prompt = `
      [ROLE]
      귀하는 사용자가 입력한 깃허브 리포지토리를 객관적이고 정확하게 분석하여 보고하는 "전문 AI 텍스트 비서"입니다. 

      [STYLE GUIDE]
      1. 어조: 감정 표현, 서술형 문장, 불필요한 미사여구를 모두 배제하십시오. "~입니다", "~함" 형태의 담백한 어조를 사용하십시오.
      2. 금지사항: 이모티콘을 완전히 배제하십시오. "반가워요", "멘토입니다" 등 친근한 표현을 절대 금지합니다.
      3. 구조: 대제목(##), 소제목(###), 구분선(---)을 사용하여 보고서 형태로 구조화하십시오.
      4. 가공: 모든 정보는 불릿 포인트(*)와 굵은 글씨(**굵게**)를 조합하여 출력하십시오.
      5. 팩트: 오직 제공된 레포지토리 정보(README)를 기반으로만 분석하십시오. 정보가 없으면 "해당 리포지토리 내 정보 없음"으로 명시하십시오.

      [ANALYSIS TARGET]
      GitHub Repo URL: ${url}

      [OUTPUT FORMAT JSON]
      {
        "name": "프로젝트 이름",
        "oneLiner": "객관적으로 요약된 프로젝트 정의",
        "techTags": ["기술1", "기술2"],
        "environment": "Docker | Node.js | Python | Go | Rust | Other",
        "summary": "지정된 보고서 포맷에 맞춘 마크다운 분석 본문"
      }

      [REPORT TEMPLATE]
      ## 프로젝트 개요
      (내용)
      ---
      ## 기술 스택
      * **언어 및 프레임워크:** (내용)
      * **스타일 및 UI:** (내용)
      * **런타임 및 백엔드:** (내용)
      ---
      ## 핵심 기능
      * **(기능명):** (설명)
      ---
      ## 설치 및 실행 방법
      \`\`\`bash
      (명령어)
      \`\`\`
    `;

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
      // Mock Data with Professional Secretary Persona
      resultData = {
        name: repo,
        oneLiner: `${repo} 리포지토리는 오픈소스 기반의 기술 분석 솔루션임.`,
        techTags: ["TypeScript", "Vite", "Tailwind CSS"],
        environment: "Node.js",
        summary: `## 프로젝트 개요
GitHub 리포지토리의 README 및 소스 코드를 분석하여 구조화된 보고서를 생성하는 도구임.

---

## 기술 스택
* **언어 및 프레임워크:** TypeScript, React 19
* **스타일 및 UI:** Tailwind CSS v4, Lucide React
* **런타임 및 백엔드:** Node.js, Vite

---

## 핵심 기능
* **자동 요약 분석:** 입력된 URL의 README 텍스트를 정제된 데이터로 변환함.
* **기술 스택 분류:** 프로젝트 내 사용된 주요 의존성을 식별하여 보고함.
* **실시간 통신:** 사용자 간 텍스트 기반 정보 공유 기능을 제공함.

---

## 설치 및 실행 방법
\`\`\`bash
git clone ${url}
npm install
npm run build
\`\`\``
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
      stars: Math.floor(Math.random() * 5000),
      summary: resultData.summary,
      createdAt: new Date().toISOString(),
    };

    mockCache[url] = newSummary;
    return newSummary;
  } catch (err) {
    console.error('Secretary API Error:', err);
    throw err;
  }
};
