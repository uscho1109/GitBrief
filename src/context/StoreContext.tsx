import React, { createContext, useContext, useState, useEffect } from 'react';
import { GlobalState, RepositorySummary, ChatMessage, AuthState } from '../types';

interface StoreContextType extends GlobalState {
  login: (nickname: string) => void;
  addSummary: (summary: RepositorySummary) => void;
  sendMessage: (content: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({ isLoggedIn: false, nickname: null });
  const [feed, setFeed] = useState<RepositorySummary[]>([]);
  const [cache, setCache] = useState<Record<string, RepositorySummary>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', nickname: 'GitBrief_Bot', content: 'Welcome to the global open-source community!', timestamp: new Date().toISOString() }
  ]);

  const login = (nickname: string) => {
    setAuth({ isLoggedIn: true, nickname });
  };

  const addSummary = (summary: RepositorySummary) => {
    setCache(prev => ({ ...prev, [summary.url]: summary }));
    setFeed(prev => [summary, ...prev]);
  };

  const sendMessage = (content: string) => {
    if (!auth.nickname) return;
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      nickname: auth.nickname,
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <StoreContext.Provider value={{ auth, feed, cache, messages, login, addSummary, sendMessage }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
