import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Repository, ChatMessage, User, SummaryCache } from '../types';

interface AppContextType {
  user: User;
  login: (nickname: string) => void;
  logout: () => void;
  feed: Repository[];
  cache: SummaryCache;
  addRepository: (repo: Repository) => void;
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  isChatOpen: boolean;
  setChatOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('gb_user');
    return saved ? JSON.parse(saved) : { nickname: '', isLoggedIn: false };
  });

  const [cache, setCache] = useState<SummaryCache>({});
  const [feed, setFeed] = useState<Repository[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'System', text: 'GitBrief 실시간 채널에 오신 것을 환영합니다!', timestamp: new Date().toISOString() }
  ]);
  const [isChatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('gb_user', JSON.stringify(user));
  }, [user]);

  const login = (nickname: string) => {
    setUser({ nickname, isLoggedIn: true });
  };

  const logout = () => {
    setUser({ nickname: '', isLoggedIn: false });
    localStorage.removeItem('gb_user');
  };

  const addRepository = (repo: Repository) => {
    // 알잘딱 캐싱: 이미 캐시에 있으면 피드 최상단으로만 이동
    if (cache[repo.url]) {
      setFeed(prev => [cache[repo.url], ...prev.filter(r => r.url !== repo.url)]);
      return;
    }
    
    setCache(prev => ({ ...prev, [repo.url]: repo }));
    setFeed(prev => [repo, ...prev]);
  };

  const sendMessage = (text: string) => {
    if (!user.isLoggedIn) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: user.nickname,
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <AppContext.Provider value={{
      user, login, logout, feed, cache, addRepository, messages, sendMessage, isChatOpen, setChatOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
