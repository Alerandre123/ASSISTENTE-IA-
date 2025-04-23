import { createContext, useContext, useEffect, useState } from 'react';
import { AppState, Assistant, Conversation, Message } from '../types';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';

const initialState: AppState = {
  conversations: [],
  assistants: [],
  currentConversationId: null,
  currentAssistantId: null,
  apiKey: '',
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
};

const AppContext = createContext<{
  state: AppState;
  createConversation: (assistantId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  setCurrentConversation: (conversationId: string) => void;
  createAssistant: (assistant: Omit<Assistant, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAssistant: (assistant: Assistant) => void;
  setApiKey: (apiKey: string) => void;
  toggleDarkMode: () => void;
  deleteConversation: (conversationId: string) => void;
  deleteAssistant: (assistantId: string) => void;
}>({
  state: initialState,
  createConversation: () => {},
  sendMessage: async () => {},
  setCurrentConversation: () => {},
  createAssistant: () => {},
  updateAssistant: () => {},
  setApiKey: () => {},
  toggleDarkMode: () => {},
  deleteConversation: () => {},
  deleteAssistant: () => {},
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AppState>(() => {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        
        // Convert date strings back to Date objects
        parsedState.conversations = parsedState.conversations.map((conv: any) => ({
          ...conv,
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
        }));
        
        parsedState.assistants = parsedState.assistants.map((asst: any) => ({
          ...asst,
          createdAt: new Date(asst.createdAt),
          updatedAt: new Date(asst.updatedAt),
        }));
        
        return parsedState;
      } catch (e) {
        console.error('Failed to load saved state:', e);
        return initialState;
      }
    }
    return initialState;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  const createConversation = (assistantId: string) => {
    const newConversation: Conversation = {
      id: uuidv4(),
      title: 'Nova Conversa',
      messages: [],
      assistantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setState((prev) => ({
      ...prev,
      conversations: [newConversation, ...prev.conversations],
      currentConversationId: newConversation.id,
    }));
  };

  const setCurrentConversation = (conversationId: string) => {
    setState((prev) => ({
      ...prev,
      currentConversationId: conversationId,
    }));
  };

  const sendMessage = async (content: string) => {
    if (!state.currentConversationId || !state.apiKey) return;

    const currentConversation = state.conversations.find(
      (conv) => conv.id === state.currentConversationId
    );
    
    if (!currentConversation) return;

    const currentAssistant = state.assistants.find(
      (asst) => asst.id === currentConversation.assistantId
    );
    
    if (!currentAssistant) return;

    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setState((prev) => {
      const updatedConversations = prev.conversations.map((conv) => {
        if (conv.id === prev.currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, userMessage],
            updatedAt: new Date(),
            title: conv.messages.length === 0 ? content.slice(0, 30) + (content.length > 30 ? '...' : '') : conv.title,
          };
        }
        return conv;
      });

      return {
        ...prev,
        conversations: updatedConversations,
      };
    });

    try {
      const openai = new OpenAI({
        apiKey: state.apiKey,
        dangerouslyAllowBrowser: true
      });

      const messages = [
        { role: 'system', content: currentAssistant.systemPrompt },
        ...currentConversation.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages as any[],
        temperature: 0.7,
      });

      const assistantMessage: Message = {
        id: uuidv4(),
        content: response.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.',
        role: 'assistant',
        timestamp: new Date(),
      };

      setState((prev) => {
        const updatedConversations = prev.conversations.map((conv) => {
          if (conv.id === prev.currentConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, assistantMessage],
              updatedAt: new Date(),
            };
          }
          return conv;
        });

        return {
          ...prev,
          conversations: updatedConversations,
        };
      });
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      
      const errorMessage: Message = {
        id: uuidv4(),
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, verifique sua chave API e tente novamente.',
        role: 'assistant',
        timestamp: new Date(),
      };

      setState((prev) => {
        const updatedConversations = prev.conversations.map((conv) => {
          if (conv.id === prev.currentConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, errorMessage],
              updatedAt: new Date(),
            };
          }
          return conv;
        });

        return {
          ...prev,
          conversations: updatedConversations,
        };
      });
    }
  };

  const createAssistant = (assistant: Omit<Assistant, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAssistant: Assistant = {
      ...assistant,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setState((prev) => ({
      ...prev,
      assistants: [...prev.assistants, newAssistant],
      currentAssistantId: newAssistant.id,
    }));

    createConversation(newAssistant.id);
  };

  const updateAssistant = (assistant: Assistant) => {
    setState((prev) => ({
      ...prev,
      assistants: prev.assistants.map((a) => (a.id === assistant.id ? { ...assistant, updatedAt: new Date() } : a)),
    }));
  };

  const setApiKey = (apiKey: string) => {
    setState((prev) => ({
      ...prev,
      apiKey,
    }));
  };

  const toggleDarkMode = () => {
    setState((prev) => ({
      ...prev,
      darkMode: !prev.darkMode,
    }));
  };

  const deleteConversation = (conversationId: string) => {
    setState((prev) => {
      const updatedConversations = prev.conversations.filter((conv) => conv.id !== conversationId);
      
      let newCurrentId = prev.currentConversationId;
      if (prev.currentConversationId === conversationId) {
        newCurrentId = updatedConversations.length > 0 ? updatedConversations[0].id : null;
      }
      
      return {
        ...prev,
        conversations: updatedConversations,
        currentConversationId: newCurrentId,
      };
    });
  };

  const deleteAssistant = (assistantId: string) => {
    setState((prev) => {
      const updatedAssistants = prev.assistants.filter((asst) => asst.id !== assistantId);
      const updatedConversations = prev.conversations.filter((conv) => conv.assistantId !== assistantId);
      
      let newCurrentConversationId = prev.currentConversationId;
      if (!updatedConversations.find(conv => conv.id === prev.currentConversationId)) {
        newCurrentConversationId = updatedConversations.length > 0 ? updatedConversations[0].id : null;
      }
      
      const newCurrentAssistantId = prev.currentAssistantId === assistantId ? null : prev.currentAssistantId;
      
      return {
        ...prev,
        assistants: updatedAssistants,
        conversations: updatedConversations,
        currentConversationId: newCurrentConversationId,
        currentAssistantId: newCurrentAssistantId,
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        createConversation,
        sendMessage,
        setCurrentConversation,
        createAssistant,
        updateAssistant,
        setApiKey,
        toggleDarkMode,
        deleteConversation,
        deleteAssistant,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);