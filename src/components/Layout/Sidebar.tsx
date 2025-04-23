import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlusCircle, Trash2, MessageSquare, Menu, X, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Sidebar: React.FC = () => {
  const { 
    state, 
    createConversation, 
    setCurrentConversation,
    deleteConversation
  } = useApp();
  
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleNewChat = () => {
    const currentAssistantId = state.currentAssistantId || 'default';
    createConversation(currentAssistantId);
    setIsMobileMenuOpen(false);
  };
  
  const handleDeleteClick = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    setShowConfirmDelete(conversationId);
  };
  
  const handleConfirmDelete = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    deleteConversation(conversationId);
    setShowConfirmDelete(null);
  };
  
  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmDelete(null);
  };

  const handleConversationClick = (conversationId: string) => {
    setCurrentConversation(conversationId);
    setIsMobileMenuOpen(false);
  };
  
  const sidebarContent = (
    <>
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Nova Conversa</span>
        </button>
      </div>
      
      <div className="px-4 py-2">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Conversas Recentes
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {state.conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Nenhuma conversa ainda. Inicie uma nova conversa!
          </div>
        ) : (
          <ul className="space-y-1 px-2">
            {state.conversations.map((conversation) => {
              const assistant = state.assistants.find(a => a.id === conversation.assistantId);
              const isActive = conversation.id === state.currentConversationId;
              
              return (
                <li key={conversation.id}>
                  <button
                    onClick={() => handleConversationClick(conversation.id)}
                    className={`w-full text-left p-2 rounded-md flex items-start gap-3 group ${
                      isActive 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <MessageSquare className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {conversation.title || 'Nova conversa'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                        <span>{assistant?.name || 'Assistente IA'}</span>
                        <span>{formatDistanceToNow(conversation.updatedAt, { addSuffix: true, locale: ptBR })}</span>
                      </div>
                    </div>
                    
                    {showConfirmDelete === conversation.id ? (
                      <div 
                        className="flex items-center gap-1"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => handleConfirmDelete(e, conversation.id)}
                          className="text-red-600 dark:text-red-400 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelDelete}
                          className="text-gray-600 dark:text-gray-400 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleDeleteClick(e, conversation.id)}
                        className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
  
  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed inset-0 z-30 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="h-full w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {sidebarContent}
        </div>
        
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 -z-10"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-gray-50 dark:bg-gray-800 h-full flex-col border-r border-gray-200 dark:border-gray-700">
        {sidebarContent}
      </aside>
    </>
  );
};