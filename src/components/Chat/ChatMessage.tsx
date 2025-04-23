import { Message } from '../../types';
import { UserIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useApp } from '../../context/AppContext';

interface ChatMessageProps {
  message: Message;
  isLastMessage: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLastMessage }) => {
  const { state } = useApp();
  const isUser = message.role === 'user';
  
  const currentConversation = state.conversations.find(
    (conv) => conv.messages.some(msg => msg.id === message.id)
  );
  
  const assistant = currentConversation
    ? state.assistants.find(a => a.id === currentConversation.assistantId)
    : null;
  
  return (
    <div 
      className={`py-6 ${!isLastMessage ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
      id={`message-${message.id}`}
    >
      <div className="flex space-x-3 mx-4 sm:mx-6 lg:mx-8">
        {!isUser && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center overflow-hidden">
              {assistant?.avatar ? (
                <img 
                  src={assistant.avatar}
                  alt={`${assistant.name} avatar`}
                  className="w-8 h-8 object-cover"
                />
              ) : (
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" 
                  alt="ChatGPT Logo" 
                  className="w-5 h-5"
                />
              )}
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-hidden max-w-[75%]">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {!isUser && assistant?.name}
            </h3>
            <time 
              className="text-xs text-gray-500 dark:text-gray-400"
              dateTime={message.timestamp.toISOString()}
            >
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </time>
          </div>
          
          <div className={`prose dark:prose-invert prose-sm sm:prose-base max-w-none whitespace-pre-wrap ${
            isUser 
              ? 'bg-gray-200 dark:bg-gray-700 rounded-2xl p-4 text-gray-900 dark:text-white' 
              : 'text-gray-900 dark:text-gray-100'
          }`}>
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
}