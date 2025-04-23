import React from 'react';
import { AssistantSettings } from '../components/Settings/AssistantSettings';
import { ApiSettings } from '../components/Settings/ApiSettings';

export const Settings: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Settings
      </h1>
      
      <div className="space-y-10">
        <ApiSettings />
        <AssistantSettings />
      </div>
    </div>
  );
};