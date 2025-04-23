import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [message]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled) return;
    
    onSendMessage(message);
    setMessage('');
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-4 px-4 sm:px-6 lg:px-8 sticky bottom-0">
      <form 
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto relative"
      >
        <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus-within:ring-2 focus-within:ring-blue-600 dark:focus-within:ring-blue-500">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mensagem para o Assistente IA..."
            rows={1}
            disabled={disabled}
            className="block w-full resize-none border-0 bg-transparent py-3 px-4 pr-16 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-0 sm:leading-6 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          <div className="absolute right-2 bottom-2.5">
            <button
              type="submit"
              disabled={!message.trim() || disabled}
              className={`p-2.5 rounded-full transition-all duration-200 ${
                message.trim() && !disabled
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-400/20' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              } flex items-center justify-center`}
              style={{
                minWidth: '44px',
                minHeight: '44px'
              }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          Pressione Enter para enviar, Shift+Enter para nova linha
        </p>
      </form>
    </div>
  );
};