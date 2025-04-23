import React from 'react';
import { MoonIcon, SunIcon, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const { state, toggleDarkMode } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 
            className="text-xl font-semibold text-gray-900 dark:text-white cursor-pointer"
            onClick={() => navigate('/')}
          >
            <span className="text-blue-600 dark:text-blue-500">IA</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={state.darkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          >
            {state.darkMode ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>
          
          <button
            onClick={() => navigate(location.pathname === '/settings' ? '/' : '/settings')}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              location.pathname === '/settings' 
                ? 'text-blue-600 dark:text-blue-500' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
            aria-label="Configurações"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};