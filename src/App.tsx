import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Settings } from './pages/Settings';
import { Header } from './components/Layout/Header';
import { AppProvider, useApp } from './context/AppContext';

// Theme wrapper component
const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useApp();
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);
  
  return children;
};

function AppRoutes() {
  return (
    <ThemeWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </ThemeWrapper>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;