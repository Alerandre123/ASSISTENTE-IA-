import React from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/Layout/Sidebar';
import { ChatWindow } from '../components/Chat/ChatWindow';

export const Home: React.FC = () => {
  return (
    <div className="flex h-[calc(100vh-4rem)] relative">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        <ChatWindow />
      </main>
    </div>
  );
};