import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { summarizeRepository } from './summarize';

describe('summarizeRepository', () => {
  beforeEach(() => {
    vi.stubEnv('GEMINI_API_KEY', '');
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });
  it('should throw an error for invalid GitHub URL', async () => {
    await expect(summarizeRepository('invalid-url')).rejects.toThrow('Invalid GitHub URL');
  });

  it('should return fake data with the API key missing error message when the key is not set', async () => {
    // Generate a unique cache-busting URL so we do not hit the module cache
    const randomUrl = `https://github.com/test-owner/test-repo-${Date.now()}`;
    const result = await summarizeRepository(randomUrl);
    
    expect(result.summary).toContain('환경변수(GEMINI_API_KEY) 설정을 확인해주세요.');
    expect(result.oneLiner).toContain('현재 API 키를 인식하지 못해 가짜 데이터를 출력 중입니다.');
    expect(result.name).toBe('Repository');
  });
});
