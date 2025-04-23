import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { KeyRound, Check, Eye, EyeOff } from 'lucide-react';

export const ApiSettings: React.FC = () => {
  const { state, setApiKey } = useApp();
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  useEffect(() => {
    setApiKeyInput(state.apiKey || '');
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedKey = apiKeyInput.trim();
    if (!trimmedKey) return;
    
    setApiKey(trimmedKey);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        API Configuration
      </h2>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              OpenAI API Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type={showApiKey ? 'text' : 'password'}
                id="apiKey"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk-..."
                className="block w-full pl-10 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1 mr-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                >
                  {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <a
              href="https://platform.openai.com/account/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Get API key from OpenAI
            </a>
            
            <button
              type="submit"
              disabled={!apiKeyInput.trim()}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition-colors duration-200 ${
                apiKeyInput.trim()
                  ? 'text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  : 'text-gray-400 bg-gray-200 cursor-not-allowed'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                  Saved
                </>
              ) : (
                'Save API Key'
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
          About API Usage
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          Adding your OpenAI API key allows this app to connect directly to OpenAI's models. Without an API key, this demo app uses simulated responses. Your key enables personal access to AI models and is required for custom assistant training.
        </p>
      </div>
    </div>
  );
};