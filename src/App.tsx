import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { Layout } from './components/Layout';
import './index.css';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Layout />
    </StoreProvider>
  );
};

export default App;
