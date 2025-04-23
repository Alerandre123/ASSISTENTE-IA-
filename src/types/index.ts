export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  assistantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assistant {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppState {
  conversations: Conversation[];
  assistants: Assistant[];
  currentConversationId: string | null;
  currentAssistantId: string | null;
  apiKey: string;
  darkMode: boolean;
}