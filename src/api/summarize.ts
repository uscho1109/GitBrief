import { RepositorySummary } from '../types';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const cache: Record<string, RepositorySummary> = {};

function getApiKey(): string {
  const key =
    (import.meta as any).env?.GEMINI_API_KEY ||
    (import.meta as any).env?.VITE_GEMINI_API_KEY;
  return key ?? '';
}

async function fetchReadme(owner: string, repo: string): Promise<string> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
    { headers: { Accept: 'application/vnd.github.v3.raw' } }
  );
  if (!res.ok) throw new Error(`README를 가져올 수 없습니다 (${res.status})`);
  return res.text();
}

async function callGemini(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini API 오류 (${res.status}): ${errBody}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini 응답에서 텍스트를 추출할 수 없습니다.');
  return text;
}

function buildPrompt(readme: string): string {
  const trimmed = readme.slice(0, 3000);
  return `
너는 GitHub 레포지토리 README를 분석해 구조화된 JSON을 반환하는 에이전트야.

[규칙]
1. README 내용만 기반으로 분석하라. 없는 정보는 "정보 없음"으로 표기하라.
2. 모든 텍스트는 한국어로 출력하라.
3. JSON 외 텍스트는 절대 출력하지 마라.

[GitHub README]
${trimmed}

[출력 형식 - JSON만]
{
  "name": "프로젝트 이름",
  "oneLiner": "이 프로젝트를 명확하게 정의하는 한 줄 설명 (한국어)",
  "techTags": ["기술1", "기술2", "기술3"],
  "environment": "Docker | Node.js | Python | Go | Rust | Other 중 하나",
  "summary": "## [프로젝트 이름] 요약\\n- **한 줄 개요:** (한국어)\\n- **핵심 기능:**\\n  * (기능1)\\n  * (기능2)\\n  * (기능3)\\n- **주요 기술 스택:** (짧게 나열)"
}
`.trim();
}

function parseGeminiResult(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    // JSON 파싱 실패 시 텍스트에서 JSON 블록 추출 시도
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Gemini 응답을 JSON으로 파싱할 수 없습니다.');
  }
}

function parseGitHubUrl(url: string): { owner: string; repo: string } {
  const cleaned = url.trim().replace(/\.git$/, '');
  const match = cleaned.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error('올바른 GitHub URL 형식이 아닙니다. (예: https://github.com/owner/repo)');
  return { owner: match[1], repo: match[2] };
}

export const summarizeRepository = async (url: string): Promise<RepositorySummary> => {
  if (cache[url]) return cache[url];

  const { owner, repo } = parseGitHubUrl(url);
  const apiKey = getApiKey();

  if (!apiKey) {
    // API 키 없음 — 안내 메시지 반환
    const fallback: RepositorySummary = {
      id: Math.random().toString(36).slice(2, 9),
      url,
      name: repo,
      oneLiner: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다.',
      description: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다.',
      techTags: [],
      environment: 'Other',
      stars: 0,
      summary: '## 설정 필요\n- `.env` 파일에 `VITE_GEMINI_API_KEY`를 추가해주세요.',
      createdAt: new Date().toISOString(),
    };
    return fallback;
  }

  const readme = await fetchReadme(owner, repo);
  const prompt = buildPrompt(readme);
  const rawText = await callGemini(apiKey, prompt);
  const data = parseGeminiResult(rawText);

  const summary: RepositorySummary = {
    id: Math.random().toString(36).slice(2, 9),
    url,
    name: data.name || repo,
    oneLiner: data.oneLiner || '요약 정보 없음',
    description: data.oneLiner || '요약 정보 없음',
    techTags: Array.isArray(data.techTags) ? data.techTags : [],
    environment: data.environment || 'Other',
    stars: 0,
    summary: data.summary || '## 분석 결과 없음\n요약 정보를 생성할 수 없습니다.',
    createdAt: new Date().toISOString(),
  };

  cache[url] = summary;
  return summary;
};
