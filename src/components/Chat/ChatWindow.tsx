import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ArrowRight } from 'lucide-react';

export const ChatWindow: React.FC = () => {
  const { state, sendMessage, createConversation } = useApp();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  const currentConversation = state.conversations.find(
    (conv) => conv.id === state.currentConversationId
  );
  
  const currentAssistant = currentConversation 
    ? state.assistants.find((asst) => asst.id === currentConversation.assistantId)
    : null;
  
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation?.messages]);
  
  if (!currentConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Bem-vindo ao Assistente IA
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 max-w-md mb-8">
          Inicie uma nova conversa ou selecione uma existente na barra lateral.
        </p>
        <button
          onClick={() => {
            const assistantId = state.currentAssistantId || 'default';
            createConversation(assistantId);
          }}
          className="flex items-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
        >
          Iniciar nova conversa
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Chat header */}
      <div className="border-b border-gray-200 dark:border-gray-700 py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {currentAssistant?.name || 'Assistente IA'}
          </h2>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto overscroll-y-contain">
        {currentConversation.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="max-w-md text-center">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Converse com {currentAssistant?.name || 'Assistente IA'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {currentAssistant?.description || 'Um assistente de IA prestativo pronto para conversar com você.'}
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-medium mb-2">Exemplos que você pode tentar:</p>
                <ul className="space-y-2">
                  <li>
                    <button 
                      className="text-left w-full hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => sendMessage("Como você pode me ajudar?")}
                    >
                      "Como você pode me ajudar?"
                    </button>
                  </li>
                  <li>
                    <button 
                      className="text-left w-full hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => sendMessage("Me conte um fato interessante sobre inteligência artificial.")}
                    >
                      "Me conte um fato interessante sobre inteligência artificial."
                    </button>
                  </li>
                  <li>
                    <button 
                      className="text-left w-full hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => sendMessage("Como criar um assistente personalizado?")}
                    >
                      "Como criar um assistente personalizado?"
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="pb-4">
            {currentConversation.messages.map((message, index) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                isLastMessage={index === currentConversation.messages.length - 1}
              />
            ))}
            <div ref={endOfMessagesRef} />
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="mt-auto">
        <ChatInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
};