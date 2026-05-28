import { RepositorySummary } from '../types';


const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const mockCache: Record<string, RepositorySummary> = {};

export const summarizeRepository = async (url: string): Promise<RepositorySummary> => {
  const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

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

    // 1. 결과 데이터를 담을 변수 선언 및 안전한 초기값 설정
  let resultData: any = {
    name: "Repository",
    oneLiner: "분석 진행 중 또는 오류 발생함.",
    techTags: [],
    environment: "",
    summary: ""
  };

  if (GEMINI_API_KEY) {
    // 2. 주소에서 유저이름과 저장소이름 분리
    const cleanedUrl = url.trim().replace("https://github.com/", "").replace(".git", "");
    const [extractedOwner, extractedRepoName] = cleanedUrl.split("/");

    // 🚨 중간에 return으로 끊지 않고, 올바른 주소일 때만 진짜 AI 로직을 실행하도록 감싸줍니다.
    if (extractedOwner && extractedRepoName) {
      const repoName = extractedRepoName;

      try {
        // 3. 깃허브에서 진짜 리드미 글자 가져오기
        const githubResponse = await fetch(`https://api.github.com/repos/${extractedOwner}/${repoName}/readme`, {
          headers: { 'Accept': 'application/vnd.github.v3.raw' }
        });

        if (githubResponse.ok) {
          const realReadmeContent = await githubResponse.text();

          // 4. 비서형 지시문과 진짜 데이터 합치기
          const systemInstruction = `귀하는 사용자가 입력한 깃허브 리포지토리의 README를 객관적으로 분석하여 보고하는 전문 AI 텍스트 비서입니다. 인사말, 감정 표현, 이모티콘을 모두 배제하고 담백한 어조로 정제된 데이터만 출력하세요. 오직 [DATA] 영역에 주어지는 텍스트만을 기반으로 작성해야 하며, 절대로 지어내거나 기존 예시를 복사하지 마세요. 만약 [DATA]에 내용이 없다면 모든 항목을 "정보 없음"으로 표기하세요.`;
          
          const finalPrompt = `
            ${systemInstruction}

            아래 [DATA]에 제공된 텍스트를 분석하여 1) 프로젝트 개요, 2) 기술 스택, 3) 핵심 기능, 4) 설치 및 실행 방법을 요약 포맷에 맞게 출력해줘.

            [DATA]
            ${realReadmeContent}
          `;

          // 5. 진짜 데이터를 담아 AI에게 전송
          const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: finalPrompt }] }],
              generationConfig: { responseMimeType: "application/json" }
            })
          });

          const data = await response.json();
          const text = data.candidates[0].content.parts[0].text;
          
          // 결과 맵핑
          resultData = JSON.parse(text) as any;
        } else {
          resultData.summary = "## 오류\n깃허브 리포지토리를 찾을 수 없거나 README 파일이 없습니다.";
        }
      } catch (error) {
        resultData.summary = "## 오류\n데이터를 가져오는 중 알 수 없는 시스템 오류가 발생했습니다.";
      }
    } else {
      resultData.summary = "## 오류\n올바른 깃허브 주소 형식이 아닙니다.";
    }

  } else {
    // API 키가 없을 때 작동하는 가짜 데이터 구역
    resultData = {
      name: "Repository",
      oneLiner: "현재 API 키를 인식하지 못해 가짜 데이터를 출력 중입니다.",
      techTags: ["TypeScript", "Vite", "Tailwind CSS"],
      environment: "Node.js",
      summary: `## 프로젝트 개요
환경변수(GEMINI_API_KEY) 설정을 확인해주세요.`
    } as any;
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
