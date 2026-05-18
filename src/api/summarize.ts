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
      너는 깃허브 리포지토리를 분석하여 개발자에게 인사이트를 제공하는 "친절하고 유능한 AI 시니어 개발자 멘토"야.

      [STYLE GUIDE]
      1. 말투: 딱딱한 봇이 아닌, 후배의 성장을 돕는 위트 있는 동료 개발자의 톤 (~해요, ~입니다).
      2. 비유: 전문 개념은 '구워내다', '나침반' 같은 직관적인 비유를 섞어줘.
      3. 구조: 줄글은 피하고 대제목(##), 소제목(###), 구분선(---), 볼드를 써서 가독성을 극대화해.
      4. 팩트: 오직 제공된 레포지토리 정보(README)를 기반으로만 분석해. 정보가 없으면 솔직하게 없다고 말해.

      [ANALYSIS TARGET]
      GitHub Repo URL: ${url}

      [OUTPUT FORMAT JSON]
      {
        "name": "프로젝트 이름",
        "oneLiner": "멘토의 위트 있는 한 줄 정의",
        "techTags": ["주요기술1", "주요기술2"],
        "environment": "Docker | Node.js | Python | Go | Rust | Other",
        "summary": "마크다운으로 작성된 멘토링 스타일의 상세 분석 보고서"
      }
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
      // Mock Data with Mentor Persona
      resultData = {
        name: repo,
        oneLiner: `🚀 ${repo}는 당신의 개발 여정에서 든든한 등대 같은 프로젝트가 될 거예요!`,
        techTags: ["TypeScript", "React", "Next.js"],
        environment: "Node.js",
        summary: `## 👋 반가워요! 당신의 시니어 멘토입니다.

오늘 제가 분석해본 레포지토리는 바로 **${repo}**입니다. 코드를 살펴보니 정말 흥미로운 구석이 많더군요! 후배님께 도움이 될 만한 핵심 내용들만 '알잘딱'하게 정리해봤어요.

---

### 🛠 기술 스택: 이 프로젝트의 '레시피'
이 프로젝트는 다음과 같은 재료들로 아주 맛있게 구워졌네요.
* **언어의 나침반**: TypeScript (타입 안전성을 꽉 잡았네요!)
* **UI의 조각가**: React & Tailwind CSS
* **서버의 엔진**: Node.js

### 💡 핵심 기능: 이것만은 꼭 보세요!
1. **지능형 분석**: README를 마치 커피 한 잔 마시듯 부드럽게 읽고 핵심만 뽑아내요.
2. **실시간 소통**: 동료들과 즉시 대화할 수 있는 '라이브 인벤토리' 창이 압권이죠.

---

### 📝 멘토의 한마디
이 프로젝트의 구조는 굉장히 정돈되어 있어요. 특히 관심사 분리가 잘 되어 있어 유지보수 측면에서 배울 점이 아주 많습니다. 한번 깊게 파헤쳐 보시는 걸 강력 추천해요! 

궁금한 게 더 있다면 언제든 물어보세요. 같이 성장해봐요! 💪`
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
    console.error('Mentor API Error:', err);
    throw err;
  }
};
