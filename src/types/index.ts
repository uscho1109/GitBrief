export interface RepositorySummary {
  id: string;
  url: string;
  name: string;
  oneLiner: string;
  description: string;
  techTags: string[];
  environment: 'Docker' | 'Node.js' | 'Python' | 'Go' | 'Rust' | 'Other';
  stars: number;
  summary: string; // Markdown content
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  nickname: string;
  content: string;
  timestamp: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  nickname: string | null;
}

export interface GlobalState {
  feed: RepositorySummary[];
  cache: Record<string, RepositorySummary>;
  auth: AuthState;
  messages: ChatMessage[];
}
