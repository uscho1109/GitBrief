export interface Repository {
  id: string;
  name: string;
  full_name: string;
  description: string;
  url: string;
  stars: number;
  tags: string[];
  environment: 'Docker' | 'Node.js' | 'Python' | 'Go' | 'Rust' | 'Unknown';
  summary: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

export interface User {
  nickname: string;
  isLoggedIn: boolean;
}

export interface SummaryCache {
  [url: string]: Repository;
}
