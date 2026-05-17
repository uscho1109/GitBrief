import React from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import FeedGrid from './components/FeedGrid';

function App() {
  return (
    <AppProvider>
      <Layout>
        <FeedGrid />
      </Layout>
    </AppProvider>
  );
}

export default App;
